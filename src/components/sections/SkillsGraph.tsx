import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "../../data";

gsap.registerPlugin(ScrollTrigger);

/**
 * Skills constellation. A hand-laid radial graph: a central trunk node
 * ("Frontend") radiates to the four skill categories from `services.ts`, and
 * each category fans out to its individual skills. Fixed polar coordinates give
 * every node a deterministic *seed* position; a measure-and-relax pass then
 * reads each pill's real rendered size and nudges overlapping pills apart so any
 * two keep a guaranteed clearance (`MIN_GAP`), including across branches — the
 * seed radii alone can't know a pill is 134px wide. The relax is a tiny
 * AABB separation solver (no ongoing force sim); it re-runs on resize and once
 * web fonts settle (which changes pill widths), and the connector paths are
 * recomputed from the relaxed positions so lines still meet the nodes.
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

// Measure-and-relax tuning (px, in the rendered graph's own coordinate space).
// MIN_GAP is the target clearance held between every pair of pills; the extra
// headroom over the reviewer's 8px hard floor absorbs sub-pixel/font rounding.
// SPRING gently pulls each node back toward its seed so the constellation shape
// survives; PUSH/ITERS make the AABB solver converge without overshoot.
const MIN_GAP = 11;
const SPRING = 0.003;
const PUSH = 0.5;
const RELAX_ITERS = 600;

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

  // Measure-and-relax layout: read every pill's real box, push overlapping
  // pairs apart to >= MIN_GAP, then rewrite node positions + connector paths.
  // Runs regardless of reduced-motion (it's layout, not animation); re-runs on
  // resize and once web fonts load (both change pill widths).
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // gsap.matchMedia drives the breakpoint lifecycle: the graph only exists
    // above 760px (phones show the tag grid), and reduced-motion drops just the
    // entrance animation while keeping the relax layout. Crossing either query
    // (resize, tablet rotation, OS setting change) tears down and rebuilds the
    // correct state instead of freezing whatever matched at mount — previously a
    // phone→desktop resize left the graph uninitialised.
    const mm = gsap.matchMedia();
    mm.add(
      {
        isDesktop: "(min-width: 761px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (mmContext) => {
        const { isDesktop, reduce } = mmContext.conditions as {
          isDesktop: boolean;
          reduce: boolean;
        };
        if (!isDesktop) return; // phones show the tag grid

    const svg = root.querySelector<SVGSVGElement>(".skills-graph-svg");
    const centerEl = root.querySelector<HTMLElement>(".sg-node-center");
    const branchEls = [...root.querySelectorAll<HTMLElement>(".sg-branch")].map((be) => ({
      cat: be.querySelector<HTMLElement>(".sg-node-cat")!,
      skills: [...be.querySelectorAll<HTMLElement>(".sg-node-skill")],
    }));
    const gEls = svg
      ? [...svg.querySelectorAll<SVGGElement>(":scope > g")].map((g) => ({
          trunk: g.querySelector<SVGPathElement>(".sg-line-trunk")!,
          lines: [...g.querySelectorAll<SVGPathElement>(".sg-line:not(.sg-line-trunk)")],
        }))
      : [];
    if (!centerEl) return;

    // One AABB relaxation pass from seed polar coords → non-overlapping px
    // positions, then commit to the DOM. Seeds always come from the layout
    // data (never from the current DOM) so repeated runs don't compound drift.
    const relayout = () => {
      const size = root.clientWidth;
      if (!size) return;
      const k = size / VIEW; // px per view-unit

      type P = { el: HTMLElement; sx: number; sy: number; hw: number; hh: number; fixed: boolean };
      const parts: P[] = [
        { el: centerEl, sx: CENTER, sy: CENTER, hw: centerEl.offsetWidth / 2, hh: centerEl.offsetHeight / 2, fixed: true },
      ];
      branches.forEach((b, i) => {
        const cat = branchEls[i].cat;
        parts.push({ el: cat, sx: b.x, sy: b.y, hw: cat.offsetWidth / 2, hh: cat.offsetHeight / 2, fixed: false });
        b.subs.forEach((s, j) => {
          const el = branchEls[i].skills[j];
          parts.push({ el, sx: s.x, sy: s.y, hw: el.offsetWidth / 2, hh: el.offsetHeight / 2, fixed: false });
        });
      });

      const n = parts.length;
      const cx = parts.map((p) => p.sx * k);
      const cy = parts.map((p) => p.sy * k);
      const sx = cx.slice();
      const sy = cy.slice();
      const hw = parts.map((p) => p.hw);
      const hh = parts.map((p) => p.hh);

      for (let it = 0; it < RELAX_ITERS; it++) {
        const dxA = new Array(n).fill(0);
        const dyA = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const dx = cx[i] - cx[j];
            const dy = cy[i] - cy[j];
            const ox = hw[i] + hw[j] + MIN_GAP - Math.abs(dx);
            const oy = hh[i] + hh[j] + MIN_GAP - Math.abs(dy);
            if (ox > 0 && oy > 0) {
              // Separate along the axis of least penetration (min translation).
              if (ox < oy) {
                const s = (dx >= 0 ? 1 : -1) * ox * PUSH;
                dxA[i] += s;
                dxA[j] -= s;
              } else {
                const s = (dy >= 0 ? 1 : -1) * oy * PUSH;
                dyA[i] += s;
                dyA[j] -= s;
              }
            }
          }
        }
        for (let i = 0; i < n; i++) {
          if (parts[i].fixed) continue;
          cx[i] += dxA[i] + (sx[i] - cx[i]) * SPRING;
          cy[i] += dyA[i] + (sy[i] - cy[i]) * SPRING;
        }
      }

      // Commit node centres (left/top are the visual centre; CSS/GSAP translate -50%).
      for (let i = 0; i < n; i++) {
        parts[i].el.style.left = `${(cx[i] / size) * 100}%`;
        parts[i].el.style.top = `${(cy[i] / size) * 100}%`;
      }

      // Redraw connectors from the relaxed positions (px → view space).
      const vx = cx.map((v) => v / k);
      const vy = cy.map((v) => v / k);
      let ptr = 1;
      branches.forEach((b, i) => {
        const catX = vx[ptr];
        const catY = vy[ptr];
        ptr++;
        gEls[i]?.trunk?.setAttribute("d", curve(CENTER, CENTER, catX, catY, 12));
        b.subs.forEach((_, j) => {
          gEls[i]?.lines[j]?.setAttribute("d", curve(catX, catY, vx[ptr], vy[ptr], 6));
          ptr++;
        });
      });
    };

    relayout();
    let ro: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => relayout());
      ro.observe(root);
    }
    // Web fonts change pill widths after first paint — re-relax when they land.
    document.fonts?.ready.then(relayout).catch(() => {});

    if (reduce) {
      return () => ro?.disconnect();
    }

    // Entrance: lines grow via stroke-dashoffset, nodes fade + drift up in a
    // trunk → categories → skills stagger. It resets after leaving the viewport
    // so scrolling back to Skills replays the full constellation sequence.
    const ctx = gsap.context(() => {
      const trunks = root.querySelectorAll(".sg-line-trunk");
      const branchLines = root.querySelectorAll(".sg-line:not(.sg-line-trunk)");
      const center = root.querySelector(".sg-node-center");
      const cats = root.querySelectorAll(".sg-node-cat");
      const skills = root.querySelectorAll(".sg-node-skill");

      gsap.set(root.querySelectorAll(".sg-line"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set([center, ...cats, ...skills], { opacity: 0, y: 16, xPercent: -50, yPercent: -50 });

      // Stagger beat aligned with the sitewide 0.08–0.12s entrance band
      // (MaskHeading is the reference at 0.7s / 0.08). The 20 skill nodes and
      // their 20 connector lines use a 0.05/0.04 compromise so the stagger
      // sweep stays under ~1.2s (19 × 0.05 = 0.95s) instead of dragging the
      // constellation out past 2.5s at a full 0.08.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "bottom 22%",
          toggleActions: "restart reset restart reset",
        },
        defaults: { ease: "power3.out" },
      });
      tl.to(center, { opacity: 1, y: 0, duration: 0.5 }, 0)
        .to(trunks, { strokeDashoffset: 0, duration: 0.7, stagger: 0.08 }, 0.15)
        .to(cats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.4)
        .to(branchLines, { strokeDashoffset: 0, duration: 0.6, stagger: 0.04 }, 0.6)
        .to(skills, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.78);
    }, root);

        return () => {
          ro?.disconnect();
          ctx.revert();
        };
      },
    );

    return () => mm.revert();
  }, [branches]);

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
