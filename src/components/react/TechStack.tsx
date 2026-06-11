import SkillExplorer from "./SkillExplorer";

export default function TechStack() {
  return (
    <section id="stack" className="section block-mint tech-stack">
      <div className="container">
        <p className="section-indicator"># The Toolkit</p>
        <h2 className="section-header">What I build with.</h2>
        <p className="tech-stack__lede">
          Tap a skillset to break it into skills — then pick one to see where
          and how deep I've used it.
        </p>

        <SkillExplorer />
      </div>
    </section>
  );
}
