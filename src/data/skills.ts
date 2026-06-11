/**
 * Flat skill list powering the SkillExplorer: a clickable chip cloud feeding a
 * single detail panel. Grouped by category (chips inherit the category's color
 * family). Content is grounded in resume.txt; `level` is a 0–100 self-rating.
 */

export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Cloud & DevOps"
  | "Testing & QA"
  | "Practices";

export interface Skill {
  id: string;
  label: string;
  category: SkillCategory;
  level: number;
  years?: number;
  summary: string;
  highlights?: string[];
}

/** Each category maps to a pastel block family for chip coloring. */
export const CATEGORY_BLOCK: Record<SkillCategory, string> = {
  Languages: "block-periwinkle",
  Frontend: "block-peach",
  Backend: "block-mint",
  "Cloud & DevOps": "block-lavender",
  "Testing & QA": "block-butter",
  Practices: "block-periwinkle",
};

export const CATEGORY_ORDER: SkillCategory[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Cloud & DevOps",
  "Testing & QA",
  "Practices",
];

/** Pastel family name (drives the CSS color vars `--<family>` / `--<family>-accent`). */
export const CATEGORY_FAMILY: Record<SkillCategory, string> = Object.fromEntries(
  CATEGORY_ORDER.map((c) => [c, CATEGORY_BLOCK[c].replace("block-", "")]),
) as Record<SkillCategory, string>;

/** Compact label that fits inside a donut arc segment. */
export const CATEGORY_SHORT: Record<SkillCategory, string> = {
  Languages: "Lang",
  Frontend: "Front",
  Backend: "Back",
  "Cloud & DevOps": "Cloud",
  "Testing & QA": "Test",
  Practices: "Craft",
};

/**
 * Concise name that fits as curved text along a skill's arc sub-segment.
 * Overrides only where the full `label` is too long to read on the ring.
 */
const SKILL_DISPLAY: Record<string, string> = {
  javascript: "JavaScript",
  csharp: "C#",
  apis: "APIs",
  databases: "Databases",
  dotnet: ".NET",
  ngrx: "NgRx",
  accessibility: "A11y",
  cicd: "CI/CD",
  e2e: "Testing",
  architecture: "Architecture",
  agile: "Agile",
  performance: "Performance",
  "ai-dev": "AI Dev",
};

/** Short on-ring name for a skill, falling back to its full label. */
export const skillName = (s: Skill): string => SKILL_DISPLAY[s.id] ?? s.label;

export const skills: Skill[] = [
  // Languages
  {
    id: "typescript",
    label: "TypeScript",
    category: "Languages",
    level: 95,
    years: 6,
    summary:
      "My default language for app and Node code — strict typing, generics, and refactoring legacy JS to TS at scale.",
    highlights: [
      "Migrated a large legacy Angular codebase to TypeScript at Avantio",
      "Type-safe REST/GraphQL clients and Node services",
    ],
  },
  {
    id: "javascript",
    label: "JavaScript (ES6+)",
    category: "Languages",
    level: 95,
    years: 7,
    summary:
      "Seven years across the stack — async, the event loop, and performance profiling in both browser and Node.",
    highlights: [
      "Object-pooling particle systems for real-time exhibits at EPAM",
    ],
  },
  {
    id: "csharp",
    label: "C#",
    category: "Languages",
    level: 80,
    years: 4,
    summary:
      "Backend services and APIs with .NET across Accenture's industrial apps.",
    highlights: [".NET APIs feeding Angular front ends on Azure"],
  },
  {
    id: "html5",
    label: "HTML5",
    category: "Languages",
    level: 92,
    summary:
      "Semantic, accessible markup as the foundation of every UI I ship.",
  },
  {
    id: "css3",
    label: "CSS3",
    category: "Languages",
    level: 90,
    summary:
      "Modern layout (grid/flex), custom properties, and motion — including this site's token-driven design system.",
  },

  // Frontend
  {
    id: "angular",
    label: "Angular",
    category: "Frontend",
    level: 95,
    years: 7,
    summary:
      "My deepest framework — composition patterns, RxJS, and rescuing non-standard legacy architectures.",
    highlights: [
      "Refactor-as-you-go modernization cutting errors 60% at Avantio",
      "i18n for 5 languages with NgRx at Accenture",
    ],
  },
  {
    id: "react",
    label: "React.js",
    category: "Frontend",
    level: 90,
    years: 5,
    summary:
      "Hooks, component architecture, and islands — including this portfolio.",
    highlights: ["Enterprise React applications at EPAM"],
  },
  {
    id: "ionic",
    label: "Ionic",
    category: "Frontend",
    level: 85,
    years: 5,
    summary:
      "Cross-platform mobile apps shipped to the App Store and Google Play.",
    highlights: ["Production mobile apps at Axented and Accenture"],
  },
  {
    id: "ngrx",
    label: "NgRx",
    category: "Frontend",
    level: 85,
    summary:
      "Predictable state and side-effect management for complex Angular apps.",
    highlights: ["Instant translation/localization system at Accenture"],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    category: "Frontend",
    level: 88,
    summary:
      "First-class concern — keyboard operability, ARIA, contrast, and reduced-motion. I mentor teams on it.",
    highlights: ["Ran accessibility training sessions at Accenture"],
  },

  // Backend
  {
    id: "nodejs",
    label: "Node.js",
    category: "Backend",
    level: 88,
    years: 6,
    summary: "Express microservices and REST APIs across distributed systems.",
    highlights: ["New and refactored endpoints across Avantio's microservices"],
  },
  {
    id: "express",
    label: "Express",
    category: "Backend",
    level: 86,
    summary: "Lightweight REST services and API layers.",
  },
  {
    id: "dotnet",
    label: ".NET (C#)",
    category: "Backend",
    level: 80,
    summary: "API and data-model work for enterprise Angular apps.",
    highlights: ["Azure-hosted APIs at Accenture"],
  },
  {
    id: "apis",
    label: "REST & GraphQL",
    category: "Backend",
    level: 88,
    summary: "Designing performant, reliable API contracts.",
  },
  {
    id: "databases",
    label: "MongoDB · SQL · Redis",
    category: "Backend",
    level: 82,
    summary:
      "Relational and document stores, plus Redis caching for peak loads.",
    highlights: [
      "Redis caching + bulk-insert staging tables to prevent crash spikes at Accenture",
    ],
  },

  // Cloud & DevOps
  {
    id: "aws",
    label: "AWS",
    category: "Cloud & DevOps",
    level: 82,
    summary: "Deploying and operating apps; serverless research on Kubernetes.",
  },
  {
    id: "docker",
    label: "Docker",
    category: "Cloud & DevOps",
    level: 82,
    summary: "Containerized services and reproducible environments.",
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    category: "Cloud & DevOps",
    level: 80,
    summary:
      "Kubernetes-native workflows — the platform for my MSc serverless research.",
    highlights: ["OSCAR + Argo orchestration in my thesis"],
  },
  {
    id: "argo",
    label: "Argo Workflows",
    category: "Cloud & DevOps",
    level: 78,
    summary: "DAG-based orchestration of ephemeral serverless tasks.",
    highlights: ["Bridged Argo with OSCAR for reproducible pipelines"],
  },
  {
    id: "cicd",
    label: "CI/CD",
    category: "Cloud & DevOps",
    level: 84,
    summary: "Pipelines that cut release time and stabilize rollouts.",
    highlights: ["30% faster releases on GCP at EPAM"],
  },

  // Testing & QA
  {
    id: "jest",
    label: "Jest",
    category: "Testing & QA",
    level: 85,
    summary:
      "Unit and integration coverage as a health indicator for refactors.",
    highlights: ["Added a test safety net during Avantio's modernization"],
  },
  {
    id: "playwright",
    label: "Playwright",
    category: "Testing & QA",
    level: 80,
    summary: "End-to-end browser testing of critical flows.",
  },
  {
    id: "e2e",
    label: "Unit / integration / e2e",
    category: "Testing & QA",
    level: 82,
    summary: "A pragmatic strategy across the whole testing pyramid.",
  },

  // Practices
  {
    id: "architecture",
    label: "System architecture",
    category: "Practices",
    level: 88,
    summary: "Designing for scale, concurrency, and global rollouts.",
    highlights: ["Scaled a single-site prototype to 10+ global locations"],
  },
  {
    id: "agile",
    label: "Agile / Scrum",
    category: "Practices",
    level: 88,
    summary: "Iterative delivery and cross-functional collaboration.",
  },
  {
    id: "performance",
    label: "Performance optimization",
    category: "Practices",
    level: 90,
    summary: "Memory, rendering, and backend throughput tuning.",
    highlights: [
      "Object pooling to kill GC stutter; parallelized backend processes",
    ],
  },
  {
    id: "ai-dev",
    label: "AI-assisted development",
    category: "Practices",
    level: 85,
    summary:
      "Using AI coding agents for large-scale, standard-consistent refactors.",
    highlights: ["Automated repetitive refactors at Avantio"],
  },
];
