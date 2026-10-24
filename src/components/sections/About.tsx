import { Fragment, useRef } from "react";
import { assets, projects, sketches } from "../../data";
import { useLocale, useScrollFlip, useMagnetic } from "../../hooks";
import { MaskHeading, Socials } from "../ui";

const ABOUT_FLIP = {
  from: { rotation: 6, rotateY: -180, rotateX: 14, scale: 0.86, x: -390, y: 80 },
  to: { rotation: 6, rotateY: 0, rotateX: 0, scale: 1, x: 0, y: 0 },
  start: "top bottom",
  end: "center center",
};

interface AboutProps {
  disableCardFlip?: boolean;
}

export function About({ disableCardFlip = false }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollFlip(cardRef, { ...ABOUT_FLIP, triggerRef: sectionRef, disabled: disableCardFlip });
  const magnetic = useMagnetic();
  const { locale, t } = useLocale();

  return (
    <section className="section about-section" id="about" aria-label={t.aboutLabel} ref={sectionRef}>
      <div className="section-grid about-grid">
        <div>
          <span className="section-eyebrow" aria-hidden="true">02 / 07</span>
          <MaskHeading text="ABOUT" />
          {/* Reveal the content under the heading; the heading has its own mask. */}
          <div data-scroll-reveal data-scroll-reveal-delay="0.12">
            <p className="lead">{t.aboutLead}</p>
            <p className="lead">
              {t.aboutIntro.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </p>
            {/* Only countable facts, read from the data so they can't drift.
                No "Now" row: the hero badge and the header pill already say it. */}
            <div className="stats-row">
              <div>
                <strong>{projects[locale].length}</strong>
                <span>{t.statProjects}</span>
              </div>
              <div>
                <strong>{sketches[locale].length}</strong>
                <span>{t.statSketches}</span>
              </div>
              <div>
                <strong>1</strong>
                <span>{t.statLaunched}</span>
              </div>
            </div>
            <div className="contact-row">
              <div>
                <span className="contact-row-label">{t.emailLabel}</span>
                <span>
                  <a href="mailto:znye.6302@gmail.com">znye.6302@gmail.com</a>
                </span>
              </div>
            </div>
            <Socials />
            {/* Forward to the work: Projects comes right after About. */}
            <a ref={magnetic} className="outline-button is-secondary" href="#projects">
              {t.ctaSeeWork}
              <span className="outline-button-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>
        <div className="tilt-frame about-image scroll-flip-card" ref={cardRef}>
          <img className="scroll-flip-back" src={assets.aboutKeyframe} alt="" aria-hidden="true" />
          <img
            className="scroll-flip-front"
            src={assets.aboutKeyframe}
            alt={t.aboutImageAlt}
          />
        </div>
      </div>
    </section>
  );
}
