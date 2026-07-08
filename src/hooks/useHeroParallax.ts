import { useEffect, type RefObject } from "react";
import gsap from "gsap";

/**
 * Very light mouse parallax for the hero landing overlay. Each descendant
 * marked `data-parallax="<px>"` drifts toward the cursor by at most that many
 * pixels (used as three depth layers: title/eyebrow/hint), driven by
 * gsap.quickTo with damping, easing slowly back to rest when the cursor leaves
 * the window.
 *
 * Only transforms overlay text — never the shrink card/video (a separate
 * measured GSAP timeline owns those) — and only sets x/y, independent of the
 * container's opacity fade, so it can't disturb the shrink or LCP. Desktop only
 * (pointer:fine); disabled under prefers-reduced-motion.
 */
export function useHeroParallax(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const layers = Array.from(container.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (layers.length === 0) return;

    const movers = layers.map((node) => ({
      node,
      depth: parseFloat(node.dataset.parallax || "6"),
      xTo: gsap.quickTo(node, "x", { duration: 0.8, ease: "power3.out" }),
      yTo: gsap.quickTo(node, "y", { duration: 0.8, ease: "power3.out" }),
    }));

    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      for (const m of movers) {
        m.xTo(nx * m.depth);
        m.yTo(ny * m.depth);
      }
    };

    const onLeave = () => {
      for (const m of movers) {
        m.xTo(0);
        m.yTo(0);
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      for (const m of movers) gsap.set(m.node, { x: 0, y: 0 });
    };
  }, [containerRef]);
}
