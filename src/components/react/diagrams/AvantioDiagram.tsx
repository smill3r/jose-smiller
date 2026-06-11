import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";

/**
 * Tangled legacy code → clean layered architecture, with a count-up of the
 * 60% drop in user-reported errors. The dotted arrow "draws" across as the
 * clean layers slide in.
 */
export default function AvantioDiagram() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = root.current!;
      const tangle = svg.querySelector(".dg-tangle");
      const arrow = svg.querySelector(".dg-arrow");
      const layers = svg.querySelectorAll(".dg-layer");
      const counter = svg.querySelector(".dg-counter") as SVGTextElement;

      if (prefersReducedMotion) {
        gsap.set(layers, { opacity: 1, x: 0 });
        if (counter) counter.textContent = "−60%";
        return;
      }

      gsap.set([tangle, arrow], { drawSVG: "0%" });
      gsap.set(layers, { opacity: 0, x: 24 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 80%" },
      });

      tl.to(tangle, { drawSVG: "100%", duration: 1, ease: "power1.inOut" })
        .to(arrow, { drawSVG: "100%", duration: 0.6 }, "-=0.2")
        .to(
          layers,
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "back.out(1.6)" },
          "-=0.2",
        )
        .to(
          { v: 0 },
          {
            v: 60,
            duration: 1,
            ease: "power2.out",
            onUpdate() {
              if (counter)
                counter.textContent = "−" + Math.round(this.targets()[0].v) + "%";
            },
          },
          "-=0.3",
        );
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 400 280"
      className="diagram"
      role="img"
      aria-hidden="true"
    >
      {/* Tangled "before" scribble */}
      <path
        className="dg-tangle dg-stroke-error"
        d="M40 70 C 80 40, 60 110, 100 90 S 70 140, 110 150 S 50 180, 95 200 S 130 160, 90 130 S 140 100, 100 60"
        fill="none"
      />
      <text className="dg-label" x="70" y="235" textAnchor="middle">
        legacy
      </text>

      {/* Dotted arrow */}
      <path
        className="dg-arrow dg-stroke-accent"
        d="M150 135 L250 135"
        fill="none"
        strokeDasharray="2 8"
        markerEnd="url(#dg-arrowhead)"
      />
      <defs>
        <marker
          id="dg-arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 L6 3 L0 6 Z" className="dg-fill-accent" />
        </marker>
      </defs>

      {/* Clean "after" layers */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          className="dg-layer dg-panel"
          x="280"
          y={70 + i * 34}
          width="90"
          height="24"
          rx="6"
        />
      ))}
      <text className="dg-label" x="325" y="235" textAnchor="middle">
        layered
      </text>

      {/* Counter */}
      <text className="dg-counter" x="200" y="40" textAnchor="middle">
        −60%
      </text>
      <text className="dg-sublabel" x="200" y="58" textAnchor="middle">
        reported errors
      </text>
    </svg>
  );
}
