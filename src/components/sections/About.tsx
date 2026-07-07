import { useRef } from "react";
import { assets } from "../../data";
import { useScrollFlip } from "../../hooks";
import { AvailabilityPill, Socials } from "../ui";

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

  return (
    <section className="section about-section" ref={sectionRef}>
      <div className="section-grid about-grid">
        <div>
          <AvailabilityPill className="inline-availability" />
          <h2>ABOUT</h2>
          <p className="lead">
            我是葉子倪，正在準備 2026 實習申請。作品集聚焦 HCI、互動設計、前端實作與 creative coding，
            期待用真實作品呈現我如何思考、做原型與迭代體驗。
          </p>
          <div className="stats-row">
            <div>
              <strong>HCI</strong>
              <span>Interaction Research</span>
            </div>
            <div>
              <strong>React</strong>
              <span>Frontend Prototype</span>
            </div>
            <div>
              <strong>GSAP</strong>
              <span>Creative Coding</span>
            </div>
          </div>
          <div className="contact-row">
            <div>
              <b>Email :</b>
              <span>
                <a href="mailto:vivian20021213@gmail.com">vivian20021213@gmail.com</a>
              </span>
            </div>
            <div>
              <b>Now :</b>
              <span>Internship application portfolio</span>
            </div>
          </div>
          <Socials />
          <a className="outline-button" href="#about">
            ABOUT
          </a>
        </div>
        <div className="tilt-frame about-image scroll-flip-card" ref={cardRef}>
          <img className="scroll-flip-back" src={assets.aboutKeyframe} alt="" aria-hidden="true" />
          <img
            className="scroll-flip-front"
            src={assets.aboutKeyframe}
            alt="Illustration of the designer at her desk, from the hero animation"
          />
        </div>
      </div>
    </section>
  );
}
