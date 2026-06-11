import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  prefersReducedMotion,
} from "../../../lib/gsap";

/**
 * Object pooling: a pool of particles drifts freely inside the loop (left),
 * keeping memory flat (accent line) versus the spiky garbage-collection pauses
 * it replaced (right). Particles float with small random offsets — bounded so
 * they never leave the panel — and pause when the figure scrolls out of view.
 */
export default function XperienceDiagram() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = root.current!;
      const loop = svg.querySelector(".dg-loop");
      const particles = gsap.utils.toArray<SVGCircleElement>(".dg-particle");
      const spiky = svg.querySelector(".dg-spiky");
      const flat = svg.querySelector(".dg-flat");

      if (prefersReducedMotion) {
        gsap.set([loop, spiky, flat], { drawSVG: "100%" });
        gsap.set(particles, { opacity: 1 });
        return;
      }

      gsap.set([loop, spiky, flat], { drawSVG: "0%" });
      gsap.set(particles, { opacity: 0 });

      // Entrance: draw the loop, fade particles in, then draw the two chart lines.
      gsap
        .timeline({ scrollTrigger: { trigger: svg, start: "top 80%" } })
        .to(loop, { drawSVG: "100%", duration: 0.9, ease: "power1.inOut" })
        .to(particles, { opacity: 1, duration: 0.3, stagger: 0.1 }, "-=0.4")
        .to(spiky, { drawSVG: "100%", duration: 0.9 }, "-=0.2")
        .to(flat, { drawSVG: "100%", duration: 0.9 }, "-=0.5");

      // Free random drift, bounded to ±16px so particles stay inside the loop.
      const floats = particles.map((p) =>
        gsap.to(p, {
          x: () => gsap.utils.random(-16, 16),
          y: () => gsap.utils.random(-16, 16),
          duration: () => gsap.utils.random(2, 4),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true, // new random target each cycle
          delay: () => gsap.utils.random(0, 1),
          paused: true,
        }),
      );

      // Only drift while the diagram is on screen.
      ScrollTrigger.create({
        trigger: svg,
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) =>
          floats.forEach((t) => (self.isActive ? t.play() : t.pause())),
      });
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
      {/* Recycle loop */}
      <circle
        className="dg-loop dg-stroke-accent"
        cx="90"
        cy="130"
        r="48"
        fill="none"
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        // Round so server and client render identical strings (avoids a
        // floating-point hydration mismatch).
        const cx = Math.round((90 + Math.cos(a) * 30) * 100) / 100;
        const cy = Math.round((130 + Math.sin(a) * 30) * 100) / 100;
        return (
          <circle
            key={i}
            className="dg-particle dg-fill-accent"
            cx={cx}
            cy={cy}
            r="6"
          />
        );
      })}
      <text className="dg-label" x="90" y="205" textAnchor="middle">
        pooled particles
      </text>

      {/* Mini chart */}
      <line className="dg-axis" x1="200" y1="180" x2="370" y2="180" />
      <line className="dg-axis" x1="200" y1="80" x2="200" y2="180" />
      {/* GC pauses — spiky */}
      <path
        className="dg-spiky dg-stroke-error"
        d="M205 170 L225 110 L240 170 L260 100 L278 170 L298 120 L316 170 L336 105 L355 170"
        fill="none"
      />
      {/* Flat, stable memory */}
      <path
        className="dg-flat dg-stroke-accent"
        d="M205 150 L355 148"
        fill="none"
      />
      <text className="dg-label" x="285" y="205" textAnchor="middle">
        flat memory
      </text>
    </svg>
  );
}
