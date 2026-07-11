import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Pronounced reveals that replay whenever a section re-enters the viewport. */
export function useScrollReveal() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const elements = gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]");
      const tweens = elements.map((element) => {
        const delay = Number(element.dataset.scrollRevealDelay ?? 0);

        return gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: 56,
            scale: 0.965,
            filter: "blur(8px)",
            transformOrigin: "center bottom",
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.05,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              end: "bottom 8%",
              toggleActions: "restart reset restart reset",
            },
          },
        );
      });

      return () => {
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      };
    });

    return () => mm.revert();
  }, []);
}
