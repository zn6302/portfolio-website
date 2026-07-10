import { createElement, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type MaskHeadingProps = {
  /** Heading text. Use "\n" to split into separately-staggered visual lines. */
  text: string;
  /** Heading tag. Defaults to h2 (section titles). */
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/**
 * Line-mask reveal for section headings: each line sits in an overflow-hidden
 * wrapper and rises from translateY(100%) to 0 on scroll-enter (once), with a
 * light stagger. Shares the site's "floating paper" motion language
 * (0.7s, ease [0.16,1,0.3,1]). GSAP ScrollTrigger only — no Framer Motion on
 * the same element (CLAUDE.md rule 4). Honours prefers-reduced-motion: reduced
 * shows the heading fully with no animation.
 *
 * Uses useLayoutEffect (not useEffect) so the hidden starting state
 * (yPercent: 100) is committed before the browser paints — with useEffect the
 * heading would flash fully visible for one frame (it starts at the CSS
 * default translateY(0)) and then jump-hide before animating back in, which
 * reads as a glitch rather than a reveal. gsap.set() below still runs inside
 * a layout effect, ahead of paint, so there is nothing to flash.
 */
export function MaskHeading({ text, as = "h2", className }: MaskHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lines = text.split("\n");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inners = el.querySelectorAll<HTMLElement>(".mask-line-inner");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(inners, { yPercent: 0 });
      return;
    }

    // Hide before first paint (see doc comment above).
    gsap.set(inners, { yPercent: 100 });

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(inners, {
            yPercent: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power4.out", // matches cubic-bezier(0.16, 1, 0.3, 1)
          }),
      });

      // Section headings can sit above pinned/scrubbed siblings (e.g. the
      // Projects deck panels, or the sticky hero card journey) whose own
      // ScrollTrigger pins are set up in other components' effects. Those
      // pins change the page's total scroll height, which shifts where "top
      // 85%" actually falls. Re-measure once every pin on the page has been
      // created (end of this tick) and again once web fonts land (heading
      // width/line-height changes affect the trigger element's own position).
      requestAnimationFrame(() => ScrollTrigger.refresh());
      document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

      return () => {
        st.kill();
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return createElement(
    as,
    { ref, className: className ? `mask-heading ${className}` : "mask-heading" },
    lines.map((line, i) => (
      <span className="mask-line" key={i}>
        <span className="mask-line-inner">{line}</span>
      </span>
    )),
  );
}
