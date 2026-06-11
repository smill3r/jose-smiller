import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { scrollToId } from "../../lib/lenis";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { id: "profile", label: "Profile" },
  { id: "timeline", label: "Journey" },
  { id: "case-studies", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export default function TopNav() {
  const barRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // Suppress the hide-on-scroll bar while a click-initiated jump is animating,
  // so the bar doesn't disappear mid-scroll and make the click feel ignored.
  const jumpingRef = useRef(false);
  const [active, setActive] = useState<string>("profile");
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    // Top scroll-progress bar.
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });

    // Hide the bar when scrolling down, reveal when scrolling up.
    ScrollTrigger.create({
      start: "top -80",
      end: "max",
      onUpdate: (self) => {
        if (!barRef.current || jumpingRef.current) return;
        const goingDown = self.direction === 1;
        gsap.to(barRef.current, {
          y: goingDown ? "-100%" : "0%",
          duration: 0.35,
          ease: "power2.out",
        });
      },
    });

    // Active-link highlighting: one trigger per section.
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(id),
      });
    });
  });

  const handleNav = (id: string) => {
    setMenuOpen(false);
    // Keep the bar visible during the jump, then release the guard.
    jumpingRef.current = true;
    gsap.to(barRef.current, { y: "0%", duration: 0.2 });
    scrollToId(id);
    window.setTimeout(() => {
      jumpingRef.current = false;
    }, 1200);
  };

  return (
    <header ref={barRef} className="topnav">
      <div ref={progressRef} className="topnav__progress" aria-hidden="true" />
      <div className="topnav__inner container">
        <a
          href="#profile"
          className="topnav__logo"
          onClick={(e) => {
            e.preventDefault();
            handleNav("profile");
          }}
        >
          JS<span className="topnav__logo-dot">.</span>
        </a>

        <nav
          id="primary-menu"
          className={`topnav__nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Primary"
        >
          <ul>
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={active === id ? "is-active" : ""}
                  aria-current={active === id ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(id);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="topnav__actions">
          <ThemeToggle />
          <button
            type="button"
            className="topnav__burger"
            aria-expanded={menuOpen}
            aria-controls="primary-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
