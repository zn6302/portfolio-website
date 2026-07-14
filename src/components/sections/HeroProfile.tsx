import { forwardRef, type RefObject } from "react";
import { assets } from "../../data";
import { useMagnetic } from "../../hooks";
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
  const magnetic = useMagnetic();

  return (
    <div className="hero-profile" ref={ref}>
      <div className="hero-left">
        <p className="eyebrow">葉子倪</p>
        <h1>HCI</h1>
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
        <h1>CODING</h1>
        <p>
          我用程式，將世界表現出來。
        </p>
        <div className="hero-profile-actions">
          <AvailabilityPill className="hero-profile-badge" />
          <a ref={magnetic} className="outline-button hero-profile-cta" href="#contact">
            CONTACT
          </a>
        </div>
      </div>
    </div>
  );
});
