import { CATEGORY_FAMILY, CATEGORY_ORDER } from "../../data/skills";
import SkillExplorer from "./SkillExplorer";

export default function TechStack() {
  return (
    <section id="stack" className="section block-mint tech-stack">
      <div className="container tech-stack__layout">
        <div className="tech-stack__intro">
          <p className="section-indicator"># The Toolkit</p>
          <h2 className="section-header">What I build with.</h2>
          <p className="tech-stack__lede">
            Tap a skillset to reveal its skills, pick one to see where and how
            I've used it.
          </p>

          <ul className="tech-stack__legend" aria-label="Skill categories">
            {CATEGORY_ORDER.map((cat) => (
              <li key={cat} className="tech-stack__legend-item">
                <span
                  className="tech-stack__legend-dot"
                  style={{
                    background: `var(--${CATEGORY_FAMILY[cat]}-accent)`,
                  }}
                  aria-hidden="true"
                />
                {cat}
              </li>
            ))}
          </ul>
        </div>

        <SkillExplorer />
      </div>
    </section>
  );
}
