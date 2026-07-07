import { useRef } from "react";
import { assets } from "../../data";
import { useScrollFlip } from "../../hooks";
import { HiBubble } from "../ui";

const HERO_FLIP = {
  from: { rotateY: 0, rotateX: 0, scale: 1, x: 0, y: 0 },
  to: { rotateY: 180, rotateX: 14, scale: 0.86, x: 390, y: 120 },
  start: "center center",
  end: "bottom top",
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollFlip(cardRef, { ...HERO_FLIP, triggerRef: sectionRef });

  return (
    <section className="hero" id="home" ref={sectionRef}>
      <div className="hero-left">
        <p className="eyebrow">DUNCAN ROBERT</p>
        <h1>DIGITAL</h1>
      </div>
      <div className="portrait-card hero-portrait scroll-flip-card" ref={cardRef}>
        <img
          className="portrait-back scroll-flip-back"
          src={assets.portraitBack}
          alt="Portrait of portfolio creator back view"
        />
        <img className="scroll-flip-front" src={assets.portrait} alt="Portrait of portfolio creator front view" />
        <HiBubble />
      </div>
      <div className="hero-right">
        <h1>DESIGNER</h1>
        <p>I'm a US-based digital designer and Framer developer</p>
      </div>
    </section>
  );
}
