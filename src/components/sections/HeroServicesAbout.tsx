import { useLayoutEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assets, services } from "../../data";
import { useCountUp } from "../../hooks";
import { AvailabilityPill, HiBubble, Socials } from "../ui";

gsap.registerPlugin(ScrollTrigger);

function getRightCardX() {
  const width = window.innerWidth;

  if (width <= 1080) return 0;

  return 390;
}

function StaticJourneyCard() {
  return (
    <div className="journey-fallback-card" aria-hidden="true">
      <img src={assets.portrait} alt="" />
      <HiBubble />
    </div>
  );
}

export function HeroServicesAbout() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const years = useCountUp(12);
  const projects = useCountUp(270);
  const clients = useCountUp(50);
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(card, { rotateY: 0, rotateX: 0, scale: 1, x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(card, {
        transformPerspective: 1200,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        x: 0,
        y: 0,
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(card, {
          rotateY: 180,
          rotateX: 14,
          scale: 0.86,
          x: getRightCardX,
          y: 42,
          duration: 1,
        })
        .to(card, {
          rotateY: 360,
          rotateX: 0,
          scale: 1,
          x: getRightCardX,
          y: 0,
          duration: 1,
        });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="journey-section" ref={rootRef}>
      <div className="journey-stage" aria-hidden="true">
        <div className="journey-card-shell">
          <div className="journey-card-inner" ref={cardRef}>
            <div className="journey-card-face">
              <img src={assets.portrait} alt="" />
              <HiBubble />
            </div>
            <div className="journey-card-face journey-card-back">
              <img src={assets.portraitBack} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="journey-panels">
        <section className="journey-panel journey-hero-panel" id="home">
          <div className="hero-left">
            <p className="eyebrow">DUNCAN ROBERT</p>
            <h1>DIGITAL</h1>
          </div>
          <div className="journey-card-space">
            <StaticJourneyCard />
          </div>
          <div className="hero-right">
            <h1>DESIGNER</h1>
            <p>I'm a US-based digital designer and Framer developer</p>
          </div>
        </section>

        <section className="journey-panel journey-content-panel services" id="about">
          <div>
            <AvailabilityPill className="inline-availability" />
            <h2>WHAT I CAN DO FOR YOU</h2>
            <p className="lead">
              As a digital designer, I am a visual storyteller, crafting experiences that connect deeply and spark
              creativity.
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
          <div className="journey-card-space">
            <StaticJourneyCard />
          </div>
        </section>

        <section className="journey-panel journey-content-panel about-section">
          <div>
            <AvailabilityPill className="inline-availability" />
            <h2>ABOUT ME</h2>
            <p className="lead">
              Hi, I'm Duncan — a digital designer and Framer developer passionate about crafting meaningful and
              impactful digital experiences.
            </p>
            <div className="stats-row">
              <div>
                <strong>{years}</strong>
                <span>Years of Experience</span>
              </div>
              <div>
                <strong>{projects}</strong>
                <span>Completed Projects</span>
              </div>
              <div>
                <strong>{clients}+</strong>
                <span>Clients on Worldwide</span>
              </div>
            </div>
            <div className="contact-row">
              <div>
                <b>Call Today :</b>
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </div>
              <div>
                <b>Email :</b>
                <a href="mailto:designer@example.com">designer@example.com</a>
              </div>
            </div>
            <Socials />
            <a className="outline-button" href="#about">
              MY STORY
            </a>
          </div>
          <div className="journey-card-space">
            <StaticJourneyCard />
          </div>
        </section>
      </div>
    </section>
  );
}
