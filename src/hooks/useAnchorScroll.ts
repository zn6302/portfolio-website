import { useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stripLocale } from "../data";
import { getLenis } from "./useLenis";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// Below 760px the fixed availability/menu pill covers the top 76px
// (top 20 + 56 tall), so anchor jumps stop this far short of the target.
const MOBILE_QUERY = "(max-width: 760px)";
const MOBILE_OFFSET = 80;
// ≥761px the always-visible .site-nav covers the same 76px. Most sections'
// own top padding already clears it, but some (About in the card journey)
// start their heading right at the top — those jumps stop short just enough
// to leave the heading this far from the viewport top.
const DESKTOP_HEADING_CLEARANCE = 96;

/** Distance from the target's top to its first h2, ignoring any in-flight
 *  reveal transforms on the way (they settle after the jump). */
function headingInset(target: HTMLElement) {
  const heading = target.querySelector("h2");
  if (!heading) return null;
  let inset = heading.getBoundingClientRect().top - target.getBoundingClientRect().top;
  for (let el: HTMLElement | null = heading; el && el !== target; el = el.parentElement) {
    const transform = getComputedStyle(el).transform;
    if (transform && transform !== "none") inset -= new DOMMatrixReadOnly(transform).m42;
  }
  return inset;
}

function offsetFor(target: HTMLElement) {
  if (window.matchMedia(MOBILE_QUERY).matches) return MOBILE_OFFSET;
  const inset = headingInset(target);
  return inset === null ? 0 : Math.max(0, Math.round(DESKTOP_HEADING_CLEARANCE - inset));
}

function focusTarget(target: HTMLElement) {
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
    // Lets styles.css drop the focus ring on whole sections only.
    target.setAttribute("data-anchor-target", "");
  }
  target.focus({ preventScroll: true });
}

/** Instant jump with the same offset as a nav click. Lenis, when it owns the
 *  scroll, is moved with it so its next frame doesn't drag the page back.
 *  Returns where the page actually ended up (clamped at the bottom). */
function jumpTo(target: HTMLElement) {
  const y = Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - offsetFor(target)));
  const lenis = getLenis();
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo(0, y);
  }
  return window.scrollY;
}

/** Element id from the URL hash, only on the home page (project paths open
 *  the overlay instead). Null for no hash or a malformed one. */
function hashTargetId() {
  if (stripLocale(window.location.pathname) !== "/") return null;
  try {
    return decodeURIComponent(window.location.hash.slice(1)) || null;
  } catch {
    return null;
  }
}

/**
 * Delegates in-page hash-link clicks (`href="#contact"` etc.) to GSAP
 * ScrollToPlugin so anchor jumps share the same easing/duration as the
 * Projects up/down buttons. Native `scroll-behavior: smooth` is removed from
 * `html` because it double-drives ScrollToPlugin and lands imprecisely.
 *
 * Honours prefers-reduced-motion: reduced falls back to an instant jump.
 *
 * After the jump, focus moves to the target section (made focusable with
 * tabindex="-1" if needed) so keyboard and screen-reader users land where
 * they asked to go — the skip link and nav would otherwise leave focus in
 * the header. The jump stops short where needed so the section heading
 * clears the fixed nav / phone pill (offsetFor).
 *
 * A page that loads with a section hash (LangToggle keeps the reader's place
 * that way) lands on it once the pins are built — see the second effect.
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
      const offset = typeof target === "number" ? 0 : offsetFor(target);
      const done = () => {
        if (typeof target !== "number") focusTarget(target);
      };
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        const y =
          typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo(0, Math.max(0, y));
        done();
        return;
      }
      // When Lenis owns window scroll, drive the anchor jump through it —
      // ScrollToPlugin writing scrollY while Lenis smooths it double-drives
      // the scroll and lands imprecisely. Lenis is absent under
      // reduced-motion / touch, where the ScrollToPlugin path still applies.
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 0.9,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          offset: -offset,
          onComplete: done,
        });
        return;
      }
      gsap.to(window, {
        duration: 0.8,
        ease: "power2.inOut",
        scrollTo: typeof target === "number" ? target : { y: target, autoKill: true, offsetY: offset },
        onComplete: done,
        // A layout shift (pin refresh, late image) can auto-kill the tween
        // just short of the target; focus should still move there.
        onAutoKill: done,
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Arriving with a hash (`/en#projects` from LangToggle, or a shared link):
  // the browser's own fragment jump runs before the pins exist and doesn't
  // land, so wait for fonts plus two frames (MaskHeading/Projects/the hero
  // journey refresh on those), rebuild the triggers, then jump instantly with
  // the nav-click offset. If the page hadn't finished loading, re-land once on
  // `load` unless the reader has scrolled since. The hash is then dropped (nav
  // clicks never write one) so a reload doesn't pull the reader back here.
  useEffect(() => {
    const id = hashTargetId();
    if (!id || !document.getElementById(id)) return;

    let cancelled = false;
    let landedY = -1;
    const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const land = () => {
      const target = document.getElementById(id);
      if (target) landedY = jumpTo(target);
      return target;
    };
    const dropHash = () => {
      const { pathname, search } = window.location;
      window.history.replaceState(window.history.state, "", `${pathname}${search}`);
    };
    const onLoad = () => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        if (Math.abs(window.scrollY - landedY) <= 2) {
          ScrollTrigger.refresh();
          land();
        }
        dropHash();
      });
    };

    (async () => {
      await document.fonts?.ready.catch(() => undefined);
      await nextFrame();
      await nextFrame();
      if (cancelled) return;
      ScrollTrigger.refresh();
      const target = land();
      if (target) focusTarget(target);
      if (document.readyState === "complete") dropHash();
      else window.addEventListener("load", onLoad, { once: true });
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
  }, []);
}
