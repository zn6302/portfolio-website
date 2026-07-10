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
      <div className="section-head">
        <span className="sketches-eyebrow">PLAYGROUND / CREATIVE CODING</span>
        <MaskHeading text="PLAYGROUND" />
        <p className="lead">
          手邊的 creative coding 練習——用 p5.js 隨手畫的生成紋理與互動小品。點卡片就能在新分頁打開玩。
        </p>
      </div>

      <div className="sketches-wall">
        {sketches.map((sketch, index) => {
          const meta = CARD_META[index % CARD_META.length];
          return (
            <a
              key={sketch.slug}
              className="sketch-card"
              href={`/sketches/${sketch.slug}/index.html`}
              target="_blank"
              rel="noopener noreferrer"
              style={
                {
                  "--card-rot": `${meta.rotate}deg`,
                  "--card-delay": `${meta.delay}s`,
                  "--card-duration": `${meta.duration}s`,
                } as CSSProperties
              }
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
          );
        })}
      </div>
    </section>
  );
}
