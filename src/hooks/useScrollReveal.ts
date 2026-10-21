import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_SELECTOR = "[data-scroll-reveal]";

/**
 * One-shot section reveals: a light fade + 24px rise (0.7s, power4.out) that
 * plays once, the first time a `[data-scroll-reveal]` block reaches 88% of the
 * viewport, and never replays or re-hides on re-entry.
 *
 * Only `opacity` and `y` are tweened — never `autoAlpha`. autoAlpha adds
 * `visibility:hidden`, which drops every link/button inside a not-yet-revealed
 * block out of the tab order and the accessibility tree (keyboard users could
 * not reach Playground or Contact without scrolling first). With plain opacity
 * they stay reachable, and the `focusin` listener below finishes a pending
 * reveal the moment focus lands inside it, so focus is never on an invisible
 * control.
 *
 * Reduced motion: the matchMedia gate creates no tweens at all, so every block
 * renders in its final state.
 */
export function useScrollReveal() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveals = new Map<HTMLElement, gsap.core.Tween>();

      gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
        const delay = Number(element.dataset.scrollRevealDelay ?? 0);

        reveals.set(
          element,
          gsap.fromTo(
            element,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay,
              ease: "power4.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          ),
        );
      });

      // Keyboard focus moved into a block that hasn't revealed yet (Tab, or a
      // skip/anchor link that focuses ahead of the scroll): show it now.
      const onFocusIn = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return;
        for (
          let block = event.target.closest<HTMLElement>(REVEAL_SELECTOR);
          block;
          block = block.parentElement?.closest<HTMLElement>(REVEAL_SELECTOR) ?? null
        ) {
          const tween = reveals.get(block);
          if (!tween || tween.progress() === 1) continue;
          // Detach the trigger but keep the tween (allowAnimation), so a later
          // scroll or refresh can't touch the finished state.
          tween.scrollTrigger?.kill(false, true);
          tween.progress(1);
        }
      };
      document.addEventListener("focusin", onFocusIn);

      return () => {
        document.removeEventListener("focusin", onFocusIn);
        reveals.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      };
    });

    return () => mm.revert();
  }, []);
}
