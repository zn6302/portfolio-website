import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide Lenis inertial smoothing over native window scroll.
 *
 * Deliberately NOT initialised when:
 *  - `prefers-reduced-motion: reduce` — native scrolling, zero smoothing;
 *  - the primary pointer is coarse (touch devices) — phones keep their native
 *    momentum scrolling, matching the site's existing mobile degradations
 *    (hero video off, deck pin off, FLIP off).
 *
 * GSAP integration is the standard recipe: ScrollTrigger re-measures on every
 * Lenis scroll event, and Lenis's raf is driven by gsap.ticker (autoRaf off)
 * so there is exactly one animation clock. lagSmoothing(0) stops GSAP from
 * "catching up" time after a dropped frame, which reads as a scroll jump when
 * a smoother owns the scroll position.
 *
 * The instance is exposed module-level via getLenis() so the few places that
 * must coordinate with it (useAnchorScroll's hash scrolls, ProjectOverlay's
 * scroll lock) can reach it without prop-drilling or context. Elements that
 * need their own native overflow scrolling while Lenis is stopped (the
 * project overlay) opt out with the `data-lenis-prevent` attribute.
 */

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return;

    const lenis = new Lenis({
      // Light, slow, airy — matches the floating-paper motion language.
      lerp: 0.1,
      autoRaf: false,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
