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
        YE ZI-NI
      </p>
      <h2 className="hero-intro-title" data-parallax="10">
        FRONTEND / <br />
        CREATIVE CODER
      </h2>
      <p className="hero-intro-en" data-parallax="9">
        I translate the invisible into experience.
      </p>
      <p className="hero-intro-hint" data-parallax="4">
        Scroll <span aria-hidden="true">↓</span>
      </p>
    </div>
  );
});
