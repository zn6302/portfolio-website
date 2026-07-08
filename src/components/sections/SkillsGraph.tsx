import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "../../data";

gsap.registerPlugin(ScrollTrigger);

/**
 * Skills constellation. A hand-laid radial graph: a central trunk node
 * ("Frontend") radiates to the four skill categories from `services.ts`, and
 * each category fans out to its individual skills. Layout is deterministic
 * (fixed polar coordinates computed once — no force simulation) so the picture
 * is balanced and readable in ~3 seconds.
 *
 * The SVG + HTML node layer is decorative (`aria-hidden`); a structured
 * `sr-only` list (rendered by the parent Services section) is the accessible
 * source of truth, and phones fall back to a plain tag grid.
 */

const VIEW = 560;
const CENTER = VIEW / 2;
const R_CAT = 116; // center → category radius
const R_SUB = 210; // center → skill radius (base; alternated ±ZIGZAG per node)
const ZIGZAG = 27; // in/out radius offset so neighbouring skills don't collide
const FAN = 30; // half-spread (deg) of a category's skills around its axis

// Per-branch axis angle (deg, 0 = right, 90 = down) + accent colour. Diagonal
// placement reads as a constellation; colours are palette-safe (no coral, which
// is reserved as the single per-screen accent elsewhere).
const BRANCHES = [
  { angle: 225, accent: "var(--slate-deep)" }, // 前端工程 → up-left
  { angle: 315, accent: "var(--jade-deep)" }, //  互動/動畫 → up-right
  { angle: 135, accent: "var(--slate)" }, //      後端與資料 → down-left
  { angle: 45, accent: "var(--jade)" }, //        AI/研究 → down-right
];

// Compact labels for the graph only; the full name stays in the data, the
// sr-only list and the mobile tag grid.
const SHORT: Record<string, string> = {
  IntersectionObserver: "Observer",
  "Next.js 15": "Next.js",
  "Vercel Serverless": "Vercel",
  "GraphRAG / VideoRAG": "GraphRAG",
  "Claude Code 工作流": "Claude Code",
};

const stripIndex = (title: string) => title.replace(/^\d+\.\s*/, "");
const short = (item: string) => SHORT[item] ?? item;
const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (angle: number, r: number) => ({
  x: CENTER + r * Math.cos(rad(angle)),
  y: CENTER + r * Math.sin(rad(angle)),
});

// Gentle quadratic curve between two points (control point pushed slightly
// perpendicular to the chord) — "handwritten" feel without real curvature.
function curve(x1: number, y1: number, x2: number, y2: number, bow = 10) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

interface SubNode {
  label: string;
  full: string;
  x: number;
  y: number;
  line: string;
}
interface BranchLayout {
  title: string;
  accent: string;
  x: number;
  y: number;
  trunk: string;
  subs: SubNode[];
}

function useLayout(): BranchLayout[] {
  return useMemo(
    () =>
      services.map((service, i) => {
        const { angle, accent } = BRANCHES[i % BRANCHES.length];
        const cat = pt(angle, R_CAT);
        const n = service.items.length;
        const subs = service.items.map((item, j) => {
          // Even fan across [-FAN, +FAN] around the branch axis.
          const t = n === 1 ? 0.5 : j / (n - 1);
          const a = angle - FAN + t * FAN * 2;
          // Alternate inner/outer radius so adjacent skills (and the extreme
          // nodes of neighbouring branches) don't crowd onto the same arc.
          const r = R_SUB + (j % 2 === 0 ? -ZIGZAG : ZIGZAG);
          const p = pt(a, r);
          return {
            label: short(item),
            full: item,
            x: p.x,
            y: p.y,
            line: curve(cat.x, cat.y, p.x, p.y, 6),
          };
        });
        return {
          title: stripIndex(service.title),
          accent,
          x: cat.x,
          y: cat.y,
          trunk: curve(CENTER, CENTER, cat.x, cat.y, 12),
          subs,
        };
      }),
    [],
  );
}

const pct = (v: number) => `${(v / VIEW) * 100}%`;

export function SkillsGraph() {
  const branches = useLayout();
  const [active, setActive] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Entrance: lines grow via stroke-dashoffset, nodes fade + drift up in a
  // trunk → categories → skills stagger. GSAP ScrollTrigger, plays once.
  // Reduced-motion users skip this and see the final state (CSS defaults).
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 760px)").matches) return; // phones show the tag grid

    const ctx = gsap.context(() => {
      const trunks = root.querySelectorAll(".sg-line-trunk");
      const branchLines = root.querySelectorAll(".sg-line:not(.sg-line-trunk)");
      const center = root.querySelector(".sg-node-center");
      const cats = root.querySelectorAll(".sg-node-cat");
      const skills = root.querySelectorAll(".sg-node-skill");

      gsap.set(root.querySelectorAll(".sg-line"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set([center, ...cats, ...skills], { opacity: 0, y: 12, xPercent: -50, yPercent: -50 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
        defaults: { ease: "power3.out" },
      });
      tl.to(center, { opacity: 1, y: 0, duration: 0.5 }, 0)
        .to(trunks, { strokeDashoffset: 0, duration: 0.7, stagger: 0.06 }, 0.15)
        .to(cats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 0.4)
        .to(branchLines, { strokeDashoffset: 0, duration: 0.6, stagger: 0.02 }, 0.6)
        .to(skills, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03 }, 0.78);
    }, root);

    return () => ctx.revert();
  }, []);

  const dim = (i: number) => (active !== null && active !== i ? " is-dim" : "");
  const on = (i: number) => (active === i ? " is-active" : "");

  return (
    <div className="skills-graph" aria-hidden="true" ref={rootRef}>
      <svg className="skills-graph-svg" viewBox={`0 0 ${VIEW} ${VIEW}`} preserveAspectRatio="xMidYMid meet">
        {branches.map((b, i) => (
          <g key={b.title}>
            <path className={`sg-line sg-line-trunk${on(i)}${dim(i)}`} style={{ ["--accent" as string]: b.accent }} pathLength={1} d={b.trunk} />
            {b.subs.map((s) => (
              <path key={s.full} className={`sg-line${on(i)}${dim(i)}`} style={{ ["--accent" as string]: b.accent }} pathLength={1} d={s.line} />
            ))}
          </g>
        ))}
      </svg>

      <div className="sg-node sg-node-center" style={{ left: pct(CENTER), top: pct(CENTER) }}>
        <span>Frontend</span>
      </div>

      {branches.map((b, i) => (
        <div key={b.title} className="sg-branch">
          <div
            className={`sg-node sg-node-cat${on(i)}${dim(i)}`}
            style={{ left: pct(b.x), top: pct(b.y), ["--accent" as string]: b.accent }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
          >
            <span>{b.title}</span>
          </div>
          {b.subs.map((s) => (
            <div
              key={s.full}
              className={`sg-node sg-node-skill${on(i)}${dim(i)}`}
              style={{ left: pct(s.x), top: pct(s.y), ["--accent" as string]: b.accent }}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
