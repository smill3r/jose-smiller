import type Lenis from "lenis";

/**
 * Shared accessor for the single Lenis instance created in SmoothScroll, so
 * other islands (e.g. TopNav) can drive programmatic scroll *through* Lenis.
 * Scrolling via the browser's native scrollIntoView while Lenis owns the
 * scroll position is unreliable (it gets swallowed) — route through Lenis.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

/** Smooth-scroll to an element by id, clearing the fixed 64px top nav. */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -84, duration: 1.1 });
  } else {
    // Reduced-motion / no-Lenis fallback.
    el.scrollIntoView({ behavior: "smooth" });
  }
};
