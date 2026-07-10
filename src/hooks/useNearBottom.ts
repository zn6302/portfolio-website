import { useEffect, useState } from "react";

/**
 * True once the user has scrolled within `threshold` px of the document's
 * absolute bottom.
 *
 * Used by Header to fade out the mobile sticky-status pill (the availability
 * badge + menu button, which stay fixed at top:20px for the whole page on
 * mobile since there's no separate scroll-away nav there). Without this, the
 * pill permanently overlaps whatever content ends up at the very top of the
 * viewport once the page hits its max scroll position — on mobile that's the
 * Contact section's intro paragraph, which sits directly behind the pill with
 * no further scroll room to clear it.
 */
export function useNearBottom(threshold = 220) {
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const distanceToBottom =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      setNearBottom(distanceToBottom < threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [threshold]);

  return nearBottom;
}
