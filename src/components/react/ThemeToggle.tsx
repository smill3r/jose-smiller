import { useEffect, useState } from "react";

/**
 * Light/dark toggle. The initial class is set by an inline script in Main.astro
 * (before paint); here we just keep React state in sync and persist choices.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Read the theme the inline script already applied, so the icon matches.
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
    </button>
  );
}
