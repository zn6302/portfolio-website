import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data";
import type { Project } from "../../types";
import { AvailabilityPill } from "../ui";
import { ProjectOverlay } from "./ProjectOverlay";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function ProjectMedia({ project }: { project: Project }) {
  if (project.image) {
    return (
      <img className="project-row-media-img" src={project.image} alt={`${project.title} cover`} />
    );
  }
  return (
    <div className="project-row-media-empty" aria-hidden="true">
      <span className="project-row-media-empty-title">{project.title}</span>
    </div>
  );
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <div className="project-row-copy">
      <span className="project-row-eyebrow">{project.category}</span>
      <h3>{project.title}</h3>
      {project.subtitle && <p className="project-row-subtitle">{project.subtitle}</p>}
      <p className="project-row-desc">{project.description}</p>
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
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const activeCardRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<HTMLElement[]>([]);

  // Scroll-driven, one-shot reveal per row: image and copy fade + rise with a
  // small stagger as each row scrolls into view. No pinning, no scrub — a plain
  // ScrollTrigger per row that fires once. Skipped under reduced motion (the
  // content is simply shown in place).
  useLayoutEffect(() => {
    const rows = rowRefs.current.filter(Boolean);
    if (rows.length === 0) return;

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const ctx = gsap.context(() => {
      rows.forEach((row) => {
        const media = row.querySelector(".project-row-media");
        const copy = row.querySelector(".project-row-copy");
        const targets = [media, copy].filter(Boolean) as Element[];
        if (targets.length === 0) return;

        gsap.set(targets, { autoAlpha: 0, y: 24 });
        ScrollTrigger.create({
          trigger: row,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(targets, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.12,
              overwrite: true,
            });
          },
        });
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openProject = (project: Project, event: { currentTarget: HTMLElement }) => {
    if (!project.id) return; // placeholder card, nothing to open
    activeCardRef.current = event.currentTarget;
    setActiveProject(project);
  };

  const closeProject = () => setActiveProject(null);

  return (
    <section className="section project-section" id="projects" ref={sectionRef}>
      <div className="section-head">
        <AvailabilityPill className="inline-availability" />
        <h2>SELECTED WORKS</h2>
        <p className="lead">
          這裡會放真實作品：HCI 研究、互動原型、creative coding sketch，或前端實作案例。
        </p>
      </div>

      <div className="project-showcase">
        {projects.map((project, index) => (
          <article
            className={`project-row${index % 2 === 1 ? " is-reverse" : ""}${
              project.id ? " project-card-clickable" : ""
            }`}
            key={project.id || `empty-project-${index}`}
            ref={(node) => {
              if (node) rowRefs.current[index] = node;
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
            <div className="project-row-media">
              <ProjectMedia project={project} />
              {project.id && (
                <span className="project-card-affordance" aria-hidden="true">
                  查看詳情 ↗
                </span>
              )}
            </div>
            <ProjectBody project={project} />
          </article>
        ))}
      </div>

      <ProjectOverlay
        project={activeProject}
        originEl={activeCardRef.current}
        onClose={closeProject}
        returnFocusRef={activeCardRef.current}
      />
    </section>
  );
}
