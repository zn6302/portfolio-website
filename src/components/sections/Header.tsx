import { useState } from "react";
import { Menu } from "lucide-react";
import { assets, navItems } from "../../data";
import { useScrolled } from "../../hooks";
import { AvailabilityPill } from "../ui";

export function Header() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={`site-nav ${scrolled ? "hidden" : ""}`} aria-label="Primary">
        <img src={assets.avatar} alt="Portfolio creator avatar" />
        <nav>
          {navItems.map((item) => (
            <a key={item} href={item === "Home" ? "#" : `#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <a className="contact-pill" href="#contact">
          Contact
        </a>
      </header>

      <div className={`sticky-status ${scrolled ? "visible" : ""}`}>
        <AvailabilityPill />
        <button
          className="menu-button"
          type="button"
          aria-label="Menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={21} strokeWidth={2} />
        </button>
      </div>

      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <a key={item} href={item === "Home" ? "#" : `#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
            {item}
          </a>
        ))}
        <a href="#contact" onClick={() => setMenuOpen(false)}>
          Contact
        </a>
      </div>
    </>
  );
}
