import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";

/**
 * Argo-style DAG: ephemeral tasks chained into a reproducible workflow on
 * Kubernetes/OSCAR. Edges draw in sequence, filled nodes pop in behind them.
 * Each node carries a step number inside and its label as a caption below, so
 * text never overflows the circle regardless of word length.
 */
const NODES = [
  { x: 55, y: 115, label: "trigger" },
  { x: 160, y: 60, label: "image" },
  { x: 160, y: 175, label: "sentiment" },
  { x: 270, y: 115, label: "merge" },
  { x: 365, y: 115, label: "store" },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
];

export default function ServerlessDiagram() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = root.current!;
      const edges = svg.querySelectorAll(".dg-edge");
      const nodes = svg.querySelectorAll(".dg-dag-node");

      if (prefersReducedMotion) {
        gsap.set(edges, { drawSVG: "100%" });
        gsap.set(nodes, { opacity: 1, scale: 1 });
        return;
      }

      gsap.set(edges, { drawSVG: "0%" });
      gsap.set(nodes, { opacity: 0, scale: 0.4, transformOrigin: "center" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 80%" },
      });

      // Pop the first node, then draw each edge followed by its target node.
      tl.to(nodes[0], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" });
      EDGES.forEach(([, to], i) => {
        tl.to(edges[i], { drawSVG: "100%", duration: 0.45 }, "-=0.1").to(
          nodes[to],
          { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
          "-=0.15",
        );
      });
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
      {EDGES.map(([from, to], i) => (
        <line
          key={`e${i}`}
          className="dg-edge dg-stroke-accent"
          x1={NODES[from].x}
          y1={NODES[from].y}
          x2={NODES[to].x}
          y2={NODES[to].y}
        />
      ))}

      {NODES.map((n, i) => (
        <g key={`n${i}`} className="dg-dag-node">
          <circle className="dg-dag-fill" cx={n.x} cy={n.y} r="22" />
          <text className="dg-node-index" x={n.x} y={n.y + 5} textAnchor="middle">
            {i + 1}
          </text>
          <text
            className="dg-node-caption"
            x={n.x}
            y={n.y + 42}
            textAnchor="middle"
          >
            {n.label}
          </text>
        </g>
      ))}

      <text className="dg-label" x="200" y="245" textAnchor="middle">
        Argo · OSCAR · Kubernetes
      </text>
    </svg>
  );
}
