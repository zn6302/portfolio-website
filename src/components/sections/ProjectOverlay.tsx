import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import gsap from "gsap";
import type { Project, ProjectClip } from "../../types";
import { getLenis, useHeroVideoSources, useInViewVideo, useMagnetic } from "../../hooks";
import { projects as allProjects } from "../../data";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FLIP_QUERY = "(min-width: 1081px)";

interface ProjectOverlayProps {
  project: Project | null;
  /** The card element the overlay was opened from — FLIP expand origin. */
  originEl?: HTMLElement | null;
  onClose: () => void;
  returnFocusRef: HTMLElement | null;
}

// FLIP is desktop-only (the deck cards) and skipped under reduced motion; the
// compact stacked layout and reduced-motion both fall back to the CSS fade.
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function canFlip() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(FLIP_QUERY).matches &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

// Every highlight is naturally "short headline + separator + explanation"
// (either full-width "：" or an em-dash "——"). Split on whichever comes
// first so the headline can render bold — the data itself is untouched.
function splitHighlight(text: string): { label: string | null; rest: string } {
  const colonIdx = text.indexOf("：");
  const dashIdx = text.indexOf("——");
  let idx = -1;
  let sepLen = 0;
  if (colonIdx !== -1 && (dashIdx === -1 || colonIdx < dashIdx)) {
    idx = colonIdx;
    sepLen = 1;
  } else if (dashIdx !== -1) {
    idx = dashIdx;
    sepLen = 2;
  }
  if (idx === -1) return { label: null, rest: text };
  return { label: text.slice(0, idx), rest: text.slice(idx + sepLen) };
}

// One "detail" row: the clip proves the thing works, the copy beside it says
// why it was built that way. Silent + looping + no controls — it's an
// illustration of the paragraph next to it, not something to sit and watch.
// `preload="none"` means opening the overlay costs nothing until a clip is
// scrolled to; phones and reduced-motion get the poster and never fetch it.
function ClipDetail({ clip }: { clip: ProjectClip }) {
  const shouldLoadVideo = useHeroVideoSources();
  const videoRef = useInViewVideo(shouldLoadVideo);

  return (
    <li className="project-overlay-clip">
      <div className="project-overlay-clip-media">
        <video
          ref={videoRef}
          className="project-overlay-clip-video"
          src={shouldLoadVideo ? clip.src : undefined}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={clip.title}
        />
      </div>
      <div className="project-overlay-clip-copy">
        <h4 className="project-overlay-clip-title">{clip.title}</h4>
        <p className="project-overlay-clip-caption">{clip.caption}</p>
      </div>
    </li>
  );
}

// Full-screen project detail overlay. Rendered whenever `project` is set;
// handles its own enter/exit animation, focus management, ESC/backdrop
// dismissal, and background scroll locking (see the effect below for why it
// blocks scroll input directly instead of the usual overflow-hidden trick).
//
// `rendered` lags the `project` prop so an exit animation can play before the
// portal unmounts: when the parent clears `project`, we collapse the panel back
// into the originating card (FLIP) and only then drop `rendered` to null.
//
// `overrideProject` lets the bottom prev/next strip swap the displayed case
// study in place — without touching `rendered`/`flip`, so it never replays the
// FLIP open animation, only a simple content cross-fade.
export function ProjectOverlay({ project, originEl, onClose, returnFocusRef }: ProjectOverlayProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollPositionRef = useRef(0);
  const originRectRef = useRef<DOMRect | null>(null);
  const magneticLive = useMagnetic();
  const magneticGithub = useMagnetic();

  const [rendered, setRendered] = useState<Project | null>(null);
  const [flip, setFlip] = useState(false);
  // Non-flip (CSS) enter: add `is-open` a frame after mount so it transitions.
  const [entered, setEntered] = useState(false);
  const [overrideProject, setOverrideProject] = useState<Project | null>(null);

  // Open / close orchestration — keyed on the incoming prop only.
  useLayoutEffect(() => {
    if (project) {
      // Opening (or switching projects).
      originRectRef.current = originEl?.getBoundingClientRect() ?? null;
      setFlip(canFlip() && !!originRectRef.current);
      setRendered(project);
      setEntered(false);
      return;
    }
    // Closing.
    if (!rendered) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const inner = innerRef.current;
    if (!flip || !originRectRef.current || !panel || !backdrop || !inner) {
      setRendered(null);
      return;
    }
    const first = originRectRef.current;
    const last = panel.getBoundingClientRect();
    const tl = gsap.timeline({ onComplete: () => setRendered(null) });
    tl.to(inner, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0);
    tl.to(
      panel,
      {
        x: first.left - last.left,
        y: first.top - last.top,
        scaleX: first.width / last.width,
        scaleY: first.height / last.height,
        duration: 0.45,
        ease: "power3.inOut",
      },
      0.05,
    );
    tl.to(backdrop, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.1);
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  // A fresh open (new `rendered` identity) always resets any in-place
  // prev/next override back to the project that was actually opened.
  useLayoutEffect(() => {
    setOverrideProject(null);
  }, [rendered]);

  // FLIP enter — runs once the panel is mounted. Measures the panel's final
  // rect, snaps it onto the origin card, then expands to identity. Content
  // (header/lede/meta/media/highlights) staggers in after the box lands.
  useLayoutEffect(() => {
    if (!rendered || !flip) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const inner = innerRef.current;
    const first = originRectRef.current;
    if (!panel || !backdrop || !inner || !first) return;

    const ctx = gsap.context(() => {
      const last = panel.getBoundingClientRect();
      gsap.set(panel, {
        transformOrigin: "0 0",
        x: first.left - last.left,
        y: first.top - last.top,
        scaleX: first.width / last.width,
        scaleY: first.height / last.height,
      });
      gsap.set(inner, { opacity: 0 });
      gsap.set(backdrop, { opacity: 0 });

      const revealTargets = contentRef.current
        ? contentRef.current.querySelectorAll<HTMLElement>(":scope > .ov-reveal")
        : [];
      gsap.set(revealTargets, { opacity: 0, y: 16 });
      if (mediaRef.current) gsap.set(mediaRef.current, { scale: 1.04 });

      const tl = gsap.timeline();
      tl.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);
      tl.to(
        panel,
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.5, ease: "power4.out" },
        0,
      );
      tl.to(inner, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0.15);
      tl.to(
        revealTargets,
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.08 },
        0.2,
      );
      if (mediaRef.current) {
        tl.to(mediaRef.current, { scale: 1, duration: 0.6, ease: "power3.out" }, 0.2);
      }
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered, flip]);

  // Non-flip (CSS fade) enter.
  useLayoutEffect(() => {
    if (!rendered || flip) return;
    setEntered(false);
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [rendered, flip]);

  // Lock background scrolling while the overlay is on screen (including during
  // the exit animation). This intentionally does NOT toggle body's
  // `overflow`/`position` (the classic scroll-lock recipe): the Projects deck
  // keeps a GSAP ScrollTrigger pinned + scrubbed against window scroll, and
  // even briefly changing body's overflow (which hides/restores the scrollbar
  // and nudges document width) was observed to desync ScrollTrigger's cached
  // measurements, sending the page into a runaway scroll of several hundred
  // pixels once the overlay closed. Instead, block the scroll-causing input
  // events directly (wheel, touch drag, and scroll-relevant keys) while leaving
  // layout completely untouched — window.scrollY never changes, so there's
  // nothing to restore and no scrollbar-width compensation is needed.
  useEffect(() => {
    if (!rendered) return;
    scrollPositionRef.current = window.scrollY;

    // Lenis has its own window wheel listener that would keep smoothing the
    // background while the overlay is up — halt it for the overlay's
    // lifetime. While stopped, Lenis preventDefaults wheel input everywhere
    // EXCEPT inside subtrees marked `data-lenis-prevent` (the backdrop below),
    // so the panel's own overflow-y scrolling keeps working natively.
    // stop()/start() never touch window.scrollY, so ScrollTrigger's cached
    // measurements stay valid (same reasoning as the paragraph above).
    const lenis = getLenis();
    lenis?.stop();

    const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

    const isInsidePanel = (target: EventTarget | null) =>
      target instanceof Node && panelRef.current?.contains(target);

    const onWheel = (event: WheelEvent) => {
      if (!isInsidePanel(event.target)) event.preventDefault();
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!isInsidePanel(event.target)) event.preventDefault();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key) && !isInsidePanel(event.target)) event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
    };
  }, [rendered]);

  // Focus management: move focus into the dialog on open, keep Tab cycling
  // inside it (focus trap), mark the rest of the document inert so the
  // background can't be reached by keyboard or assistive tech, and restore
  // focus to the triggering control on close. aria-modal alone doesn't stop
  // Tab from leaving into the page behind the overlay.
  useEffect(() => {
    if (!rendered) return;
    closeButtonRef.current?.focus({ preventScroll: true });

    // Everything under <body> except this overlay's backdrop becomes inert.
    const backdrop = backdropRef.current;
    const inertedSiblings: HTMLElement[] = [];
    for (const child of Array.from(document.body.children)) {
      if (child !== backdrop && child instanceof HTMLElement && !child.inert) {
        child.inert = true;
        inertedSiblings.push(child);
      }
    }

    const FOCUSABLE =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;
      if (event.shiftKey) {
        if (activeEl === first || !panel.contains(activeEl)) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !panel.contains(activeEl)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      for (const el of inertedSiblings) el.inert = false;
      returnFocusRef?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered]);

  // ESC to close (delegates to parent, which triggers the exit animation).
  useEffect(() => {
    if (!rendered) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rendered, onClose]);

  if (!rendered) return null;

  const activeProject = overrideProject ?? rendered;
  const titleId = `project-overlay-title-${activeProject.id}`;
  const openClass = entered ? " is-open" : "";
  const flipClass = flip ? " flip-active" : "";

  const activeIndex = allProjects.findIndex((candidate) => candidate.id === activeProject.id);
  const prevProject =
    activeIndex === -1 ? null : allProjects[(activeIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = activeIndex === -1 ? null : allProjects[(activeIndex + 1) % allProjects.length];

  // In-place prev/next swap: simple cross-fade of the content block only —
  // the FLIP open/close mechanics (`rendered`/`flip`) are untouched, so this
  // never replays the shared-element morph. Reduced motion swaps instantly.
  const navigateTo = (target: Project) => {
    if (target.id === activeProject.id) return;
    const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    panelRef.current?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const el = contentRef.current;
    if (!el || reduce) {
      setOverrideProject(target);
      return;
    }
    gsap.to(el, {
      opacity: 0,
      y: 8,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setOverrideProject(target);
        requestAnimationFrame(() => {
          gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        });
      },
    });
  };

  // Rendered via a portal to document.body: the Projects deck's pinned
  // <section> gets a GSAP-applied CSS transform while scrubbing, and any
  // transformed ancestor becomes the containing block for descendant
  // position:fixed elements. A portal keeps this overlay's fixed positioning
  // anchored to the real viewport regardless of that.
  return createPortal(
    <div
      className={`project-overlay-backdrop${openClass}${flipClass}`}
      ref={backdropRef}
      data-lenis-prevent=""
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`project-overlay-panel${openClass}${flipClass}`}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="project-overlay-inner" ref={innerRef}>
          <button
            type="button"
            className="project-overlay-close"
            onClick={onClose}
            aria-label="Close project details"
            ref={closeButtonRef}
          >
            <X size={20} />
          </button>

          <div className="project-overlay-content" ref={contentRef}>
            <div className="project-overlay-header ov-reveal">
              <span className="project-overlay-eyebrow">{activeProject.category}</span>
              <h2 id={titleId} className="project-overlay-title">
                {activeProject.title}
              </h2>
              {activeProject.subtitle && (
                <p className="project-overlay-subtitle">{activeProject.subtitle}</p>
              )}
            </div>

            {activeProject.overview && (
              <p className="project-overlay-lede ov-reveal">{activeProject.overview}</p>
            )}

            <div className="project-overlay-meta ov-reveal">
              {activeProject.role && (
                <div className="project-overlay-meta-item">
                  <span className="project-overlay-meta-label">ROLE</span>
                  <p className="project-overlay-meta-value">{activeProject.role}</p>
                </div>
              )}

              {activeProject.tech.length > 0 && (
                <div className="project-overlay-meta-item">
                  <span className="project-overlay-meta-label">STACK</span>
                  <ul className="project-tags project-overlay-meta-tags">
                    {activeProject.tech.map((tech) => (
                      <li className="project-tag" key={tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(activeProject.links?.live || activeProject.links?.github) && (
                <div className="project-overlay-meta-item">
                  <span className="project-overlay-meta-label">LINKS</span>
                  <div className="project-overlay-meta-links">
                    {activeProject.links?.live && (
                      <a
                        ref={magneticLive}
                        className="project-overlay-cta project-overlay-cta-primary"
                        href={activeProject.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LIVE SITE ↗
                      </a>
                    )}
                    {activeProject.links?.github && (
                      <a
                        ref={magneticGithub}
                        className="project-overlay-cta project-overlay-cta-secondary"
                        href={activeProject.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GITHUB ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {activeProject.video ? (
              <div className="project-overlay-media-wrap ov-reveal">
                {/* The clip is silent, so it can just play — but it keeps
                    `controls` (27s of demo is worth being able to pause/scrub)
                    and only autoplays when motion is welcome. Keyed so a
                    prev/next swap tears the element down instead of leaving the
                    previous project's demo playing. */}
                <video
                  key={activeProject.id}
                  ref={(el) => {
                    mediaRef.current = el;
                  }}
                  className="project-overlay-media"
                  src={activeProject.video}
                  poster={activeProject.image}
                  controls
                  muted
                  loop
                  playsInline
                  autoPlay={!prefersReducedMotion()}
                  preload="metadata"
                  aria-label={`${activeProject.title} demo`}
                />
              </div>
            ) : activeProject.detailImage || activeProject.image ? (
              <div className="project-overlay-media-wrap ov-reveal">
                <img
                  ref={(el) => {
                    mediaRef.current = el;
                  }}
                  className={`project-overlay-media${
                    activeProject.detailImage
                      ? " is-detail-image"
                      : activeProject.imageFit === "contain"
                        ? " is-contain"
                        : ""
                  }`}
                  src={activeProject.detailImage ?? activeProject.image}
                  alt={`${activeProject.title} cover`}
                />
              </div>
            ) : (
              activeProject.flow &&
              activeProject.flow.length > 0 && (
                <div className="project-overlay-flow ov-reveal">
                  <span className="project-overlay-label">SYSTEM FLOW</span>
                  <ol className="project-overlay-flow-steps">
                    {activeProject.flow.map((step, index) => (
                      <li className="project-overlay-flow-step" key={step}>
                        <span>{step}</span>
                        {index < activeProject.flow!.length - 1 && (
                          <span className="project-overlay-flow-arrow" aria-hidden="true">
                            →
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )
            )}

            {activeProject.highlights && activeProject.highlights.length > 0 && (
              <div className="project-overlay-highlights ov-reveal">
                <span className="project-overlay-label">HIGHLIGHTS</span>
                <ol className="project-overlay-highlight-list">
                  {activeProject.highlights.map((highlight, index) => {
                    const { label, rest } = splitHighlight(highlight);
                    return (
                      <li className="project-overlay-highlight" key={highlight}>
                        <span className="project-overlay-highlight-num">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="project-overlay-highlight-copy">
                          {label && <strong className="project-overlay-highlight-label">{label}</strong>}
                          {rest}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {activeProject.clips && activeProject.clips.length > 0 && (
              <div className="project-overlay-clips ov-reveal">
                <span className="project-overlay-label">巧思 DETAILS</span>
                <ul className="project-overlay-clip-list">
                  {activeProject.clips.map((clip) => (
                    <ClipDetail clip={clip} key={clip.src} />
                  ))}
                </ul>
              </div>
            )}
          </div>

          {prevProject && nextProject && (
            <nav className="project-overlay-navrow" aria-label="其他作品">
              <button
                type="button"
                className="project-overlay-navbtn project-overlay-navbtn-prev"
                onClick={() => navigateTo(prevProject)}
              >
                <span className="project-overlay-navbtn-label">← PREV</span>
                <span className="project-overlay-navbtn-title">{prevProject.title}</span>
              </button>
              <button
                type="button"
                className="project-overlay-navbtn project-overlay-navbtn-next"
                onClick={() => navigateTo(nextProject)}
              >
                <span className="project-overlay-navbtn-label">NEXT →</span>
                <span className="project-overlay-navbtn-title">{nextProject.title}</span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
