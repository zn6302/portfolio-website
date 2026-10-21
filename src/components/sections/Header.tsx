import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { assets, navItems } from "../../data";
import { useScrolled, useNearBottom } from "../../hooks";
import { AvailabilityPill, LangToggle } from "../ui";

function useSkillsReached() {
  const [skillsReached, setSkillsReached] = useState(false);

  useEffect(() => {
    const skills = document.getElementById("skills");
    if (!skills) return;

    const observer = new IntersectionObserver(([entry]) => {
      setSkillsReached(entry.isIntersecting || entry.boundingClientRect.top <= 0);
    });
    observer.observe(skills);
    return () => observer.disconnect();
  }, []);

  return skillsReached;
}

export function Header() {
  const scrolled = useScrolled();
  const nearBottom = useNearBottom();
  const skillsReached = useSkillsReached();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!skillsReached || nearBottom) setMenuOpen(false);
  }, [skillsReached, nearBottom]);

  return (
    <>
      <header className={`site-nav ${scrolled ? "hidden" : ""}`} aria-label="Primary">
        <img src={assets.avatar} alt="Portfolio creator avatar" width={320} height={320} />
        <nav>
          {navItems.map((item) => (
            <a key={item} href={item === "Home" ? "#" : `#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <LangToggle />
        <a className="contact-pill" href="#contact">
          Contact
        </a>
      </header>

      <div
        className={`sticky-status ${scrolled ? "visible" : ""} ${skillsReached ? "skills-reached" : ""} ${nearBottom ? "near-bottom" : ""}`}
      >
        <AvailabilityPill className="header-availability" />
        <button
          className="menu-button"
          type="button"
          aria-label="Menu"
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={21} strokeWidth={2} />
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-drawer ${menuOpen && skillsReached ? "open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen || !skillsReached}
      >
        {navItems.map((item) => (
          <a key={item} href={item === "Home" ? "#" : `#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
            {item}
          </a>
        ))}
        <LangToggle />
        <a href="#contact" onClick={() => setMenuOpen(false)}>
          Contact
        </a>
      </nav>
    </>
  );
}
