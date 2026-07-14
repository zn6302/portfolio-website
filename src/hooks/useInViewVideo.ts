import { useEffect, useRef } from "react";

/**
 * Plays a muted looping clip only while it is actually on screen, so a page (or
 * an open overlay) full of demo videos never decodes frames nobody is looking
 * at. `enabled` is the caller's own gate — pass `false` (e.g. phones /
 * reduced-motion, where no `src` is set at all) and no observer is attached.
 *
 * No `root` needed even inside the overlay's internally-scrolling panel: an
 * observer measures against the viewport *after* ancestor clipping, so a clip
 * scrolled out of the panel already reports as not intersecting.
 */
export function useInViewVideo(enabled: boolean) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // play() rejects if the element is torn down mid-play (overlay close,
        // prev/next swap) — not an error worth surfacing.
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
