import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assets } from "../../data";
import { useHeroVideoSources } from "../../hooks";
import { About } from "./About";
import { HeroTransition } from "./HeroTransition";
import { Services } from "./Services";

gsap.registerPlugin(ScrollTrigger);

interface CardRect {
  width: number;
  height: number;
  x: number;
  y: number;
  radius: string;
}

function centerScrollFor(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  return window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
}

// Where a section's card slot sits in the viewport at the moment that section is
// centered — because the card stage is sticky-pinned at top:0, these viewport
// coordinates are exactly where the pinned card must be.
function rectAtCenteredSection(slot: HTMLElement, section: HTMLElement): CardRect {
  const slotRect = slot.getBoundingClientRect();
  const targetScroll = centerScrollFor(section);
  return {
    width: slotRect.width,
    height: slotRect.height,
    x: window.scrollX + slotRect.left,
    y: window.scrollY + slotRect.top - targetScroll,
    radius: getComputedStyle(slot).borderRadius,
  };
}

function rectCenteredInViewport(slot: HTMLElement): CardRect {
  const width = slot.offsetWidth;
  const height = slot.offsetHeight;
  return {
    width,
    height,
    x: (window.innerWidth - width) / 2,
    y: (window.innerHeight - height) / 2,
    radius: getComputedStyle(slot).borderRadius,
  };
}

/**
 * One continuous card for the whole top of the page.
 *
 * A single `.linked-card` starts full-screen (the intro mp4), shrinks into the
 * hero/profile position, then keeps going — rotating through the Services and
 * About card slots — without ever handing off to a second element. The three
 * phases are one scrubbed timeline whose segment lengths match the actual scroll
 * distances (measured, never hardcoded) so each stop lines up with its section.
 */
export function HeroCardJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoLayerRef = useRef<HTMLVideoElement>(null);
  const portraitLayerRef = useRef<HTMLImageElement>(null);
  const loadVideo = useHeroVideoSources();

  useLayoutEffect(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    const videoLayer = videoLayerRef.current;
    const portraitLayer = portraitLayerRef.current;
    if (!root || !card || !videoLayer || !portraitLayer) return;

    const heroTransition = root.querySelector<HTMLElement>(".hero-transition");
    const intro = root.querySelector<HTMLElement>(".hero-intro");
    const profile = root.querySelector<HTMLElement>(".hero-profile");
    const profileSlot = root.querySelector<HTMLElement>(".profile-card-slot");
    const servicesSection = root.querySelector<HTMLElement>(".services");
    const servicesSlot = root.querySelector<HTMLElement>(".services-image");
    const aboutSection = root.querySelector<HTMLElement>(".about-section");
    const aboutSlot = root.querySelector<HTMLElement>(".about-image");
    if (
      !heroTransition ||
      !intro ||
      !profile ||
      !profileSlot ||
      !servicesSection ||
      !servicesSlot ||
      !aboutSection ||
      !aboutSlot
    ) {
      return;
    }

    // gsap.matchMedia owns the whole breakpoint lifecycle: each branch below is
    // (re)built when its query starts matching and fully reverted when it stops,
    // so crossing 1080px or toggling reduced-motion (resize, tablet rotation,
    // OS setting change) tears down the old regime and builds the right one —
    // instead of freezing whatever was chosen at mount.
    const mm = gsap.matchMedia();

    // Reduced motion (any width): no pin, no scrubbed shrink. `.hero-static`
    // collapses the hero into an ordinary block; just hide the floating card and
    // the intro overlay and reveal the profile with its parked slot video.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      root.classList.add("hero-static");
      gsap.set(card, { autoAlpha: 0 });
      gsap.set(intro, { autoAlpha: 0 });
      gsap.set(profile, { autoAlpha: 1 });
      return () => {
        root.classList.remove("hero-static");
      };
    });

    // Mobile (motion): the desktop journey card is hidden below 1080px. Run only
    // the intro "shrink into card" phase on `.hero-mobile-media`, scrubbed while
    // .hero-sticky is pinned. The video lives inside .hero-sticky, so once the
    // pin releases it scrolls away with the hero — no second sticky to sync, and
    // Services/About keep their own static cards below.
    mm.add("(max-width: 1080px) and (prefers-reduced-motion: no-preference)", () => {
      const heroMobileMedia = root.querySelector<HTMLVideoElement>(".hero-mobile-media");
      const heroSticky = root.querySelector<HTMLElement>(".hero-sticky");
      if (!heroMobileMedia || !heroSticky) return;

      gsap.set(card, { autoAlpha: 0 });

      let timeline: gsap.core.Timeline | undefined;
      let trigger: ScrollTrigger | undefined;
      let cancelled = false;

      // Slot geometry measured relative to .hero-sticky (the media's offset
      // parent), so it's correct regardless of scroll/pin state.
      const target = { width: 0, height: 0, x: 0, y: 0, radius: "18px" };
      const measure = () => {
        const slot = profileSlot.getBoundingClientRect();
        const sticky = heroSticky.getBoundingClientRect();
        target.width = slot.width;
        target.height = slot.height;
        target.x = slot.left - sticky.left;
        target.y = slot.top - sticky.top;
        target.radius = getComputedStyle(profileSlot).borderRadius;
      };

      const build = () => {
        if (cancelled) return;
        measure();
        timeline?.kill();
        trigger?.kill();

        gsap.set(heroMobileMedia, {
          width: "100%",
          height: "100%",
          x: 0,
          y: 0,
          borderRadius: 0,
          autoAlpha: 1,
        });
        gsap.set(intro, { autoAlpha: 1 });
        gsap.set(profile, { autoAlpha: 0 });

        timeline = gsap.timeline({ paused: true });
        timeline
          .to(
            heroMobileMedia,
            {
              width: () => target.width,
              height: () => target.height,
              x: () => target.x,
              y: () => target.y,
              borderRadius: () => target.radius,
              ease: "none",
            },
            0,
          )
          .to(intro, { autoAlpha: 0, ease: "none" }, 0)
          .to(profile, { autoAlpha: 1, ease: "none" }, 0);

        // Finish the shrink at ~72% of the pin so the formed card rests a beat
        // before .hero-sticky releases and the whole hero scrolls away.
        const pin = Math.max(1, heroTransition.offsetHeight - window.innerHeight);
        trigger = ScrollTrigger.create({
          trigger: heroTransition,
          start: "top top",
          end: () => "+=" + Math.round(pin * 0.72),
          scrub: 1,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          animation: timeline,
        });
      };

      build();
      document.fonts?.ready.then(build);
      let resizeId = 0;
      const onResize = () => {
        window.clearTimeout(resizeId);
        resizeId = window.setTimeout(build, 200);
      };
      window.addEventListener("resize", onResize);
      return () => {
        cancelled = true;
        window.clearTimeout(resizeId);
        window.removeEventListener("resize", onResize);
        timeline?.kill();
        trigger?.kill();
      };
    });

    // Desktop (motion): the full journey card timeline.
    mm.add("(min-width: 1081px) and (prefers-reduced-motion: no-preference)", () => {
    const state = {
      fullscreen: { width: 0, height: 0, x: 0, y: 0, radius: "0px" } as CardRect,
      profile: { width: 0, height: 0, x: 0, y: 0, radius: "0px" } as CardRect,
      services: { width: 0, height: 0, x: 0, y: 0, radius: "0px" } as CardRect,
      about: { width: 0, height: 0, x: 0, y: 0, radius: "0px" } as CardRect,
      shrink: 1,
      servicesScroll: 2,
      aboutScroll: 3,
      exitScroll: 4,
    };

    const measure = () => {
      const rootTop = window.scrollY + root.getBoundingClientRect().top;

      state.fullscreen = { width: window.innerWidth, height: window.innerHeight, x: 0, y: 0, radius: "0px" };
      state.profile = rectCenteredInViewport(profileSlot);
      state.services = rectAtCenteredSection(servicesSlot, servicesSection);
      state.about = rectAtCenteredSection(aboutSlot, aboutSection);
      // Scroll anchors that bound each phase, so segment lengths track the page.
      state.shrink = Math.max(1, heroTransition.offsetHeight - window.innerHeight);
      state.servicesScroll = Math.max(state.shrink + 1, centerScrollFor(servicesSection) - rootTop);
      state.aboutScroll = Math.max(state.servicesScroll + 1, centerScrollFor(aboutSection) - rootTop);
      // .linked-card-stage's sticky (top:0, margin-bottom:-100svh) stays fully
      // pinned for the *entire* height of this container and only starts
      // releasing once scroll reaches the container's own bottom edge — i.e. at
      // root.offsetHeight, not root.offsetHeight - innerHeight (that shorter
      // distance is what .hero-sticky in HeroTransition uses, a different
      // element). Using the shorter distance here left a ~viewport-tall gap
      // where the exit phase had already finished animating but the sticky
      // hadn't started releasing yet, so the card sat frozen in place, still
      // fully opaque, hanging over the Projects section below About.
      state.exitScroll = Math.max(state.aboutScroll + 1, root.offsetHeight);
    };

    // Function-based values are re-read whenever the timeline is invalidated on
    // refresh, keeping every stop pixel-accurate across viewport sizes.
    const rectVars = (key: "fullscreen" | "profile" | "services" | "about") => ({
      width: () => state[key].width,
      height: () => state[key].height,
      x: () => state[key].x,
      y: () => state[key].y,
      borderRadius: () => state[key].radius,
    });

    const motionVars = (key: "services" | "about") => ({
      x: () => state[key].x + (state[key].width - state.profile.width) / 2,
      y: () => state[key].y + (state[key].height - state.profile.height) / 2,
      scale: () => Math.min(state[key].width / state.profile.width, state[key].height / state.profile.height),
      borderRadius: () => state[key].radius,
    });

    const ctx = gsap.context(() => {
      let timeline: gsap.core.Timeline | undefined;
      let trigger: ScrollTrigger | undefined;
      let cancelled = false;

      const build = () => {
        if (cancelled) return;
        measure();
        timeline?.kill();
        trigger?.kill();

        // Resting state: card full-screen showing the mp4 front face.
        gsap.set(card, {
          ...rectVars("fullscreen"),
          autoAlpha: 1,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          transformPerspective: 1200,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        });
        gsap.set(videoLayer, { autoAlpha: 1 });
        gsap.set(portraitLayer, { autoAlpha: 0 });
        gsap.set(intro, { autoAlpha: 1 });
        gsap.set(profile, { autoAlpha: 0 });

        const a = state.shrink;
        const b = state.servicesScroll - state.shrink;
        const c = state.aboutScroll - state.servicesScroll;
        const d = state.exitScroll - state.aboutScroll;

        timeline = gsap.timeline({ paused: true });

        // Phase 1 — shrink full-screen mp4 into the hero card + cross-fade text.
        timeline
          .to(card, { ...rectVars("profile"), rotateY: 0, rotateX: 0, scale: 1, duration: a, ease: "none" }, 0)
          .to(intro, { autoAlpha: 0, duration: a, ease: "none" }, 0)
          .to(profile, { autoAlpha: 1, duration: a, ease: "none" }, 0)
          // Phase 2/3 mirrors ScrollFlipCard: keep the card box stable and
          // rotate/tilt/scale it as one object. The thin edge comes naturally
          // from rotateY + perspective instead of squeezing width/height.
          .to(
            card,
            { ...motionVars("services"), rotateY: 180, rotateX: 14, duration: b, ease: "power2.inOut" },
            a,
          )
          // Swap the front face content while the card is showing its back face.
          .set(videoLayer, { autoAlpha: 0 }, a + b)
          .set(portraitLayer, { autoAlpha: 1 }, a + b)
          .to(
            card,
            { ...motionVars("about"), rotateY: 360, rotateX: 0, duration: c, ease: "power2.inOut" },
            a + b,
          )
          // After it lands in About, make the sticky overlay behave like the
          // card is fixed inside the About layout: as the user keeps scrolling,
          // the card moves up by the same scroll distance and leaves with the
          // section instead of hanging over Projects.
          .to(card, { y: () => state.about.y - d, duration: d, ease: "none" }, a + b + c);

        trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => "+=" + state.exitScroll,
          scrub: 1,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          animation: timeline,
        });
      };

      build();

      // Rebuild on resize (segment lengths depend on measured scroll distances)
      // and once fonts settle (they change heading widths → layout → positions).
      let resizeId = 0;
      const onResize = () => {
        window.clearTimeout(resizeId);
        resizeId = window.setTimeout(build, 200);
      };
      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(build);

      return () => {
        cancelled = true;
        window.clearTimeout(resizeId);
        window.removeEventListener("resize", onResize);
        timeline?.kill();
        trigger?.kill();
      };
    }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="hero-card-journey" ref={rootRef}>
      <div className="linked-card-stage" aria-hidden="true">
        <div className="linked-card" ref={cardRef}>
          <div className="linked-card-face linked-card-front">
            <video
              ref={videoLayerRef}
              className="linked-card-media"
              poster={assets.aboutKeyframe}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              {loadVideo && (
                <>
                  <source src="/hero/hero-animation.webm" type="video/webm" />
                  <source src="/hero/hero-animation.mp4" type="video/mp4" />
                </>
              )}
            </video>
            <img
              ref={portraitLayerRef}
              className="linked-card-media linked-card-portrait"
              src={assets.aboutKeyframe}
              alt=""
            />
          </div>
          <div className="linked-card-face linked-card-back">
            <img className="linked-card-media" src={assets.servicesPortrait} alt="" />
          </div>
        </div>
      </div>

      <HeroTransition />
      <Services disableCardFlip />
      <About disableCardFlip />
    </div>
  );
}
