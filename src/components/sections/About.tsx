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
            我是葉子倪，政大數位內容碩一，核心興趣是 HCI 與互動藝術，目標是成為 Creative Coder。
            碩論進行中：用 Meta Ray-Ban Display 智慧眼鏡打造智慧博物館導覽（GraphRAG · VideoRAG · LLM）。
          </p>
          <div className="stats-row">
            <div>
              <strong>1</strong>
              <span>個已上線官網</span>
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
                <a href="mailto:vivian20021213@gmail.com">vivian20021213@gmail.com</a>
              </span>
            </div>
            <div>
              <b>Now :</b>
              <span>Open to 2026 internship</span>
            </div>
          </div>
          <Socials />
          <a className="outline-button" href="#skills">
            SKILLS
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
