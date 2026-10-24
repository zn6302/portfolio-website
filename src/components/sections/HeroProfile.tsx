import { forwardRef, type RefObject } from "react";
import { assets } from "../../data";
import { useLocale, useMagnetic } from "../../hooks";
import { AvailabilityPill } from "../ui";

interface HeroProfileProps {
  /** The empty slot the floating video flips into — measured, never hardcoded. */
  slotRef: RefObject<HTMLDivElement | null>;
}

/**
 * Second hero segment: the white profile hero. Starts hidden (opacity 0) and
 * fades in as the intro video shrinks. `.profile-card-slot` is an empty
 * placeholder whose geometry is the flip target for the video.
 */
export const HeroProfile = forwardRef<HTMLDivElement, HeroProfileProps>(function HeroProfile(
  { slotRef },
  ref,
) {
  // One hook per button: useMagnetic keeps a single cleanup slot, so a shared
  // ref would unwire the first button when the second one attaches.
  const magneticWork = useMagnetic();
  const magneticContact = useMagnetic();
  const { t } = useLocale();

  return (
    <div className="hero-profile" ref={ref}>
      {/* "HCI" / "CODING" below are purely visual split-column typography (the
          floating journey video flips in between them) — not real headings.
          The page's one semantic <h1> lives in App.tsx, outside every
          animated hero container so it survives all motion states (see the
          comment there). These are demoted to <span> (not <p> — styles.css has
          `.hero-right p` / `.hero-card-journey .hero-right p` /
          `.hero-profile .hero-right p` rules meant for the body-copy
          paragraph that sits next to "CODING"; those are tag selectors, so a
          <p> here would accidentally match them too and lose its type size —
          confirmed by an actual before/after DOM diff. <span> matches none of
          them). `.hero-visual-title` is listed alongside every `h1` selector
          in styles.css so the type scale stays literally the same rule, not a
          copy that can drift; color still comes from the inherited
          `.hero-card-journey { color: var(--color-paper-light) }`, same as
          before — untouched. */}
      <div className="hero-left">
        <p className="hero-name">{t.heroName}</p>
        <span className="hero-visual-title">HCI</span>
      </div>

      {/* Flip landing target. On desktop it stays empty — the floating journey
          video flips into this exact footprint. This element is only ever
          revealed by CSS in the reduced-motion static fallback (`.hero-static`),
          and reduced motion means "no autoplaying video" — so it never gets a
          `<source>` at all, just the poster/first-frame image, matching the
          prefers-reduced-motion contract everywhere else on the site. */}
      <div className="profile-card-slot" ref={slotRef} aria-hidden="true">
        <video
          className="profile-card-slot-video"
          poster={assets.aboutKeyframe}
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className="hero-right">
        <span className="hero-visual-title">CODING</span>
        <p>{t.heroTagline}</p>
        {/* Badge on its own line, then the CTA pair: the work first (the one
            clay button in this frame), contact second. The pair wraps at 320. */}
        <div className="hero-profile-actions">
          <AvailabilityPill className="hero-profile-badge" />
          <div className="hero-profile-ctas">
            <a ref={magneticWork} className="outline-button is-primary hero-profile-cta" href="#projects">
              {t.ctaSeeWork}
              <span className="hero-profile-cta-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
            <a ref={magneticContact} className="outline-button is-secondary hero-profile-cta" href="#contact">
              {t.ctaContact}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
