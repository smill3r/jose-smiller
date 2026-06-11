import { caseStudies } from "../../data/caseStudies";
import CaseStudyCard from "./CaseStudyCard";

export default function CaseStudies() {
  return (
    <section id="case-studies" aria-labelledby="case-studies-heading">
      <div className="container case-studies__intro section">
        <p className="section-indicator"># Case Studies</p>
        <h2 id="case-studies-heading" className="section-header">
          The invisible work.
        </h2>
        <p className="case-studies__lede">
          No flashy public apps yet — the real value lived inside the codebases.
          Here's the engineering that doesn't show up in a screenshot.
        </p>
      </div>

      {caseStudies.map((study, i) => (
        <CaseStudyCard key={study.id} study={study} index={i} />
      ))}
    </section>
  );
}
