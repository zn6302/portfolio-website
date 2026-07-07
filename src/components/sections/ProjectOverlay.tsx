import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import gsap from "gsap";
import type { Project } from "../../types";
import { useMagnetic } from "../../hooks";

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
function canFlip() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(FLIP_QUERY).matches &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches
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
export function ProjectOverlay({ project, originEl, onClose, returnFocusRef }: ProjectOverlayProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollPositionRef = useRef(0);
  const originRectRef = useRef<DOMRect | null>(null);
  const magneticLive = useMagnetic();
  const magneticGithub = useMagnetic();

  const [rendered, setRendered] = useState<Project | null>(null);
  const [flip, setFlip] = useState(false);
  // Non-flip (CSS) enter: add `is-open` a frame after mount so it transitions.
  const [entered, setEntered] = useState(false);

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

  // FLIP enter — runs once the panel is mounted. Measures the panel's final
  // rect, snaps it onto the origin card, then expands to identity.
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

      const tl = gsap.timeline();
      tl.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);
      tl.to(
        panel,
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.5, ease: "power4.out" },
        0,
      );
      tl.to(inner, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.2);
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
    };
  }, [rendered]);

  // Focus the panel on open, return focus to the triggering card on close.
  useEffect(() => {
    if (!rendered) return;
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => {
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

  const activeProject = rendered;
  const titleId = `project-overlay-title-${activeProject.id}`;
  const openClass = entered ? " is-open" : "";
  const flipClass = flip ? " flip-active" : "";

  // Rendered via a portal to document.body: the Projects deck's pinned
  // <section> gets a GSAP-applied CSS transform while scrubbing, and any
  // transformed ancestor becomes the containing block for descendant
  // position:fixed elements. A portal keeps this overlay's fixed positioning
  // anchored to the real viewport regardless of that.
  return createPortal(
    <div
      className={`project-overlay-backdrop${openClass}${flipClass}`}
      ref={backdropRef}
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

          <span className="project-overlay-eyebrow">{activeProject.category}</span>
          <h2 id={titleId} className="project-overlay-title">
            {activeProject.title}
          </h2>
          {activeProject.subtitle && (
            <p className="project-overlay-subtitle">{activeProject.subtitle}</p>
          )}

          {activeProject.image && (
            <img
              className="project-overlay-media"
              src={activeProject.image}
              alt={`${activeProject.title} cover`}
            />
          )}

          {activeProject.role && (
            <p className="project-overlay-role">
              <span>MY ROLE</span>
              {activeProject.role}
            </p>
          )}

          {activeProject.overview && (
            <p className="project-overlay-overview">{activeProject.overview}</p>
          )}

          {activeProject.highlights && activeProject.highlights.length > 0 && (
            <div className="project-overlay-highlights">
              <span className="project-overlay-label">HIGHLIGHTS</span>
              <ul>
                {activeProject.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {activeProject.tech.length > 0 && (
            <ul className="project-tags project-overlay-tags">
              {activeProject.tech.map((tech) => (
                <li className="project-tag" key={tech}>
                  {tech}
                </li>
              ))}
            </ul>
          )}

          {(activeProject.links?.live || activeProject.links?.github) && (
            <div className="project-overlay-actions">
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
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
