import { useRef, useState } from "react";
import { projects } from "../../data/projects";
import ProjectSpread from "./ProjectSpread";

export default function Projects() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = projects.length;

  const goTo = (n: number) => setIndex(Math.max(0, Math.min(total - 1, n)));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goTo(delta > 0 ? index + 1 : index - 1);
    touchStartX.current = null;
  };

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <div className="container projects__intro">
        <p className="section-indicator"># Projects</p>
        <h2 id="projects-heading" className="section-header">
          Things I've built.
        </h2>
        <p className="projects__lede">
          A selection of projects to showcase my work, they demonstrate work
          I've done in the past, my architectural decisions, and the
          technologies I've used. I built them using AI to demostrate my ability
          to orchestrate and manage AI tools to help me build and deliver
          software faster.
        </p>
      </div>

      <div
        className="projects__carousel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="projects__track"
          style={{ transform: `translateX(calc(${-index} * 100vw))` }}
        >
          {projects.map((project, i) => (
            <ProjectSpread
              key={project.id}
              project={project}
              index={i}
              isActive={i === index}
            />
          ))}
        </div>

        <nav className="projects__nav" aria-label="Project navigation">
          <button
            className="projects__arrow"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous project"
          >
            ←
          </button>

          <div className="projects__dots" role="tablist">
            {projects.map((p, i) => (
              <button
                key={p.id}
                className={`projects__dot${i === index ? " projects__dot--active" : ""}`}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={i === index}
                aria-label={p.title}
              />
            ))}
          </div>

          <button
            className="projects__arrow"
            onClick={() => goTo(index + 1)}
            disabled={index === total - 1}
            aria-label="Next project"
          >
            →
          </button>
        </nav>
      </div>
    </section>
  );
}
