/**
 * Single place to register GSAP + plugins so every island shares one
 * configured instance. DrawSVGPlugin and SplitText are free as of GSAP 3.13.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

/** True when the user asked the OS to minimize motion. Animations fall back to
 *  instant/final states so the content (and the story) is never gated on motion. */
export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, useGSAP };
