import { Fragment, forwardRef, useRef } from "react";
import { useHeroParallax, useLocale } from "../../hooks";

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
  const { t } = useLocale();
  // "\n" in the role copy marks the line break; the trailing space keeps a
  // word gap between the lines in the heading's accessible text.
  const roleLines = t.heroRole.split("\n");

  const setRefs = (node: HTMLDivElement | null) => {
    localRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div className="hero-intro" ref={setRefs}>
      <p className="hero-intro-eyebrow" data-parallax="6">
        {t.heroIntroName}
      </p>
      <h2 className="hero-intro-title" data-parallax="10">
        {roleLines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 && <br />}
            {index < roleLines.length - 1 ? `${line} ` : line}
          </Fragment>
        ))}
      </h2>
      <p className="hero-intro-en" data-parallax="9">
        {t.heroConcept}
      </p>
      <p className="hero-intro-hint" data-parallax="4">
        {t.scrollHint} <span aria-hidden="true">↓</span>
      </p>
    </div>
  );
});
