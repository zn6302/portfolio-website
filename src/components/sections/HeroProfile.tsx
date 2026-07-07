import { forwardRef, type RefObject } from "react";
import { assets } from "../../data";
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
  return (
    <div className="hero-profile" ref={ref}>
      <div className="hero-left">
        <p className="eyebrow">葉子倪</p>
        <h1>HCI</h1>
      </div>

      {/* Flip landing target. On desktop it stays empty — the floating journey
          video flips into this exact footprint. On mobile that journey is
          disabled and the floating card is hidden, so this slot renders its own
          static hero video (revealed via CSS below 1080px). */}
      <div className="profile-card-slot" ref={slotRef} aria-hidden="true">
        <video
          className="profile-card-slot-video"
          src="/hero/hero-animation.mp4"
          poster={assets.aboutKeyframe}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className="hero-right">
        <h1>CODING</h1>
        <p>以互動設計、前端實作與 creative coding 探索人與介面之間的體驗。</p>
        <div className="hero-profile-actions">
          <AvailabilityPill className="hero-profile-badge" />
          <a className="outline-button hero-profile-cta" href="#contact">
            CONTACT
          </a>
        </div>
      </div>
    </div>
  );
});
