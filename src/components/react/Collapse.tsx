import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";

interface Props {
  open: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Animated height+opacity collapse. Measures the natural height so it can
 * tween to/from a real pixel value, then releases to `height:auto` so the
 * content stays responsive. Reusable (case studies now, mobile menu later).
 */
export default function Collapse({ open, id, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // First render: apply the resting state without animating.
      if (first.current) {
        first.current = false;
        gsap.set(el, {
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
        });
        return;
      }

      if (prefersReducedMotion) {
        gsap.set(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0 });
        return;
      }

      if (open) {
        // Measure target height at auto, then animate up from 0.
        gsap.set(el, { height: "auto" });
        const h = el.offsetHeight;
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          {
            height: h,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            overflow: "hidden",
            onComplete: () => gsap.set(el, { height: "auto" }),
          },
        );
      } else {
        const h = el.offsetHeight;
        gsap.fromTo(
          el,
          { height: h, opacity: 1 },
          { height: 0, opacity: 0, duration: 0.4, ease: "power3.inOut", overflow: "hidden" },
        );
      }
    },
    { dependencies: [open], scope: ref },
  );

  return (
    <div ref={ref} id={id} className={className} aria-hidden={!open} inert={!open ? true : undefined}>
      {children}
    </div>
  );
}
