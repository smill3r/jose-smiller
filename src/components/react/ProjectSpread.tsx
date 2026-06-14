import type { Project } from "../../data/projects";

interface Props {
  project: Project;
  index: number;
  isActive?: boolean;
}

export default function ProjectSpread({
  project,
  index,
  isActive = true,
}: Props) {
  const flipped = index % 2 === 1;
  const displayUrl = project.live?.replace(/^https?:\/\//, "");

  return (
    <article
      className={`projects__panel block-${project.block}${flipped ? " projects__panel--flip" : ""}`}
      aria-hidden={!isActive || undefined}
    >
      <div className="container projects__panel-grid">
        <div className="project-spread__text">
          <p className="project-spread__index" aria-hidden="true">
            0{index + 1}
          </p>
          <h3 className="project-spread__title">{project.title}</h3>
          <p className="project-spread__desc">{project.description}</p>

          <ul className="project-spread__tags" aria-label="Technologies used">
            {project.tags.map((tag) => (
              <li key={tag} className="project-spread__tag">
                {tag}
              </li>
            ))}
          </ul>

          <div className="project-spread__links">
            {project.live && (
              <a
                href={project.live}
                className="project-spread__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live site`}
              >
                Live site ↗
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                className="project-spread__link project-spread__link--muted"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} GitHub repository`}
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>

        <div className="project-spread__visual">
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} live site`}
          >
            <figure
              className="browser-window"
              aria-label={`${project.title} app preview`}
            >
              <div className="browser-window__bar" aria-hidden="true">
                <span className="browser-window__dot" />
                <span className="browser-window__dot" />
                <span className="browser-window__dot" />
                {displayUrl && (
                  <span className="browser-window__url">{displayUrl}</span>
                )}
              </div>
              <div className="browser-window__screen">
                {project.screenshot ? (
                  <img
                    src={project.screenshot}
                    alt={`${project.title} screenshot`}
                    className="browser-window__img"
                    loading="lazy"
                  />
                ) : (
                  <div className="browser-window__placeholder" />
                )}
              </div>
            </figure>
          </a>
        </div>
      </div>
    </article>
  );
}
