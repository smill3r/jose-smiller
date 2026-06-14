import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";

const HEADLINE = ["Engineering", "refined", "experiences", "from", "raw", "complexity."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion || !root.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero__word", {
        yPercent: 120,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
      })
        .from(
          ".hero__intro > *",
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 },
          "-=0.3",
        )
        .from(
          ".hero__portrait",
          { y: 32, opacity: 0, duration: 0.9 },
          "-=0.9",
        )
        // Gentle, endless float on the decorative shapes.
        .add(() => {
          gsap.to(".hero__shape", {
            y: "+=18",
            rotation: "+=8",
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.6, from: "random" },
          });
        });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="profile" className="section hero">
      {/* Decorative quirky shapes — purely visual, hidden from assistive tech. */}
      <div className="hero__shapes" aria-hidden="true">
        <span className="hero__shape hero__shape--blob" />
        <span className="hero__shape hero__shape--ring" />
        <span className="hero__shape hero__shape--squiggle" />
        <span className="hero__shape hero__shape--pill" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="section-indicator"># Profile</p>

          <h1 className="hero__headline">
            {HEADLINE.map((word, i) => (
              <span className="hero__word-wrap" key={i}>
                <span className={`hero__word${word === "refined" ? " hero__word--accent" : ""}`}>
                  {word}
                </span>{" "}
              </span>
            ))}
          </h1>

          <div className="hero__intro">
            <p className="hero__lead">
              Hi, I'm <strong>Jose Smiller</strong>, a Senior Software Engineer with{" "}
              <strong>7+ years</strong> experience building scalable web &amp; mobile apps across
              fintech, oil &amp; gas, SaaS, and interactive media. I rescue legacy
              codebases, architect global rollouts, and turn messy requirements into
              resilient systems.
            </p>

            <ul className="focus-box">
              <li>
                <span className="focus-box__label">&gt; The spread</span>
                Angular, React, TypeScript, Node.js, .NET, and Cloud (AWS).
              </li>
              <li>
                <span className="focus-box__label">&gt; The meat</span>
                Eager communicator, avid learner, and mentor.
              </li>
              <li>
                <span className="focus-box__label">&gt; Status</span>
                Open to senior / staff full-stack &amp; frontend roles.
              </li>
            </ul>
          </div>
        </div>

        <div className="hero__portrait">
          <img
            src="/avatar.png"
            width={520}
            height={520}
            alt="Portrait of Jose Smiller"
          />
        </div>
      </div>
    </section>
  );
}
