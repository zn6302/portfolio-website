import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { projects } from "../../data";
import type { Project } from "../../types";
import { AvailabilityPill } from "../ui";
import { ProjectOverlay } from "./ProjectOverlay";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const EMPTY_PROJECT_COUNT = 4;
// Scroll distance per panel transition, as a multiple of the viewport height.
// Full section is pinned for (panelCount - 1) * this many viewport heights, so
// the user must scroll through every panel before the page continues past it.
const SCROLL_PER_PANEL = 0.75;
const COMPACT_QUERY = "(max-width: 1080px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const EMPTY_PROJECT: Project = {
  id: "",
  category: "",
  title: "",
  description: "",
  image: "",
  tech: [],
};

function readIsCompact() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(COMPACT_QUERY).matches || window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.image) {
    return <img className="project-loop-media" src={project.image} alt={`${project.title} cover`} />;
  }
  return (
    <div className="project-loop-media project-loop-media-empty" aria-hidden="true">
      <span className="project-loop-media-empty-title">{project.title}</span>
    </div>
  );
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <div className="project-loop-copy">
      <span>{project.category}</span>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      {project.tech.length > 0 && (
        <ul className="project-tags">
          {project.tech.map((tech) => (
            <li className="project-tag" key={tech}>
              {tech}
            </li>
          ))}
        </ul>
      )}
      {(project.links?.live || project.links?.github) && (
        <div className="project-links">
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              LIVE SITE ↗
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              GITHUB ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCompact, setIsCompact] = useState(readIsCompact);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLElement[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const activeCardRef = useRef<HTMLElement | null>(null);

  const openProject = (project: Project, event: { currentTarget: HTMLElement }) => {
    if (!project.id) return; // placeholder card, nothing to open
    activeCardRef.current = event.currentTarget;
    setActiveProject(project);
  };

  const closeProject = () => setActiveProject(null);
  const panelData = useMemo(
    () =>
      projects.length > 0
        ? projects
        : Array.from({ length: EMPTY_PROJECT_COUNT }, () => EMPTY_PROJECT),
    [],
  );

  // Track the mobile/narrow-viewport + reduced-motion breakpoint so the deck
  // can switch between the pinned scroll-scrubbed desktop experience and a
  // plain stacked list of full cards (no pin, no GSAP deck) on phones.
  useEffect(() => {
    const compactMq = window.matchMedia(COMPACT_QUERY);
    const reducedMq = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setIsCompact(compactMq.matches || reducedMq.matches);
    update();
    compactMq.addEventListener("change", update);
    reducedMq.addEventListener("change", update);
    return () => {
      compactMq.removeEventListener("change", update);
      reducedMq.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    // Compact mode renders a plain stacked list further down — no pinning,
    // no GSAP deck, so there is nothing to wire up here.
    if (isCompact) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const panels = panelRefs.current.filter(Boolean);
    if (!section || !stage || panels.length === 0) return;

    const ctx = gsap.context(() => {
      let cancelled = false;

      const build = () => {
        if (cancelled) return;
        triggerRef.current?.kill();

        gsap.set(panels, { autoAlpha: 0, yPercent: 100, scale: 0.96, zIndex: 1 });
        gsap.set(panels[0], { autoAlpha: 1, yPercent: 0, scale: 1, zIndex: 2 });

        const steps = panels.length - 1;
        const timeline = gsap.timeline({ paused: true });

        panels.forEach((panel, index) => {
          if (index === panels.length - 1) return;
          const next = panels[index + 1];
          timeline
            .set(next, { zIndex: 3 }, index)
            .to(panel, { yPercent: -100, autoAlpha: 0, scale: 0.96, zIndex: 2, duration: 1, ease: "power2.inOut" }, index)
            .fromTo(
              next,
              { yPercent: 100, autoAlpha: 0, scale: 0.96 },
              { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1, ease: "power2.inOut" },
              index,
            )
            .set(panel, { zIndex: 1 }, index + 1);
        });

        triggerRef.current = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + steps * window.innerHeight * SCROLL_PER_PANEL,
          pin: true,
          scrub: 1,
          snap: steps > 0 ? 1 / steps : undefined,
          animation: timeline,
          onUpdate: (self) => {
            const index = Math.round(self.progress * steps);
            setActiveIndex((current) => (current === index ? current : index));
          },
        });
      };

      build();

      let resizeId = 0;
      const onResize = () => {
        window.clearTimeout(resizeId);
        resizeId = window.setTimeout(build, 200);
      };
      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        cancelled = true;
        window.clearTimeout(resizeId);
        window.removeEventListener("resize", onResize);
      };
    }, section);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [panelData.length, isCompact]);

  const goTo = (direction: 1 | -1) => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const steps = panelData.length - 1;
    if (steps <= 0) return;

    const targetIndex = gsap.utils.clamp(0, steps, activeIndex + direction);
    const targetScroll = trigger.start + (targetIndex / steps) * (trigger.end - trigger.start);
    gsap.to(window, { duration: 0.8, ease: "power2.inOut", scrollTo: { y: targetScroll } });
  };

  const sectionHead = (
    <div className="section-head">
      <AvailabilityPill className="inline-availability" />
      <h2>SELECTED WORKS</h2>
      <p className="lead">
        這裡會放真實作品：HCI 研究、互動原型、creative coding sketch，或前端實作案例。
      </p>
    </div>
  );

  if (isCompact) {
    return (
      <section className="section project-section" id="projects" ref={sectionRef}>
        {sectionHead}
        <div className="project-stack">
          {panelData.map((project, index) => (
            <article
              className={`project-list-card${project.id ? " project-card-clickable" : ""}`}
              key={`${project.id || "empty-project"}-${index}`}
              role={project.id ? "button" : undefined}
              tabIndex={project.id ? 0 : undefined}
              aria-haspopup={project.id ? "dialog" : undefined}
              onClick={(event) => openProject(project, event)}
              onKeyDown={(event) => {
                if (!project.id) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openProject(project, event);
                }
              }}
            >
              <div className="project-loop-card">
                <ProjectMedia project={project} />
                <ProjectBody project={project} />
              </div>
            </article>
          ))}
        </div>
        <ProjectOverlay project={activeProject} originEl={activeCardRef.current} onClose={closeProject} returnFocusRef={activeCardRef.current} />
      </section>
    );
  }

  return (
    <section className="section project-section" id="projects" ref={sectionRef}>
      {sectionHead}

      <div className="project-loop" ref={stageRef}>
        <div className="project-loop-controls">
          <button type="button" aria-label="Previous project" onClick={() => goTo(-1)}>
            <ChevronUp size={21} />
          </button>
          <button className="next" type="button" aria-label="Next project" onClick={() => goTo(1)}>
            <ChevronUp size={21} />
          </button>
        </div>

        <div className="project-loop-panels">
          {panelData.map((project, index) => (
            <article
              className={`project-loop-panel${project.id ? " project-card-clickable" : ""}`}
              key={`${project.id || "empty-project"}-${index}`}
              ref={(node) => {
                if (node) panelRefs.current[index] = node;
              }}
              role={project.id ? "button" : undefined}
              tabIndex={project.id ? 0 : undefined}
              aria-haspopup={project.id ? "dialog" : undefined}
              onClick={(event) => openProject(project, event)}
              onKeyDown={(event) => {
                if (!project.id) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openProject(project, event);
                }
              }}
            >
              <div className="project-loop-card">
                <ProjectMedia project={project} />
                <ProjectBody project={project} />
                {project.id && (
                  <span className="project-card-affordance" aria-hidden="true">
                    查看詳情 ↗
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="project-loop-count" aria-label="Project panel position">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(panelData.length).padStart(2, "0")}</span>
        </div>
      </div>
      <ProjectOverlay project={activeProject} originEl={activeCardRef.current} onClose={closeProject} returnFocusRef={activeCardRef.current} />
    </section>
  );
}
