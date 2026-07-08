import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether the back-to-top button should be visible: true once the
 * user has scrolled past one viewport height (or 400px, whichever is
 * smaller — short pages/small viewports still get a reasonable threshold).
 * Scroll position is read via requestAnimationFrame throttling so the
 * listener never runs the state check more than once per frame.
 */
export function useBackToTop() {
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const threshold = Math.min(window.innerHeight, 400);

    const check = () => {
      setVisible(window.scrollY > threshold);
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
