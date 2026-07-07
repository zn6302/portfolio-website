import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Project } from "../../types";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface ProjectOverlayProps {
  project: Project | null;
  onClose: () => void;
  returnFocusRef: HTMLElement | null;
}

// Full-screen project detail overlay. Rendered whenever `project` is set;
// handles its own enter/exit animation, focus management, ESC/backdrop
// dismissal, and background scroll locking (see the effect below for why it
// blocks scroll input directly instead of the usual overflow-hidden trick).
export function ProjectOverlay({ project, onClose, returnFocusRef }: ProjectOverlayProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollPositionRef = useRef(0);

  // Lock background scrolling while the overlay is open. This intentionally
  // does NOT toggle body's `overflow`/`position` (the classic scroll-lock
  // recipe): the Projects deck keeps a GSAP ScrollTrigger pinned + scrubbed
  // against window scroll, and even briefly changing body's overflow (which
  // hides/restores the scrollbar and nudges document width) was observed to
  // desync ScrollTrigger's cached measurements, sending the page into a
  // runaway scroll of several hundred pixels once the overlay closed.
  // Instead, block the scroll-causing input events directly (wheel, touch
  // drag, and scroll-relevant keys) while leaving layout completely
  // untouched — window.scrollY never changes, so there's nothing to restore
  // and no scrollbar-width compensation is needed.
  useEffect(() => {
    if (!project) return;
    scrollPositionRef.current = window.scrollY;

    const SCROLL_KEYS = new Set([
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ]);

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
  }, [project]);

  // Focus the panel on open, return focus to the triggering card on close.
  useEffect(() => {
    if (!project) return;
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => {
      returnFocusRef?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  // ESC to close.
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [project, onClose]);

  // Enter/exit animation via CSS transition (see .project-overlay-* rules in
  // styles.css) — the "entered" class is added a frame after mount so the
  // browser animates from the initial state instead of skipping straight to
  // it. This never touches the Projects deck's GSAP ScrollTrigger instance.
  const [entered, setEntered] = useState(false);
  useLayoutEffect(() => {
    if (!project) return;
    setEntered(false);
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [project]);

  if (!project) return null;

  const titleId = `project-overlay-title-${project.id}`;

  // Rendered via a portal to document.body: the Projects deck's pinned
  // <section> gets a GSAP-applied CSS transform while scrubbing, and any
  // transformed ancestor becomes the containing block for descendant
  // position:fixed elements. A portal keeps this overlay's fixed
  // positioning anchored to the real viewport regardless of that.
  return createPortal(
    <div
      className={`project-overlay-backdrop${entered ? " is-open" : ""}`}
      ref={backdropRef}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`project-overlay-panel${entered ? " is-open" : ""}`}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="project-overlay-close"
          onClick={onClose}
          aria-label="Close project details"
          ref={closeButtonRef}
        >
          <X size={20} />
        </button>

        <span className="project-overlay-eyebrow">{project.category}</span>
        <h2 id={titleId} className="project-overlay-title">
          {project.title}
        </h2>
        {project.subtitle && <p className="project-overlay-subtitle">{project.subtitle}</p>}

        {project.image && (
          <img className="project-overlay-media" src={project.image} alt={`${project.title} cover`} />
        )}

        {project.role && (
          <p className="project-overlay-role">
            <span>MY ROLE</span>
            {project.role}
          </p>
        )}

        {project.overview && <p className="project-overlay-overview">{project.overview}</p>}

        {project.highlights && project.highlights.length > 0 && (
          <div className="project-overlay-highlights">
            <span className="project-overlay-label">HIGHLIGHTS</span>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {project.tech.length > 0 && (
          <ul className="project-tags project-overlay-tags">
            {project.tech.map((tech) => (
              <li className="project-tag" key={tech}>
                {tech}
              </li>
            ))}
          </ul>
        )}

        {(project.links?.live || project.links?.github) && (
          <div className="project-overlay-actions">
            {project.links?.live && (
              <a
                className="project-overlay-cta project-overlay-cta-primary"
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE SITE ↗
              </a>
            )}
            {project.links?.github && (
              <a
                className="project-overlay-cta project-overlay-cta-secondary"
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GITHUB ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
