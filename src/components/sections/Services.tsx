import { useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { assets, services } from "../../data";
import { useScrollFlip } from "../../hooks";
import { AvailabilityPill } from "../ui";

const SERVICES_FLIP = {
  from: { rotation: 8, rotateY: -180, rotateX: 14, scale: 0.86, x: -390, y: 80 },
  to: { rotation: 8, rotateY: 0, rotateX: 0, scale: 1, x: 0, y: 0 },
  start: "top bottom",
  end: "center center",
};

interface ServicesProps {
  disableCardFlip?: boolean;
}

export function Services({ disableCardFlip = false }: ServicesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollFlip(cardRef, { ...SERVICES_FLIP, triggerRef: sectionRef, disabled: disableCardFlip });

  return (
    <section className="section services" id="about" ref={sectionRef}>
      <div className="section-grid">
        <div>
          <AvailabilityPill className="inline-availability" />
          <h2>SKILLS & TOOLKIT</h2>
          <p className="lead">
            我關注 HCI、互動原型與 creative coding，將研究觀察轉成可操作、可測試的介面體驗。
          </p>
          <div className="accordion services-list">
            {services.map((service, index) => (
              <div className={`accordion-item ${openIndex === index ? "open" : ""}`} key={service.title}>
                <button type="button" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                  <span>{service.title}</span>
                  <ChevronUp size={22} />
                </button>
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
          <img className="scroll-flip-back" src={assets.portraitBack} alt="" aria-hidden="true" />
          <img className="scroll-flip-front" src={assets.servicesPortrait} alt="Portrait of the designer" />
        </div>
      </div>
    </section>
  );
}
