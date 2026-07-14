import type { CSSProperties } from "react";
import { sketches } from "../../data";
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
  return (
    <section className="section sketches-section" id="sketches">
      <div className="section-head" data-scroll-reveal>
        <span className="sketches-eyebrow">PLAYGROUND / CREATIVE CODING</span>
        <MaskHeading text="PLAYGROUND" />
        <p className="lead">
          翻譯的練習簿——把演算法與隨機性，翻譯成可以觀看、可以玩的東西。
        </p>
      </div>

      <div className="sketches-wall" data-scroll-reveal data-scroll-reveal-delay="0.16">
        {sketches.map((sketch, index) => {
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
                <span className="sketch-card-float">
                  <span className="sketch-card-media">
                    <img src={sketch.preview} alt={`${sketch.title} 預覽畫面`} loading="lazy" />
                  </span>
                </span>
                <span className="sketch-card-caption">
                  <span className="sketch-card-name">{sketch.title}</span>
                  <span className="sketch-card-cta" aria-hidden="true">
                    OPEN ↗
                  </span>
                </span>
              </a>
              <p className="sketch-card-description">{sketch.description}</p>
              <div className="sketch-card-links">
                <a href={sketch.liveUrl} target="_blank" rel="noopener noreferrer">
                  LIVE SITE ↗
                </a>
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
