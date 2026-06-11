import Reveal from "./Reveal";

const LINKS = [
  {
    label: "Email",
    value: "smillerjess@gmail.com",
    href: "mailto:smillerjess@gmail.com",
    icon: "mail",
    colorClass: "contact-btn--peach",
  },
  {
    label: "LinkedIn",
    value: "in/jose-smiller",
    href: "https://linkedin.com/in/jose-smiller",
    icon: "work",
    colorClass: "contact-btn--periwinkle",
  },
  {
    label: "Phone",
    value: "+34 608 703 913",
    href: "tel:+34608703913",
    icon: "call",
    colorClass: "contact-btn--butter",
  },
  /* {
    label: "Portfolio",
    value: "jsmiller.netlify.app",
    href: "https://jsmiller.netlify.app",
    icon: "language",
    colorClass: "contact-btn--mint",
  }, */
];

export default function Footer() {
  return (
    <footer id="contact" className="section block-periwinkle contact">
      <div className="container">
        <Reveal variant="up">
          <p className="section-indicator"># Let's talk</p>
          <h2 className="contact__headline">
            Got a messy codebase or an ambitious rollout?
          </h2>
          <p className="contact__lede">
            I'm open to senior / staff full-stack &amp; frontend roles. Let's
            build something resilient.
          </p>
        </Reveal>

        <ul className="contact__links">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className={`contact-btn ${l.colorClass}`}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  l.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                aria-label={`${l.label}: ${l.value}`}
              >
                <span
                  className="contact-btn__icon material-symbols-rounded"
                  aria-hidden="true"
                >
                  {l.icon}
                </span>
                <span className="contact-btn__label">{l.label}</span>
                <span className="contact-btn__value">{l.value}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="contact__copy">
          © {new Date().getFullYear()} Jose Smiller · Built with Astro, React
          &amp; GSAP.
        </p>
      </div>
    </footer>
  );
}
