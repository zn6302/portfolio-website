import { forwardRef, useRef } from "react";
import { useHeroParallax } from "../../hooks";

/**
 * First hero segment: the light overlay that sits on top of the full-screen
 * intro video. It fades out (opacity 1 → 0) as the video shrinks into the
 * profile card. The video itself lives in HeroTransition so it can be animated
 * independently.
 *
 * The three text lines double as parallax depth layers (`data-parallax`) — a
 * very light mouse drift on the landing (desktop only). Parallax sets x/y on
 * these children only, independent of the container's opacity fade, so it never
 * touches the shrink timeline.
 */
export const HeroIntro = forwardRef<HTMLDivElement>(function HeroIntro(_props, ref) {
  const localRef = useRef<HTMLDivElement>(null);
  useHeroParallax(localRef);

  const setRefs = (node: HTMLDivElement | null) => {
    localRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div className="hero-intro" ref={setRefs}>
      <p className="hero-intro-eyebrow" data-parallax="6">
        YEH TZU-NI
      </p>
      <h2 className="hero-intro-title" data-parallax="10">
        FRONTEND / CREATIVE CODER
      </h2>
      {/* 3-second positioning line: composed only of existing site copy
          (CLAUDE.md positioning + the Header badge's OPEN TO 2026 INTERNSHIP).
          Below 760px the sticky AvailabilityPill already shows the internship
          signal on the same screen, so CSS hides the second half there. */}
      <p className="hero-intro-sub" data-parallax="8">
        HCI × CREATIVE CODING
        <span className="hero-intro-sub-extra"> · OPEN TO 2026 INTERNSHIP</span>
      </p>
      <p className="hero-intro-hint" data-parallax="4">
        Scroll <span aria-hidden="true">↓</span>
      </p>
    </div>
  );
});
