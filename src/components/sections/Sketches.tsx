import type { CSSProperties } from "react";
import { sketches } from "../../data";
import { useLocale } from "../../hooks";
import { MaskHeading } from "../ui";

// Per-card float/rotation variety. Index-matched to `sketches`; if more
// sketches are added later this simply repeats via modulo (see render below).
const CARD_META = [
  { rotate: -2, delay: 0, duration: 7.4 },
  { rotate: 3, delay: -2.6, duration: 8.2 },
  { rotate: -1.5, delay: -4.8, duration: 6.8 },
  { rotate: 2.5, delay: -1.4, duration: 8.6 },
  { rotate: -2.8, delay: -3.6, duration: 7.9 },
];

export function Sketches() {
  const { locale, t } = useLocale();

  return (
    <section className="section sketches-section" id="sketches" aria-label={t.sketchesLabel}>
      <div className="section-head">
        <span className="section-eyebrow" aria-hidden="true">05 / 07</span>
        <MaskHeading text="PLAYGROUND" />
        {/* Reveal the lead only; the heading has its own mask reveal. */}
        <p className="lead" data-scroll-reveal data-scroll-reveal-delay="0.12">
          {t.sketchesLead}
        </p>
      </div>

      <div className="sketches-wall" data-scroll-reveal data-scroll-reveal-delay="0.16">
        {sketches[locale].map((sketch, index) => {
          const meta = CARD_META[index % CARD_META.length];
          return (
            <article
              key={sketch.slug}
              className="sketch-card"
              style={
                {
                  "--card-rot": `${meta.rotate}deg`,
                  "--card-delay": `${meta.delay}s`,
                  "--card-duration": `${meta.duration}s`,
                } as CSSProperties
              }
            >
              <a
                className="sketch-card-live"
                href={sketch.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* The caption chip rides inside the float layer so it stays
                    pinned to the artwork's corner while the image bobs. */}
                <span className="sketch-card-float">
                  <span className="sketch-card-media">
                    <img src={sketch.preview} alt={sketch.alt} loading="lazy" />
                  </span>
                  <span className="sketch-card-caption">
                    <span className="sketch-card-name">{sketch.title}</span>
                    <span className="sketch-card-cta" aria-hidden="true">
                      OPEN ↗
                    </span>
                  </span>
                </span>
              </a>
              <p className="sketch-card-description">{sketch.description}</p>
              {/* The artwork above is the live link; the text row only adds the source. */}
              <div className="sketch-card-links">
                <a href={sketch.githubUrl} target="_blank" rel="noopener noreferrer">
                  GITHUB ↗
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
