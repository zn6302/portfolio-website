import { useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getLenis } from "./useLenis";

gsap.registerPlugin(ScrollToPlugin);

/**
 * Delegates in-page hash-link clicks (`href="#contact"` etc.) to GSAP
 * ScrollToPlugin so anchor jumps share the same easing/duration as the
 * Projects up/down buttons. Native `scroll-behavior: smooth` is removed from
 * `html` because it double-drives ScrollToPlugin and lands imprecisely.
 *
 * Honours prefers-reduced-motion: reduced falls back to an instant jump.
 */
export function useAnchorScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        // "#" (Home) — scroll to top.
        event.preventDefault();
        scrollTo(0);
        return;
      }

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      scrollTo(target);
    };

    const scrollTo = (target: HTMLElement | number) => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        const y = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, y);
        return;
      }
      // When Lenis owns window scroll, drive the anchor jump through it —
      // ScrollToPlugin writing scrollY while Lenis smooths it double-drives
      // the scroll and lands imprecisely. Lenis is absent under
      // reduced-motion / touch, where the ScrollToPlugin path still applies.
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) });
        return;
      }
      gsap.to(window, {
        duration: 0.8,
        ease: "power2.inOut",
        scrollTo: typeof target === "number" ? target : { y: target, autoKill: true },
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
