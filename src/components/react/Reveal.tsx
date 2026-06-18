import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";

type Variant = "up" | "fade" | "block";

interface RevealProps {
  children: ReactNode;
  /** Element to render as (default div). Lets sections stay semantic. */
  as?: ElementType;
  variant?: Variant;
  /** Stagger direct children instead of revealing the wrapper as one unit. */
  stagger?: boolean;
  delay?: number;
  className?: string;
  id?: string;
}

/**
 * Reusable scroll-in reveal. Centralizes the ScrollTrigger setup so individual
 * sections never re-implement it. Honors prefers-reduced-motion by rendering
 * the final state immediately (no animation, content always visible).
 *
 * CSS classes (reveal--up, reveal--fade, reveal--block) set the initial hidden
 * state in the SSR HTML so the element is never visible before GSAP runs.
 * The animation uses gsap.to() (not from()) so GSAP reads the CSS "from" state
 * and animates to the final state — eliminating the visible → invisible flash.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  stagger = false,
  delay = 0,
  className,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion || !ref.current) return;

      const targets = stagger
        ? (gsap.utils.toArray(ref.current.children) as Element[])
        : [ref.current];

      const from: gsap.TweenVars = { opacity: 0 };
      if (variant === "up") from.y = 40;
      if (variant === "block") from.clipPath = "inset(0 100% 0 0)";

      const to: gsap.TweenVars = { opacity: 1 };
      if (variant === "up") to.y = 0;
      if (variant === "block") to.clipPath = "inset(0 0% 0 0)";

      gsap.fromTo(targets, from, {
        ...to,
        duration: 0.9,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  const classes = [
    "reveal",
    `reveal--${variant}`,
    stagger ? "reveal--stagger" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes} id={id}>
      {children}
    </Tag>
  );
}
