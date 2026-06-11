import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";

/**
 * The rollout story, left → right: one US prototype feeds a globe whose 10+
 * sites light up in sequence, which in turn feeds a parallelized + cached
 * backend (the lanes fill together; the cache chip pulses). Labels live in
 * their own rows so nothing overlaps the pins or arcs.
 */
const GLOBE = { cx: 195, cy: 118, r: 58 };

// 10 site pins evenly distributed around the globe rim (rounded to avoid a
// floating-point hydration mismatch between server and client).
const SITES = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.round((GLOBE.cx + Math.cos(a) * GLOBE.r) * 100) / 100,
    y: Math.round((GLOBE.cy + Math.sin(a) * GLOBE.r) * 100) / 100,
  };
});

export default function GlobalRolloutDiagram() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = root.current!;
      const grid = svg.querySelectorAll(".dg-globe");
      const arcs = svg.querySelectorAll(".dg-arc");
      const origin = ".dg-origin-icon";
      const sites = svg.querySelectorAll(".dg-site");
      const lanes = svg.querySelectorAll(".dg-bar-fill");
      const cache = ".dg-cache";

      if (prefersReducedMotion) {
        gsap.set([...grid, ...arcs], { drawSVG: "100%" });
        gsap.set([origin, sites, cache], { opacity: 1, scale: 1 });
        gsap.set(lanes, { scaleX: 1 });
        return;
      }

      gsap.set([...grid, ...arcs], { drawSVG: "0%" });
      gsap.set([origin, sites, cache], { opacity: 0, scale: 0, transformOrigin: "center" });
      gsap.set(lanes, { scaleX: 0, transformOrigin: "0 50%" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 80%" },
      });

      tl.to(origin, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" })
        .to(arcs[0], { drawSVG: "100%", duration: 0.45 }) // origin → globe
        .to(grid, { drawSVG: "100%", duration: 0.7, stagger: 0.08 }, "-=0.2")
        .to(
          sites,
          { opacity: 1, scale: 1, duration: 0.35, stagger: 0.06, ease: "back.out(2)" },
          "-=0.3",
        )
        .to(arcs[1], { drawSVG: "100%", duration: 0.45 }, "-=0.1") // globe → lanes
        .to(lanes, { scaleX: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.1")
        .to(cache, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "-=0.2")
        .to(cache, { scale: 1.18, duration: 0.22, yoyo: true, repeat: 1, transformOrigin: "center" });
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 400 260"
      className="diagram"
      role="img"
      aria-hidden="true"
    >
      {/* Origin: US prototype */}
      <rect className="dg-origin-icon" x="22" y="100" width="34" height="34" rx="7" />
      <text className="dg-label" x="39" y="152" textAnchor="middle">
        1 site (US)
      </text>

      {/* Connector arcs (origin → globe, globe → lanes) */}
      <path className="dg-arc" d="M58 117 Q 100 110 137 118" fill="none" />
      <path className="dg-arc" d="M253 118 Q 290 112 318 116" fill="none" />

      {/* Globe grid */}
      <circle className="dg-globe" cx={GLOBE.cx} cy={GLOBE.cy} r={GLOBE.r} fill="none" />
      <ellipse className="dg-globe" cx={GLOBE.cx} cy={GLOBE.cy} rx="20" ry={GLOBE.r} fill="none" />
      <ellipse className="dg-globe" cx={GLOBE.cx} cy={GLOBE.cy} rx="40" ry={GLOBE.r} fill="none" />
      <ellipse className="dg-globe" cx={GLOBE.cx} cy={GLOBE.cy} rx={GLOBE.r} ry="22" fill="none" />

      {/* Site pins */}
      {SITES.map((s, i) => (
        <circle key={i} className="dg-site" cx={s.x} cy={s.y} r="5.5" />
      ))}
      <text className="dg-label" x={GLOBE.cx} y="32" textAnchor="middle">
        10+ global sites
      </text>

      {/* Parallel lanes */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect className="dg-bar-track" x="318" y={92 + i * 18} width="62" height="10" rx="5" />
          <rect className="dg-bar-fill" x="318" y={92 + i * 18} width="62" height="10" rx="5" />
        </g>
      ))}

      {/* Cache chip */}
      <rect className="dg-cache" x="328" y="172" width="44" height="20" rx="10" />
      <text className="dg-cache-label" x="350" y="186" textAnchor="middle">
        cache
      </text>
      <text className="dg-label" x="350" y="214" textAnchor="middle">
        parallel + cached
      </text>
    </svg>
  );
}
