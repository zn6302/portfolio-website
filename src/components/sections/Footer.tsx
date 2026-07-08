import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Socials } from "../ui";

gsap.registerPlugin(ScrollTrigger);

const makeFooterCurve = (curveY: number) =>
  `M 0 90 C 18 ${curveY} 32 ${curveY} 50 ${curveY} C 68 ${curveY} 82 ${curveY} 100 90 V 160 H 0 Z`;

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const curveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const curve = curveRef.current;

    if (!footer || !curve) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const restingCurve = 90;

    const ctx = gsap.context(() => {
      gsap.set(curve, { attr: { d: makeFooterCurve(restingCurve) } });

      if (reduceMotion) {
        return;
      }

      ScrollTrigger.create({
        trigger: footer,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const curveY = gsap.utils.clamp(12, 150, restingCurve - self.getVelocity() / 24);

          gsap.killTweensOf(curve);
          gsap.to(curve, {
            attr: { d: makeFooterCurve(curveY) },
            duration: 0.16,
            ease: "power3.out",
            overwrite: true,
          });
          gsap.to(curve, {
            attr: { d: makeFooterCurve(restingCurve) },
            duration: 0.7,
            delay: 0.04,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });
    }, footer);

    return () => {
      gsap.killTweensOf(curve);
      ctx.revert();
    };
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <svg
        className="footer-bounce-svg"
        viewBox="0 0 100 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={curveRef} className="footer-bounce-path" d={makeFooterCurve(90)} />
      </svg>
      <div className="footer-top">
        <div>
          <span>Email :</span>
          <span>
            <a href="mailto:vivian20021213@gmail.com">vivian20021213@gmail.com</a>
          </span>
        </div>
        <div>
          <span>Now :</span>
          <span>OPEN TO 2026 INTERNSHIP</span>
        </div>
        <div>
          <span>Social :</span>
          <Socials compact />
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2026 YE Zi-Ni. Portfolio for internship applications.
        </p>
      </div>
    </footer>
  );
}
