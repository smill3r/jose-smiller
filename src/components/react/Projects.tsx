import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { projects } from "../../data/projects";
import ProjectSpread from "./ProjectSpread";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const panels = Array.from(track.children) as HTMLElement[];
      if (panels.length < 2) return;

      const totalScroll = (panels.length - 1) * window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className="projects"
    >
      <h2 id="projects-heading" className="sr-only">
        Projects
      </h2>

      <div ref={trackRef} className="projects__track">
        {projects.map((project, i) => (
          <ProjectSpread
            key={project.id}
            project={project}
            index={i}
            isFirst={i === 0}
          />
        ))}
      </div>

      {/* Horizontal progress bar — mirrors the nav progress bar pattern */}
      <div className="projects__progress" aria-hidden="true">
        <div ref={progressRef} className="projects__progress-bar" />
      </div>
    </section>
  );
}
