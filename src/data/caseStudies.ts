/**
 * Case-study content ("The Invisible Work"). Data is kept separate from
 * presentation so CaseStudyCard stays purely about layout/animation.
 *
 * `diagram` selects which bespoke SVG diagram component renders for the card.
 * `block` selects the pastel section color family.
 */

export type DiagramId = "avantio" | "xperience" | "global" | "serverless";
export type BlockColor = "peach" | "periwinkle" | "butter" | "mint";

export interface StrategyStep {
  heading: string;
  body: string;
}

export interface CaseStudy {
  id: string;
  meta: string;
  title: string;
  challenge: string;
  strategy: StrategyStep[];
  impact: string;
  diagram: DiagramId;
  block: BlockColor;
  /** Concise text alternative describing the (decorative) diagram. */
  diagramAlt: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "avantio",
    meta: "Avantio · Channel Manager SaaS · 2025–Present",
    title: "Turning legacy chaos into scalable growth",
    challenge:
      "I inherited a fragile, non-standard Angular codebase that fought the framework instead of using it. Development had slowed to a crawl and an 'invisible' backlog of untraceable bugs kept growing.",
    strategy: [
      {
        heading: "Refactor-as-you-go",
        body: "A full rewrite wasn't viable for the business, so I stripped anti-patterns incrementally and replaced custom hacks with standard Angular composition.",
      },
      {
        heading: "Safety net",
        body: "I expanded unit-test coverage to act as a health indicator, so new features stopped breaking old ones.",
      },
      {
        heading: "AI-assisted scale",
        body: "I used AI coding tools to automate repetitive refactors while enforcing strict consistency with our new design standards.",
      },
    ],
    impact:
      "User-reported errors dropped 60% and velocity recovered. The cleanup grew into a chapter-wide modernization now spanning Product and Design.",
    diagram: "avantio",
    block: "peach",
    diagramAlt:
      "A tangled architecture diagram transforming into a clean, layered one, with a counter showing a 60% drop in errors.",
  },
  {
    id: "xperience",
    meta: "EPAM · Google Xperience Studio · 2022–2024",
    title: "Engineering high-performance creative experiences",
    challenge:
      "Inside Google's Xperience Studio I built real-time interactive art exhibits — complex physics, 3D environments, and AI pose estimation — that had to stay smooth for many concurrent visitors without lag or crashes.",
    strategy: [
      {
        heading: "Object pooling",
        body: "I recycled particles through a pre-allocated buffer instead of constantly creating and destroying them, keeping the memory footprint flat and eliminating garbage-collection stutters.",
      },
      {
        heading: "Environment tuning",
        body: "I collected real-world data to calibrate TensorFlow.js pose estimation, tracking multiple users in unpredictable lighting.",
      },
      {
        heading: "Data-driven creative",
        body: "I built analytics dashboards so the creative team could decide which exhibit features to expand or cut.",
      },
    ],
    impact:
      "Fluid, high-frame-rate experiences that stayed stable under heavy public use — closing the gap between creative vision and technical performance.",
    diagram: "xperience",
    block: "periwinkle",
    diagramAlt:
      "A particle-recycling loop next to a chart contrasting spiky garbage-collection pauses against a flat, stable memory line.",
  },
  {
    id: "global",
    meta: "Accenture · Oil & Gas · Global Rollout · 2020–2022",
    title: "Architecting a global rollout for industrial scale",
    challenge:
      "A drilling-site materials tracking app built as a single-site US prototype was suddenly tapped for a global rollout across 10+ locations. The 'concept' code wasn't built for the traffic, languages, or concurrency of a global operation.",
    strategy: [
      {
        heading: "Localization",
        body: "I implemented full i18n/L10n with NgRx, supporting five languages seamlessly.",
      },
      {
        heading: "Performance",
        body: "I parallelized bloated backend processes and added a Redis caching layer to absorb peak reporting hours.",
      },
      {
        heading: "Bulk data",
        body: "I replaced slow save-loops with bulk-insert staging tables so the system could accept massive data instantly without crash-inducing spikes.",
      },
    ],
    impact:
      "The prototype became a robust global tool, staying stable and responsive as the user base grew tenfold across time zones and languages.",
    diagram: "global",
    block: "butter",
    diagramAlt:
      "A single US prototype feeding a globe whose 10+ sites light up across regions, then feeding a parallelized, cached backend pipeline.",
  },
  {
    id: "serverless",
    meta: "UPV · MSc Thesis · Open-Source Research",
    title: "Orchestrating the future of serverless workflows",
    challenge:
      "In serverless computing the system 'forgets' everything the moment a task finishes, making complex sequences hard to coordinate. My thesis needed to chain ephemeral tasks — image processing, sentiment analysis — inside the open-source OSCAR/Kubernetes platform.",
    strategy: [
      {
        heading: "Tooling audit",
        body: "After auditing AWS Step Functions and Apache Airflow, I selected Argo Workflows as the superior Kubernetes-native choice.",
      },
      {
        heading: "Integration",
        body: "I engineered a bridge between Argo and OSCAR so stateless functions could communicate and follow a logical path.",
      },
      {
        heading: "Declarative design",
        body: "A container-based, declarative approach kept the workflows modular, scalable, and reproducible by other researchers.",
      },
    ],
    impact:
      "I proved you don't need proprietary tools to run complex distributed systems — delivering an open-source blueprint now used as a guide for vendor-free research orchestration.",
    diagram: "serverless",
    block: "mint",
    diagramAlt:
      "A directed acyclic graph of workflow nodes connecting in sequence, labeled OSCAR and Argo on Kubernetes.",
  },
];
