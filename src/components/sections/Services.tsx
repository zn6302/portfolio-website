import { useRef } from "react";
import { assets, services } from "../../data";
import { useScrollFlip } from "../../hooks";
import { AvailabilityPill, MaskHeading } from "../ui";
import { SkillsGraph } from "./SkillsGraph";

const SERVICES_FLIP = {
  from: { rotation: 8, rotateY: -180, rotateX: 14, scale: 0.86, x: -390, y: 80 },
  to: { rotation: 8, rotateY: 0, rotateX: 0, scale: 1, x: 0, y: 0 },
  start: "top bottom",
  end: "center center",
};

const stripIndex = (title: string) => title.replace(/^\d+\.\s*/, "");

interface ServicesProps {
  disableCardFlip?: boolean;
}

export function Services({ disableCardFlip = false }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollFlip(cardRef, { ...SERVICES_FLIP, triggerRef: sectionRef, disabled: disableCardFlip });

  return (
    <section className="section services" id="skills" ref={sectionRef}>
      <div className="section-grid">
        <div data-scroll-reveal>
          <AvailabilityPill className="inline-availability" />
          <MaskHeading text="SKILLS / 技能棧" />
          <p className="lead">
            前端工程、互動動畫、後端資料到 AI 應用，這是我實際用來做出上線作品的技術棧。
          </p>

          {/* Accessible, structured source of truth (read by screen readers on
              every viewport). The visual graph and phone tag grid below are
              aria-hidden alternatives of this same list. */}
          <ul className="sr-only skills-sr-list">
            {services.map((service) => (
              <li key={service.title}>
                {stripIndex(service.title)}：{service.items.join("、")}
              </li>
            ))}
          </ul>

          {/* Desktop / tablet (>760px): constellation graph. */}
          <SkillsGraph />

          {/* Phones (<=760px): plain category tag grid — no shrunk graph. */}
          <div className="skills-taggrid" aria-hidden="true">
            {services.map((service) => (
              <div className="skills-taggroup" key={service.title}>
                <h3>{stripIndex(service.title)}</h3>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="tilt-frame services-image scroll-flip-card" ref={cardRef}>
          <img className="scroll-flip-back" src={assets.portraitBack} alt="" aria-hidden="true" width={2730} height={1536} loading="lazy" />
          <img className="scroll-flip-front" src={assets.servicesPortrait} alt="Portrait of the designer" width={680} height={952} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
