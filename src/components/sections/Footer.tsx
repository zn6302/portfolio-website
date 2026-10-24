import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "../../hooks";

gsap.registerPlugin(ScrollTrigger);

const makeFooterCurve = (curveY: number) =>
  `M 0 90 C 18 ${curveY} 32 ${curveY} 50 ${curveY} C 68 ${curveY} 82 ${curveY} 100 90 V 160 H 0 Z`;

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const curveRef = useRef<SVGPathElement>(null);
  const { t } = useLocale();

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
      {/* Two columns, each a mono label over its link. No "Now" column: the
          hero badge and the header pill already say it. */}
      <div className="footer-top">
        <div>
          <span className="footer-label">{t.emailLabel}</span>
          <a href="mailto:znye.6302@gmail.com">znye.6302@gmail.com</a>
        </div>
        <div>
          <span className="footer-label">{t.githubLabel}</span>
          <a href="https://github.com/zn6302" target="_blank" rel="noopener noreferrer">
            github.com/zn6302
            <span className="footer-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t.footerCredit}</p>
      </div>
    </footer>
  );
}
