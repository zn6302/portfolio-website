import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { assets, navItems } from "../../data";
import { useLocale, useScrolled, useNearBottom } from "../../hooks";
import { AvailabilityPill, LangToggle } from "../ui";

function useSkillsReached() {
  const [skillsReached, setSkillsReached] = useState(false);

  useEffect(() => {
    const skills = document.getElementById("skills");
    if (!skills) return;

    // Root stretched far above the viewport: "intersecting" then means the
    // top of #skills is above the viewport's bottom edge. A plain viewport
    // root misses instant jumps straight past the section (skip link or an
    // anchor under reduced motion, a restored scroll), because "below" →
    // "above" never changes isIntersecting, so the callback never fires.
    const observer = new IntersectionObserver(
      ([entry]) => setSkillsReached(entry.isIntersecting),
      { rootMargin: "100000px 0px 0px 0px" },
    );
    observer.observe(skills);
    return () => observer.disconnect();
  }, []);

  return skillsReached;
}

/** True while the hero card's own availability badge is on screen. On phones
 *  #skills peeks in while that badge is still visible, so the sticky pill
 *  waits for it to scroll away — never two availability pills at once. */
function useHeroBadgeOnScreen() {
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const badge = document.querySelector(".hero-profile-badge");
    if (!badge) return;

    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(badge);
    return () => observer.disconnect();
  }, []);

  return onScreen;
}

export function Header() {
  const scrolled = useScrolled();
  const nearBottom = useNearBottom();
  const skillsInView = useSkillsReached();
  const heroBadgeOnScreen = useHeroBadgeOnScreen();
  // Phones: pill + menu stay hidden through the hero and appear once #skills
  // is reached and the hero's badge has left the screen.
  const skillsReached = skillsInView && !heroBadgeOnScreen;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useLocale();
  const drawerOpen = menuOpen && skillsReached;

  // Near the bottom only the availability pill fades (styles.css); the menu
  // button stays, so the drawer only has to close when the whole pill hides.
  useEffect(() => {
    if (!skillsReached) setMenuOpen(false);
  }, [skillsReached]);

  // Esc closes the phone drawer and hands focus back to the menu button.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <>
      {/* ≥761px this pill stays put for the whole page; scrolling only adds
          a soft shadow (.is-scrolled). Below 760px it is display:none and
          .sticky-status + the drawer take over. */}
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`} aria-label={t.navPrimaryLabel}>
        <a className="site-nav-home" href="#" aria-label={t.backToTop}>
          <img src={assets.avatar} alt="" width={320} height={320} />
        </a>
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
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
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={t.menuLabel}
          aria-controls="mobile-navigation"
          aria-expanded={drawerOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={21} strokeWidth={2} />
        </button>
      </div>

      {/* Closed drawer is inert (out of the tab order and the a11y tree), not
          just aria-hidden — its links would otherwise still take focus. */}
      <nav
        id="mobile-navigation"
        className={`mobile-drawer ${drawerOpen ? "open" : ""}`}
        aria-label={t.mobileNavLabel}
        inert={!drawerOpen}
      >
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
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
