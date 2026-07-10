import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data";
import type { Project } from "../../types";
import { AvailabilityPill, MaskHeading } from "../ui";
import { ProjectOverlay } from "./ProjectOverlay";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
// Full-bleed pinned deck only above this width. Below it we fall back to a
// vertical stack of full-width cards with a simple one-shot reveal (the pinned
// stacking + scrub reads poorly on short mobile viewports / URL-bar resizes).
const DECK_QUERY = "(min-width: 901px)";

function PanelMedia({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="deck-panel-media">
        <img
          className="deck-panel-media-img"
          src={project.image}
          alt={`${project.title} cover`}
        />
      </div>
    );
  }
  // mybot has no screenshot on purpose — render a token-coloured title block
  // instead of a broken image.
  return (
    <div className="deck-panel-media deck-panel-media-empty" aria-hidden="true">
      <span className="deck-panel-media-empty-title">{project.title}</span>
    </div>
  );
}

function PanelCopy({
  project,
  onOpen,
}: {
  project: Project;
  onOpen?: (buttonEl: HTMLElement) => void;
}) {
  return (
    <div className="deck-panel-copy">
      <span className="deck-panel-eyebrow">{project.category}</span>
      <h3 className="deck-panel-title">{project.title}</h3>
      {project.subtitle && <p className="deck-panel-subtitle">{project.subtitle}</p>}
      <p className="deck-panel-desc">{project.description}</p>
      {project.tech.length > 0 && (
        <ul className="project-tags">
          {project.tech.map((tech) => (
            <li className="project-tag" key={tech}>
              {tech}
            </li>
          ))}
        </ul>
      )}
      <div className="deck-panel-actions">
        {project.id && (
          <button
            type="button"
            className="deck-panel-cue"
            aria-haspopup="dialog"
            aria-label={`查看 ${project.title} 詳情`}
            onClick={(event) => onOpen?.(event.currentTarget)}
          >
            查看詳情 ↗
          </button>
        )}
        {project.links?.live && (
          <a
            className="deck-panel-link"
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
          >
            LIVE SITE ↗
          </a>
        )}
        {project.links?.github && (
          <a
            className="deck-panel-link"
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB ↗
          </a>
        )}
      </div>
    </div>
  );
}

export function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // FLIP expand origin (the clicked panel's media) and the element focus returns
  // to on close (the panel itself) — kept separate so the shared-element morph
  // is anchored on the artwork the reviewer clicked.
  const originRef = useRef<HTMLElement | null>(null);
  const focusRef = useRef<HTMLElement | null>(null);
  const panelRefs = useRef<HTMLElement[]>([]);

  // Full-bleed scroll deck. Above DECK_QUERY each project is a 100vw × 100vh
  // panel that pins (pinSpacing:false) so the next panel scrolls up over it —
  // the classic GSAP stacked-panel effect. While a panel is being covered its
  // inner scales down + dims (depth); as a panel rises in, its screenshot
  // scrubs from a slight zoom to 1 and the copy fades up. Below DECK_QUERY, and
  // under reduced motion, there is no pin — panels stack vertically and (on
  // mobile) reveal once. Rebuilds on resize / font load like HeroCardJourney so
  // pin geometry stays pixel-accurate and breakpoint crossings re-wire cleanly.
  useLayoutEffect(() => {
    let ctx: gsap.Context | undefined;

    const build = () => {
      ctx?.revert();

      const panels = panelRefs.current.filter(Boolean);
      if (panels.length === 0) return;

      // Reduced motion: leave everything in its static CSS state.
      if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

      const deck = window.matchMedia(DECK_QUERY).matches;

      ctx = gsap.context(() => {
        if (!deck) {
          // Mobile / narrow: simple one-shot rise + fade per card.
          panels.forEach((panel) => {
            const inner = panel.querySelector<HTMLElement>(".deck-panel-inner");
            if (!inner) return;
            gsap.set(inner, { autoAlpha: 0, y: 24 });
            ScrollTrigger.create({
              trigger: panel,
              start: "top 82%",
              once: true,
              onEnter: () =>
                gsap.to(inner, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }),
            });
          });
          document.fonts?.ready.then(() => ScrollTrigger.refresh());
          return;
        }

        panels.forEach((panel, index) => {
          const media = panel.querySelector<HTMLElement>(".deck-panel-media-img");
          const copy = panel.querySelector<HTMLElement>(".deck-panel-copy");
          const inner = panel.querySelector<HTMLElement>(".deck-panel-inner");
          const isLast = index === panels.length - 1;

          // Entrance: screenshot un-zooms and copy fades up as the panel rises
          // from the bottom of the viewport to the top (where it will pin).
          const entrance = gsap.timeline({
            scrollTrigger: { trigger: panel, start: "top bottom", end: "top top", scrub: true },
          });
          if (media) entrance.fromTo(media, { scale: 1.08 }, { scale: 1, ease: "none" }, 0);
          if (copy)
            entrance.fromTo(
              copy,
              { autoAlpha: 0, y: 32 },
              { autoAlpha: 1, y: 0, ease: "none" },
              0,
            );

          if (isLast) return;

          // Pin this panel; the next one scrolls up over it (higher z-index +
          // opaque background). pinSpacing:false = no extra scroll space, so
          // panels genuinely stack instead of laying out end to end.
          ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
          });

          // Depth: while the *next* panel covers this one, recede it.
          if (inner) {
            gsap.fromTo(
              inner,
              { scale: 1, autoAlpha: 1 },
              {
                scale: 0.94,
                autoAlpha: 0.5,
                ease: "none",
                scrollTrigger: {
                  trigger: panels[index + 1],
                  start: "top bottom",
                  end: "top top",
                  scrub: true,
                },
              },
            );
          }
        });

        // Fonts settle → heading widths change → re-measure every pin.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      }, sectionRef);
    };

    build();

    let resizeId = 0;
    const onResize = () => {
      window.clearTimeout(resizeId);
      resizeId = window.setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(resizeId);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, []);

  const openProject = (project: Project, buttonEl: HTMLElement, articleEl: HTMLElement | undefined) => {
    if (!project.id) return; // placeholder card, nothing to open
    // Return focus to the button that opened the dialog; anchor the FLIP morph
    // on the panel artwork.
    focusRef.current = buttonEl;
    originRef.current = articleEl?.querySelector<HTMLElement>(".deck-panel-media") ?? articleEl ?? buttonEl;
    setActiveProject(project);
  };

  const closeProject = () => setActiveProject(null);

  return (
    <section className="projects-deck" id="projects" ref={sectionRef}>
      <div className="section deck-head">
        <AvailabilityPill className="inline-availability" />
        <MaskHeading text="SELECTED WORKS" />
        <p className="lead">
          這裡會放真實作品：HCI 研究、互動原型、creative coding sketch，或前端實作案例。
        </p>
      </div>

      <div className="deck-track">
        {projects.map((project, index) => (
          <article
            className={`deck-panel${index % 2 === 1 ? " deck-panel--alt" : ""}${
              project.id ? " is-openable" : ""
            }`}
            key={project.id || `empty-project-${index}`}
            ref={(node) => {
              if (node) panelRefs.current[index] = node;
            }}
            style={{ zIndex: index + 1 }}
          >
            <div className="deck-panel-inner">
              <PanelMedia project={project} />
              <PanelCopy
                project={project}
                onOpen={(buttonEl) => openProject(project, buttonEl, panelRefs.current[index])}
              />
            </div>
          </article>
        ))}
      </div>

      <ProjectOverlay
        project={activeProject}
        originEl={originRef.current}
        onClose={closeProject}
        returnFocusRef={focusRef.current}
      />
    </section>
  );
}
