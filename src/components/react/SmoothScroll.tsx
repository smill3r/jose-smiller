import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { setLenis } from "../../lib/lenis";

/**
 * Boots Lenis smooth-scroll once for the whole page and keeps GSAP
 * ScrollTrigger in sync with it. Rendered once in the layout (client:load).
 *
 * When the user prefers reduced motion we skip Lenis entirely and let the
 * browser scroll natively — ScrollTrigger still works off the native scroll.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1, // gentle, weighty feel without lagging behind input
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Drive ScrollTrigger from Lenis' scroll events, and Lenis' rAF from
    // GSAP's ticker so the two share a single animation loop.
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Publish so other islands can scroll through Lenis (see lib/lenis.ts).
    setLenis(lenis);

    return () => {
      setLenis(null);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
