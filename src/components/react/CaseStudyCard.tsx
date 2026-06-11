import { useId, useState } from "react";
import type { CaseStudy } from "../../data/caseStudies";
import Collapse from "./Collapse";
import AvantioDiagram from "./diagrams/AvantioDiagram";
import GlobalRolloutDiagram from "./diagrams/GlobalRolloutDiagram";
import ServerlessDiagram from "./diagrams/ServerlessDiagram";
import XperienceDiagram from "./diagrams/XperienceDiagram";
import Reveal from "./Reveal";

const DIAGRAMS = {
  avantio: AvantioDiagram,
  xperience: XperienceDiagram,
  global: GlobalRolloutDiagram,
  serverless: ServerlessDiagram,
};

interface Props {
  study: CaseStudy;
  index: number;
}

export default function CaseStudyCard({ study, index }: Props) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const Diagram = DIAGRAMS[study.diagram];
  // Alternate which side the diagram sits on for visual rhythm.
  const flipped = index % 2 === 1;

  return (
    <article
      id={study.id}
      className={`case-study block-${study.block} ${flipped ? "case-study--flip" : ""}`}
    >
      <div className="container case-study__grid">
        <Reveal className="case-study__text" variant="up">
          <p className="case-study__meta">{study.meta}</p>
          <h3 className="case-study__title">{study.title}</h3>

          <p className="case-study__label">Challenge</p>
          <p className="case-study__body">{study.challenge}</p>

          <button
            type="button"
            className="case-study__toggle"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide the full story" : "Read the full story"}
            <span aria-hidden="true">{open ? " ↑" : " ↓"}</span>
          </button>

          <Collapse open={open} id={detailsId} className="case-study__details">
            <p className="case-study__label">Strategy</p>
            <ul className="case-study__steps">
              {study.strategy.map((step, i) => (
                <li key={i}>
                  <strong>{step.heading}.</strong> {step.body}
                </li>
              ))}
            </ul>

            <p className="case-study__label">Impact</p>
            <p className="case-study__body">{study.impact}</p>
          </Collapse>
        </Reveal>

        <figure className="case-study__figure">
          {study.links?.[0] ? (
            <a
              href={study.links[0].href}
              className="case-study__figure-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open the recreated experience: ${study.links[0].label}`}
            >
              <span className="case-study__figure-link-label">
                Open the recreated experience
              </span>
              <span className="material-symbols-rounded" aria-hidden="true">
                open_in_new
              </span>
            </a>
          ) : null}
          <Diagram />
          {/* Text alternative so the story survives without the animation. */}
          <figcaption className="sr-only">{study.diagramAlt}</figcaption>
        </figure>
      </div>
    </article>
  );
}
