import { useId, useRef, useState, type KeyboardEvent } from "react";
import {
  CATEGORY_FAMILY,
  CATEGORY_ORDER,
  CATEGORY_SHORT,
  skillName,
  skills,
  type Skill,
  type SkillCategory,
} from "../../data/skills";
import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";

/**
 * Donut "skill explorer". The ring is divided into one arc per skillset and the
 * hole is a live detail panel. Clicking a skillset expands its wedge and splits
 * it into one sub-arc per skill — labels curve along the ring, and each sub-arc's
 * fill opacity encodes proficiency. Clicking a skill drops its detail into the
 * centre, tinted with the skillset's colour. Selecting another skillset resets.
 *
 * It stays a real disclosure for keyboard/AT users: arcs are buttons (skillsets
 * carry aria-expanded, skills aria-pressed + a proficiency label) and the centre
 * is an aria-live region.
 */

// ----- Geometry (SVG user units; the viewBox scales to the container) --------
const VIEW = 460;
const C = VIEW / 2; // centre
const RING_OUTER = 160;
const RING_INNER = 116;
const LABEL_R = (RING_OUTER + RING_INNER) / 2; // curved-label baseline
const HOLE_R = 108; // detail circle radius
const GAP_CAT = 2.5; // gap between skillset wedges (deg)
const GAP_SKILL = 1.5; // gap between skill sub-arcs (deg)
const ACTIVE_SPAN = 196; // degrees the open skillset expands to

const polar = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180; // 0° points up, clockwise
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};

/** Filled donut segment between two angles. */
const donutSeg = (a0: number, a1: number): string => {
  const [x0o, y0o] = polar(RING_OUTER, a0);
  const [x1o, y1o] = polar(RING_OUTER, a1);
  const [x1i, y1i] = polar(RING_INNER, a1);
  const [x0i, y0i] = polar(RING_INNER, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${x0o} ${y0o}`,
    `A ${RING_OUTER} ${RING_OUTER} 0 ${large} 1 ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${RING_INNER} ${RING_INNER} 0 ${large} 0 ${x0i} ${y0i}`,
    "Z",
  ].join(" ");
};

/** Open arc for a <textPath>; reversed on the bottom half so text stays upright. */
const labelPath = (a0: number, a1: number): string => {
  const mid = (a0 + a1) / 2;
  const flip = mid > 90 && mid < 270;
  const [sa, ea, sweep] = flip ? [a1, a0, 0] : [a0, a1, 1];
  const [x0, y0] = polar(LABEL_R, sa);
  const [x1, y1] = polar(LABEL_R, ea);
  return `M ${x0} ${y0} A ${LABEL_R} ${LABEL_R} 0 0 ${sweep} ${x1} ${y1}`;
};

const familyVar = (cat: SkillCategory) => `var(--${CATEGORY_FAMILY[cat]})`;
const accentVar = (cat: SkillCategory) =>
  `var(--${CATEGORY_FAMILY[cat]}-accent)`;
const skillsOf = (cat: SkillCategory) =>
  skills.filter((s) => s.category === cat);

interface Wedge {
  cat: SkillCategory;
  a0: number;
  a1: number;
}

/**
 * Angular layout of the six skillset wedges. When one is open it grows to
 * ACTIVE_SPAN and the rest share the remainder, preserving ring order.
 */
const layout = (active: SkillCategory | null): Wedge[] => {
  const n = CATEGORY_ORDER.length;
  const rest = active ? (360 - ACTIVE_SPAN) / (n - 1) : 360 / n;
  let cursor = 0;
  return CATEGORY_ORDER.map((cat) => {
    const span = active ? (cat === active ? ACTIVE_SPAN : rest) : rest;
    const wedge: Wedge = {
      cat,
      a0: cursor + GAP_CAT / 2,
      a1: cursor + span - GAP_CAT / 2,
    };
    cursor += span;
    return wedge;
  });
};

/** Proficiency-scaled fill opacity, so denser arcs read as deeper expertise. */
const levelOpacity = (level: number) => 0.62 + (level / 100) * 0.38;

const wrapSummary = (text: string, maxChars = 30) => {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
      continue;
    }

    if (next.length > maxChars) {
      const chunk = word.match(/.{1,24}/g) ?? [word];
      if (lines.length === 0) lines.push(...chunk.slice(0, -1));
      current = chunk[chunk.length - 1] ?? "";
      continue;
    }

    current = next;
  }

  if (current) lines.push(current);
  return lines.slice(0, 3);
};

export default function SkillExplorer() {
  const [openCat, setOpenCat] = useState<SkillCategory | null>(null);
  const [selected, setSelected] = useState<Skill | null>(null);
  const [tip, setTip] = useState<{ text: string; mid: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, ""); // stable, querySelector-safe id prefix

  const wedges = layout(openCat);

  const chooseCat = (cat: SkillCategory) => {
    setOpenCat(cat);
    setSelected(null); // reset any prior skill view
    setTip(null);
  };

  const onCatKey = (e: KeyboardEvent, cat: SkillCategory) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      chooseCat(cat);
    }
  };
  const onSkillKey = (e: KeyboardEvent, s: Skill) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(s);
    }
  };

  // Bloom the wedges/sub-arcs out from the centre, and cross-fade the detail.
  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;
      const segs = svg.querySelectorAll<SVGGElement>(".donut-seg");
      const detail = svg.querySelectorAll(".donut-center__animate");

      if (prefersReducedMotion) {
        gsap.set(segs, { opacity: 1, scale: 1 });
        return;
      }
      gsap.fromTo(
        segs,
        { opacity: 0, scale: 0.9, transformOrigin: `${C}px ${C}px` },
        {
          opacity: 1,
          scale: 1,
          transformOrigin: `${C}px ${C}px`,
          duration: 0.45,
          ease: "back.out(1.5)",
          stagger: 0.03,
        },
      );
      if (detail.length)
        gsap.from(detail, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.05,
        });
    },
    { dependencies: [openCat, selected], scope: svgRef },
  );

  const tintCat = selected?.category ?? openCat;

  // One <g class="donut-seg"> per clickable arc (skillset or skill).
  const renderWedge = (w: Wedge) => {
    const isActive = w.cat === openCat;

    if (!isActive) {
      // A whole-skillset toggle. Curved label only when nothing is open yet.
      const pid = `${uid}-cat-${CATEGORY_FAMILY[w.cat]}-${Math.round(w.a0)}`;
      return (
        <g
          key={w.cat}
          className={`donut-seg donut-arc ${openCat ? "is-dimmed" : ""}`}
          role="button"
          tabIndex={0}
          aria-expanded={false}
          aria-label={`${w.cat} skillset`}
          onClick={() => chooseCat(w.cat)}
          onKeyDown={(e) => onCatKey(e, w.cat)}
          onMouseEnter={() => setTip({ text: w.cat, mid: (w.a0 + w.a1) / 2 })}
          onMouseLeave={() => setTip(null)}
          onFocus={() => setTip({ text: w.cat, mid: (w.a0 + w.a1) / 2 })}
          onBlur={() => setTip(null)}
        >
          <path
            d={donutSeg(w.a0, w.a1)}
            style={{ fill: familyVar(w.cat) }}
          />
          {!openCat && (
            <>
              <path id={pid} d={labelPath(w.a0, w.a1)} fill="none" />
              <text
                className="donut-arc__label"
                style={{ fill: accentVar(w.cat) }}
              >
                <textPath href={`#${pid}`} startOffset="50%">
                  {CATEGORY_SHORT[w.cat]}
                </textPath>
              </text>
            </>
          )}
        </g>
      );
    }

    // Active skillset: split the wedge into one sub-arc per skill.
    const list = skillsOf(w.cat);
    const each = (w.a1 - w.a0) / list.length;
    return list.map((s, i) => {
      const a0 = w.a0 + i * each + GAP_SKILL / 2;
      const a1 = w.a0 + (i + 1) * each - GAP_SKILL / 2;
      const isSel = selected?.id === s.id;
      const pid = `${uid}-skill-${s.id}`;
      return (
        <g
          key={s.id}
          className={`donut-seg skill-seg ${isSel ? "is-selected" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={isSel}
          aria-label={`${s.label}, ${s.level}% proficiency${
            s.years ? `, ${s.years} years` : ""
          }`}
          onClick={() => setSelected(s)}
          onKeyDown={(e) => onSkillKey(e, s)}
          onMouseEnter={() => setTip({ text: s.label, mid: (a0 + a1) / 2 })}
          onMouseLeave={() => setTip(null)}
          onFocus={() => setTip({ text: s.label, mid: (a0 + a1) / 2 })}
          onBlur={() => setTip(null)}
        >
          <path
            d={donutSeg(a0, a1)}
            style={{
              fill: familyVar(w.cat),
              fillOpacity: isSel ? 1 : levelOpacity(s.level),
            }}
          />
          <path id={pid} d={labelPath(a0, a1)} fill="none" />
          <text className="skill-seg__label" style={{ fill: accentVar(w.cat) }}>
            <textPath href={`#${pid}`} startOffset="50%">
              {skillName(s)}
            </textPath>
          </text>
        </g>
      );
    });
  };

  return (
    <div className="skill-donut">
      <svg
        ref={svgRef}
        className="skill-donut__svg"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        role="group"
        aria-label="Skill explorer. Choose a skillset to reveal its skills."
      >
        {wedges.map(renderWedge)}

        {/* Tooltip: skillset name, or skill name + proficiency. */}
        {tip &&
          (() => {
            const [tx, ty] = polar(RING_OUTER + 22, tip.mid);
            const w = tip.text.length * 6.6 + 18;
            return (
              <g className="skill-tip" transform={`translate(${tx} ${ty})`}>
                <rect
                  x={-w / 2}
                  y={-13}
                  width={w}
                  height={26}
                  rx={8}
                  className="skill-tip__bg"
                />
                <text className="skill-tip__text">{tip.text}</text>
              </g>
            );
          })()}

        {/* Detail hole. */}
        <circle
          cx={C}
          cy={C}
          r={HOLE_R}
          className="donut-center__disc"
          style={
            tintCat
              ? {
                  fill: `color-mix(in srgb, ${familyVar(tintCat)} 35%, var(--color-surface))`,
                }
              : undefined
          }
        />
        <g
          className="donut-center__svg"
          aria-live="polite"
          role="status"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          {selected ? (
            <>
              <text
                x={C}
                y={C - 30}
                textAnchor="middle"
                className="donut-center__eyebrow donut-center__animate"
              >
                {selected.category}
              </text>
              <text
                x={C}
                y={C - 6}
                textAnchor="middle"
                className="donut-center__title donut-center__animate"
              >
                {selected.label}
              </text>
              {/* 
              <text
                x={C}
                y={C + 34}
                textAnchor="middle"
                className="donut-center__pct donut-center__animate"
              >
                {selected.level}%{selected.years ? ` · ${selected.years}y` : ""}
              </text> */}
              <text
                x={C}
                y={C + 16}
                textAnchor="middle"
                className="donut-center__summary donut-center__animate"
              >
                {wrapSummary(selected.summary).map((line, index) => (
                  <tspan
                    key={`${selected.id}-${index}`}
                    x={C}
                    dy={index === 0 ? 0 : 10}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </>
          ) : openCat ? (
            <>
              <text
                x={C}
                y={C - 8}
                textAnchor="middle"
                className="donut-center__eyebrow"
              >
                {openCat}
              </text>
              <text
                x={C}
                y={C + 18}
                textAnchor="middle"
                className="donut-center__hint"
              >
                Pick a skill on the ring.
              </text>
            </>
          ) : (
            <text
              x={C}
              y={C + 6}
              textAnchor="middle"
              className="donut-center__hint"
            >
              Tap a skillset to break it into skills.
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
