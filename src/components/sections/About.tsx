import { Fragment, useRef } from "react";
import { assets } from "../../data";
import { useLocale, useScrollFlip, useMagnetic } from "../../hooks";
import { AvailabilityPill, MaskHeading, Socials } from "../ui";

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
  const { t } = useLocale();

  return (
    <section className="section about-section" id="about" aria-label={t.aboutLabel} ref={sectionRef}>
      <div className="section-grid about-grid">
        <div data-scroll-reveal>
          <AvailabilityPill className="inline-availability" />
          <MaskHeading text="ABOUT" />
          <p className="lead">{t.aboutLead}</p>
          <p className="lead">
            {t.aboutIntro.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
          <div className="stats-row">
            <div>
              <strong>1</strong>
              <span>{t.statLaunched}</span>
            </div>
            <div>
              <strong>5+</strong>
              <span>Side Projects</span>
            </div>
            <div>
              <strong>Stack</strong>
              <span>React · Next.js · Flutter</span>
            </div>
          </div>
          <div className="contact-row">
            <div>
              <b>Email :</b>
              <span>
                <a href="mailto:znye.6302@gmail.com">znye.6302@gmail.com</a>
              </span>
            </div>
            <div>
              <b>Now :</b>
              <span>Open to 2026 internship</span>
            </div>
          </div>
          <Socials />
          <a ref={magnetic} className="outline-button" href="#skills">
            SKILLS
          </a>
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
