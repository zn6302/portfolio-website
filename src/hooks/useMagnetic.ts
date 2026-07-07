import { useCallback, useRef } from "react";
import gsap from "gsap";

/**
 * Magnetic-hover + press feedback for primary buttons/links.
 *
 * Returns a stable callback ref. Attach it to any button/anchor:
 *   const magnetic = useMagnetic();
 *   <a ref={magnetic} className="outline-button">…</a>
 *
 * Behaviour (desktop only — gated on `pointer: fine`, and disabled under
 * prefers-reduced-motion):
 *  - the element drifts toward the cursor by at most `strength` px (default 6),
 *    driven by gsap.quickTo for 60fps, easing back on leave (power3.out);
 *  - pointerdown scales it to 0.97, pointerup/leave returns to 1.
 *
 * Adds a `magnetic-active` class so CSS can drop its own transform hover/
 * transition (GSAP owns the transform while active). Works for both static and
 * portal-mounted nodes because it wires per element on ref attach.
 */
export function useMagnetic(strength = 6) {
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback(
    (node: HTMLElement | null) => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (!node) return;

      const fine = window.matchMedia("(pointer: fine)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!fine || reduce) return;

      node.classList.add("magnetic-active");

      const xTo = gsap.quickTo(node, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(node, "y", { duration: 0.4, ease: "power3.out" });
      const clamp = gsap.utils.clamp(-strength, strength);

      const onMove = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        xTo(clamp(relX * 0.35));
        yTo(clamp(relY * 0.35));
      };

      const settle = () => {
        xTo(0);
        yTo(0);
        gsap.to(node, { scale: 1, duration: 0.2, ease: "power3.out" });
      };

      const onDown = () => gsap.to(node, { scale: 0.97, duration: 0.2, ease: "power3.out" });
      const onUp = () => gsap.to(node, { scale: 1, duration: 0.2, ease: "power3.out" });

      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", settle);
      node.addEventListener("pointerdown", onDown);
      node.addEventListener("pointerup", onUp);
      node.addEventListener("pointercancel", settle);

      cleanupRef.current = () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", settle);
        node.removeEventListener("pointerdown", onDown);
        node.removeEventListener("pointerup", onUp);
        node.removeEventListener("pointercancel", settle);
        gsap.killTweensOf(node);
        gsap.set(node, { x: 0, y: 0, scale: 1 });
        node.classList.remove("magnetic-active");
      };
    },
    [strength],
  );
}
