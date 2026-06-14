export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  block: "lavender" | "rose" | "peach" | "periwinkle" | "butter" | "mint";
  /** Path to a screenshot shown at the top of the card (e.g. "/screenshots/atlas.png"). */
  screenshot?: string;
  live?: string;
  repo?: string;
}

export const projects: Project[] = [
  {
    id: "atlas",
    title: "State of the World",
    description:
      "An interactive world map visualising four World Bank development indicators; electricity access, greenhouse gas emissions, internet usage, and female school completion, across six decades of data.",
    tags: ["Angular 22", "Signals", "D3-geo", "TypeScript", "SCSS"],
    block: "lavender",
    live: "https://state-of-world.netlify.app",
    repo: "https://github.com/smill3r/atlas",
    screenshot: "/screenshots/atlas.png",
  },
  {
    id: "motion",
    title: "Motion",
    description:
      "A recreated interactive pose-tracking and particle experience, inspired by the real-time art exhibits I built inside Google's Xperience Studio. TensorFlow.js drives the body segmentation; particles orbit and react to your silhouette in real time.",
    tags: ["TensorFlow.js", "Canvas API", "JavaScript", "WebGL"],
    block: "rose",
    live: "https://smill3r.github.io/motion/",
    repo: "https://github.com/smill3r/motion",
    screenshot: "/screenshots/motion.png",
  },
];
