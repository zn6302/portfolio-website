import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFlipOptions {
  /** Transform state when the trigger is at `start`. */
  from: gsap.TweenVars;
  /** Transform state when the trigger is at `end`. */
  to: gsap.TweenVars;
  /** Element that drives the scroll range. Defaults to the animated element. */
  triggerRef?: RefObject<HTMLElement | null>;
  /** ScrollTrigger start position. Default "top bottom". */
  start?: string;
  /** ScrollTrigger end position. Default "bottom top". */
  end?: string;
  /** Scrub smoothing in seconds (or `true` for instant). Default 1. */
  scrub?: number | boolean;
  /** Skip registering ScrollTrigger while preserving hook order. */
  disabled?: boolean;
}

/**
 * Scrubs a 3D transform (rotateY / rotateX / scale / y …) on a card element as
 * it scrolls through the viewport — the card turns like a 3D object while the
 * page moves, but stays a plain HTML/CSS DOM node (no Three.js).
 *
 * `transformPerspective` is baked in so the rotation reads as real depth
 * without needing `perspective` on an ancestor. Honors prefers-reduced-motion.
 */
export function useScrollFlip(
  ref: RefObject<HTMLElement | null>,
  { from, to, triggerRef, start = "top bottom", end = "bottom top", scrub = 1, disabled = false }: ScrollFlipOptions,
) {
  useLayoutEffect(() => {
    if (disabled) return;

    const el = ref.current;
    const trigger = triggerRef?.current ?? el;
    if (!el) return;

    // Leave the card in its static CSS state for reduced-motion users.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // gsap.context collects the tween + ScrollTrigger so revert() fully cleans
    // up — which also makes React 19 StrictMode's double-mount safe.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          transformPerspective: 1200,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          ...from,
        },
        {
          ...to,
          ease: "none",
          scrollTrigger: { trigger, start, end, scrub, invalidateOnRefresh: true },
        },
      );
    });

    return () => ctx.revert();
  }, [ref, triggerRef, from, to, start, end, scrub, disabled]);
}
