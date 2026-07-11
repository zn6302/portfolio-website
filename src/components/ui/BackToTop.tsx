import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getLenis, useBackToTop } from "../../hooks";

gsap.registerPlugin(ScrollToPlugin);

/**
 * Fixed circular "back to top" button. Positioned right:20px / bottom:80px
 * (16px / 72px on mobile) — deliberately offset upward from the bottom-right
 * corner rather than sitting flush at bottom:20px, because another branch
 * (feat/bgm) already fixes a music-toggle button at right:20px, bottom:20px,
 * same 44px size and z-index:40. Neither branch can see the other's code, so
 * this stacks the two into a vertical column instead of overlapping once the
 * branches merge.
 *
 * Visibility follows useBackToTop (scroll > one viewport or 400px, whichever
 * is smaller) with a CSS opacity/translateY fade so it never appears with a
 * hard cut. Click scrolls to top via the same GSAP ScrollToPlugin easing used
 * by useAnchorScroll, honouring prefers-reduced-motion with an instant jump.
 */
export function BackToTop() {
  const visible = useBackToTop();

  const handleClick = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      window.scrollTo(0, 0);
      return;
    }
    // Route through Lenis when it owns window scroll (same double-drive
    // avoidance as useAnchorScroll); ScrollToPlugin path otherwise.
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1, easing: (t) => 1 - Math.pow(1 - t, 3) });
      return;
    }
    gsap.to(window, {
      duration: 0.9,
      ease: "power2.inOut",
      scrollTo: 0,
    });
  };

  return (
    <button
      type="button"
      aria-label="回到頂部"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={handleClick}
      className={`fixed right-5 bottom-20 max-[480px]:right-4 max-[480px]:bottom-[72px] z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper shadow-card transition-[opacity,transform,box-shadow] duration-200 ease-out hover:shadow-hover hover:-translate-y-0.5 focus-visible:shadow-hover focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-deep focus-visible:outline-offset-2 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-ink"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
