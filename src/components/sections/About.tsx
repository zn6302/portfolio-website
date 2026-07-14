import { useRef } from "react";
import { assets } from "../../data";
import { useScrollFlip, useMagnetic } from "../../hooks";
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

  return (
    <section className="section about-section" id="about" ref={sectionRef}>
      <div className="section-grid about-grid">
        <div data-scroll-reveal>
          <AvailabilityPill className="inline-availability" />
          <MaskHeading text="ABOUT" />
          <p className="lead">
            我相信前端工程師是翻譯者：在設計與程式之間、在人與機器之間。我做的每一件作品，都是一次翻譯練習——把動作翻譯成音樂、把情緒翻譯成氣味、把設計稿裡的故事翻譯成會動的程式碼。
          </p>
          <p className="lead">
            我是葉子倪，政大數位內容，喜歡 HCI 與互動藝術，<br />
            目標是成為「能把設計、互動、工程和使用者體驗整合起來的前端工程師」。
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
            alt="Illustration of the designer at her desk, from the hero animation"
          />
        </div>
      </div>
    </section>
  );
}
