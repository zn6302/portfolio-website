import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * The hero intro video (`/hero/hero-animation.*`) is heavy relative to a phone
 * data plan. Below 768px we never set a `src`/`<source>` on the `<video>` at
 * all — not just hide it with CSS — so phones only ever fetch the poster
 * image and the GSAP shrink-into-card animation still runs on the (video-less)
 * element's box. Tablets and up keep the real video.
 *
 * Also respects `prefers-reduced-motion`: reduced-motion users get the poster
 * frame everywhere, matching the static fallback already used elsewhere.
 */
export function useHeroVideoSources() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(() => {
    if (typeof window === "undefined") return true;
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !isMobile && !reducedMotion;
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShouldLoadVideo(!mobileQuery.matches && !motionQuery.matches);
    update();
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return shouldLoadVideo;
}
