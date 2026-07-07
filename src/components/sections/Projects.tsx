import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { projects } from "../../data";
import { AvailabilityPill } from "../ui";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const EMPTY_PROJECT_COUNT = 4;
// Scroll distance per panel transition, as a multiple of the viewport height.
// Full section is pinned for (panelCount - 1) * this many viewport heights, so
// the user must scroll through every panel before the page continues past it.
const SCROLL_PER_PANEL = 0.75;

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLElement[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  // Click-driven panel switcher for the no-pin mode (≤1080px / reduced motion),
  // where the scroll-scrubbed deck is disabled and the arrows must still work.
  const clickNavRef = useRef<((direction: 1 | -1) => void) | null>(null);
  const panelData = useMemo(
    () =>
      projects.length > 0
        ? projects
        : Array.from({ length: EMPTY_PROJECT_COUNT }, () => ({
            category: "",
            title: "",
            description: "",
            image: "",
          })),
    [],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const panels = panelRefs.current.filter(Boolean);
    if (!section || !stage || panels.length === 0) return;

    // Below desktop (or reduced motion) pinning the whole section for several
    // viewport-heights of scroll feels heavy-handed, and short/variable mobile
    // viewports make pin math unreliable — switch the deck to arrow-driven
    // navigation using the same slide transition the scrubbed desktop deck has.
    if (window.matchMedia("(max-width: 1080px), (prefers-reduced-motion: reduce)").matches) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(panels, { autoAlpha: 0, yPercent: 0, scale: 1 });
      gsap.set(panels[0], { autoAlpha: 1 });

      let index = 0;
      let animating = false;
      clickNavRef.current = (direction) => {
        const target = gsap.utils.clamp(0, panels.length - 1, index + direction);
        if (target === index || animating) return;
        const current = panels[index];
        const next = panels[target];
        index = target;
        setActiveIndex(target);

        if (reduceMotion) {
          gsap.set(current, { autoAlpha: 0 });
          gsap.set(next, { autoAlpha: 1, yPercent: 0, scale: 1 });
          return;
        }

        animating = true;
        gsap
          .timeline({ onComplete: () => (animating = false) })
          .to(current, { yPercent: -100 * direction, autoAlpha: 0, scale: 0.96, duration: 0.55, ease: "power2.inOut" }, 0)
          .fromTo(
            next,
            { yPercent: 100 * direction, autoAlpha: 0, scale: 0.96 },
            { yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.55, ease: "power2.inOut" },
            0,
          );
      };

      return () => {
        clickNavRef.current = null;
      };
    }

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
  }, [panelData.length]);

  const goTo = (direction: 1 | -1) => {
    if (clickNavRef.current) {
      clickNavRef.current(direction);
      return;
    }

    const trigger = triggerRef.current;
    if (!trigger) return;

    const steps = panelData.length - 1;
    if (steps <= 0) return;

    const targetIndex = gsap.utils.clamp(0, steps, activeIndex + direction);
    const targetScroll = trigger.start + (targetIndex / steps) * (trigger.end - trigger.start);
    gsap.to(window, { duration: 0.8, ease: "power2.inOut", scrollTo: { y: targetScroll } });
  };

  return (
    <section className="section project-section" id="projects" ref={sectionRef}>
      <div className="section-head">
        <AvailabilityPill className="inline-availability" />
        <h2>SELECTED WORKS</h2>
        <p className="lead">
          這裡會放真實作品：HCI 研究、互動原型、creative coding sketch，或前端實作案例。
        </p>
      </div>

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
              className="project-loop-panel"
              key={`${project.title || "empty-project"}-${index}`}
              ref={(node) => {
                if (node) panelRefs.current[index] = node;
              }}
            >
              <div className="project-loop-card">
                {project.image ? (
                  <img className="project-loop-media" src={project.image} alt={`${project.title} cover`} />
                ) : (
                  <div className="project-loop-media project-loop-media-empty" aria-hidden="true" />
                )}
                <div className="project-loop-copy">
                  <span>{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
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
    </section>
  );
}
