import { forwardRef } from "react";

/**
 * First hero segment: the light overlay that sits on top of the full-screen
 * intro video. It fades out (opacity 1 → 0) as the video shrinks into the
 * profile card. The video itself lives in HeroTransition so it can be animated
 * independently.
 */
export const HeroIntro = forwardRef<HTMLDivElement>(function HeroIntro(_props, ref) {
  return (
    <div className="hero-intro" ref={ref}>
      <p className="hero-intro-eyebrow">YEH TZU-NI</p>
      <h2 className="hero-intro-title">FRONTEND / CREATIVE CODER</h2>
      <p className="hero-intro-hint">
        Scroll <span aria-hidden="true">↓</span>
      </p>
    </div>
  );
});
