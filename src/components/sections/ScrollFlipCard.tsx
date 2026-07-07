import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assets } from "../../data";

gsap.registerPlugin(ScrollTrigger);

// The three scroll waypoints. The shared 3D card shows its FRONT on the first
// and last panel, and flips to its BACK on the middle one.
const panels = [
  {
    id: "flip-hero",
    eyebrow: "01 — HERO",
    title: "DIGITAL DESIGNER",
    lead: "Scroll down and watch the card rotate like a real 3D object — no Three.js, just CSS transforms driven by GSAP ScrollTrigger.",
    face: "front",
  },
  {
    id: "flip-services",
    eyebrow: "02 — SERVICES",
    title: "WHAT I CAN DO",
    lead: "As you reach this section the card side-flips to reveal its back face, tilting and scaling down mid-rotation.",
    face: "back",
  },
  {
    id: "flip-about",
    eyebrow: "03 — ABOUT",
    title: "ABOUT ME",
    lead: "By the final section the card rotates a full turn and settles back to its front face, upright and full size.",
    face: "front",
  },
];

export function ScrollFlipCard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    // Respect users who prefer no motion — leave the card on its front face.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(inner, { rotateY: 0, rotateX: 0, scale: 1, x: 0, y: 0 });
      return;
    }

    // gsap.context scopes selectors + collects everything for a clean revert,
    // which also makes React 19 StrictMode's double-mount safe.
    const ctx = gsap.context(() => {
      gsap.set(inner, {
        transformPerspective: 1200,
        transformOrigin: "center center",
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        x: 0,
        y: 0,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // ties timeline progress to scroll progress (1s catch-up)
        },
      });

      // Panel 1 → 2 : front flips to back, tilting + shrinking + drifting.
      tl.to(inner, {
        rotateY: 180,
        rotateX: 14,
        scale: 0.8,
        x: -60,
        y: 30,
        duration: 1,
      });

      // Panel 2 → 3 : completes the turn (180 → 360 ≡ front) and settles.
      tl.to(inner, {
        rotateY: 360,
        rotateX: 0,
        scale: 1,
        x: 0,
        y: 0,
        duration: 1,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="flip-section" ref={rootRef}>
      <div className="flip-panels">
        {panels.map((panel) => (
          <div className="flip-panel" id={panel.id} key={panel.id}>
            <div className="flip-panel-copy">
              <p className="flip-eyebrow">{panel.eyebrow}</p>
              <h2>{panel.title}</h2>
              <p className="flip-lead">{panel.lead}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky stage — stays centered in the viewport while the panels scroll. */}
      <div className="flip-stage" aria-hidden="true">
        <div className="flip-card">
          <div className="flip-card-inner" ref={innerRef}>
            <div className="flip-card-face flip-card-front">
              <img src={assets.portrait} alt="" />
              <span className="flip-card-tag">FRONT</span>
            </div>
            <div className="flip-card-face flip-card-back">
              <img src={assets.portraitBack} alt="" />
              <span className="flip-card-tag">BACK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
