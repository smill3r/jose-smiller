# Jose Smiller — Portfolio

A vertical, scroll-driven portfolio that tells the story of my engineering work
through animated case studies. Built as a statically-hosted **Astro** shell whose
every section is a hydrated **React** island, with **GSAP** + **Lenis** powering
the scroll animations and a pastel color-blocking theme.

## Stack

- **Astro** — static site shell, routing, build (`output: static`).
- **React islands** — each section is a `.tsx` component hydrated with
  `client:load` / `client:visible`.
- **GSAP** (ScrollTrigger, DrawSVG) — scroll reveals and the bespoke SVG case-study
  diagrams. Registered once in `src/lib/gsap.ts`.
- **Lenis** — smooth scroll, synced to ScrollTrigger in `SmoothScroll.tsx`.
- **Plain CSS** with custom-property design tokens — `src/styles/`.

## Project structure

```text
src/
├── lib/gsap.ts              # GSAP + plugin registration, reduced-motion flag
├── layouts/Main.astro       # <head>, theme-init script, mounts SmoothScroll + TopNav
├── pages/index.astro        # Composes the section islands
├── data/caseStudies.ts      # Case-study content (separated from presentation)
├── components/react/
│   ├── SmoothScroll.tsx     # Lenis ⇄ ScrollTrigger bridge
│   ├── Reveal.tsx           # Reusable scroll-in reveal wrapper
│   ├── TopNav.tsx           # Sticky nav, scroll progress, active link, mobile menu
│   ├── Hero / Timeline / CaseStudies / CaseStudyCard / TechStack / StackCard / Footer
│   └── diagrams/            # 4 animated SVG case-study diagrams
└── styles/                  # design-system (tokens) + per-section CSS
```

## Accessibility

Built in, not bolted on: semantic landmarks, keyboard-operable controls with
`aria-expanded`/`aria-controls`, visible focus, `aria-hidden` decorative diagrams
with `sr-only` text alternatives, WCAG-AA contrast on every pastel block, and a
full `prefers-reduced-motion` path (Lenis off, reveals/diagrams render final state).

## Requirements

> **Node ≥ 22.12** is required by Astro 6. If you use nvm: `nvm use 22`.

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Dev server at `localhost:4321`              |
| `npm run build`   | Build the static site to `./dist/`          |
| `npm run preview` | Preview the production build locally        |
