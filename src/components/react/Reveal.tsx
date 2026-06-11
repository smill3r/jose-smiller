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

      gsap.from(targets, {
        ...from,
        duration: 0.9,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          // Play once on enter; reset when scrolled fully back above so it
          // replays on the way down again (matches the storytelling intent).
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
