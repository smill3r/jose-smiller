import Reveal from "./Reveal";

interface Entry {
  period: string;
  role: string;
  org: string;
  note?: string;
  type: "work" | "study";
}

// Chronological (most recent first), interleaving roles and education.
const ENTRIES: Entry[] = [
  {
    period: "2025 — Present",
    role: "Senior Software Engineer",
    org: "Avantio",
    note: "Channel Manager SaaS · Valencia, Spain",
    type: "work",
  },
  {
    period: "2024 — 2025",
    role: "MSc, Cloud & High-Performance Computing",
    org: "Universidad Politécnica de Valencia",
    note: "Thesis: serverless workflow orchestration",
    type: "study",
  },
  {
    period: "2022 — 2024",
    role: "Senior Software Engineer",
    org: "EPAM Systems",
    note: "Google Xperience Studio · interactive exhibits",
    type: "work",
  },
  {
    period: "2020 — 2022",
    role: "Senior Software Engineer",
    org: "Accenture",
    note: "Oil & Gas · global rollout",
    type: "work",
  },
  {
    period: "2019 — 2020",
    role: "Software Engineer",
    org: "Axented",
    note: "Web & mobile apps shipped to App Store & Google Play",
    type: "work",
  },
  {
    period: "2019",
    role: "Software Developer",
    org: "Blue People",
    note: "Apps & APIs for education, retail & finance",
    type: "work",
  },
  {
    period: "2014 — 2018",
    role: "BSc, Information Technology Engineering",
    org: "Universidad Politécnica de Victoria",
    type: "study",
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="section block-lavender timeline">
      <div className="container">
        <p className="section-indicator"># The Journey</p>
        <h2 className="section-header">Seven years, six teams, four industries.</h2>

        <Reveal as="ol" className="timeline__list" stagger>
          {ENTRIES.map((e, i) => (
            <li
              key={i}
              className={`timeline__item timeline__item--${e.type}`}
            >
              <span className="timeline__node" aria-hidden="true" />
              <span className="timeline__period">{e.period}</span>
              <div className="timeline__body">
                <h3 className="timeline__role">{e.role}</h3>
                <p className="timeline__org">{e.org}</p>
                {e.note && <p className="timeline__note">{e.note}</p>}
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
