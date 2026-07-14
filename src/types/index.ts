export interface Service {
  title: string;
  items: string[];
}

export interface Sketch {
  slug: string;
  title: string;
  description: string;
  preview: string;
  liveUrl: string;
  githubUrl: string;
}

export interface ProjectClip {
  src: string;
  /** Short headline for the detail being shown, e.g. 「故障解碼進場」. */
  title: string;
  /** Why it was built this way — the clip proves it works, this says why. */
  caption: string;
  /** Optional still frame; also the only thing phones / reduced-motion get. */
  poster?: string;
}

export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  /** Cover screenshot path. Omit when a project has no shipped visual (e.g.
   *  backend-only work) — consumers render a token-coloured title block. */
  image?: string;
  /** Optional image used only in the detail overlay; the card keeps `image`. */
  detailImage?: string;
  /** Screenshots are cropped to fill their slot (`cover`); a diagram must be
   *  shown whole instead, or the labels get cut off — those set `contain`. */
  imageFit?: "cover" | "contain";
  /** Demo video path. Shown (with controls, poster = `image`) in the overlay
   *  only — the deck card keeps the still cover so the list stays light. */
  video?: string;
  tech: string[];
  subtitle?: string;
  /** One-line hard-fact summary（戰績列）— mono `·`-separated strip on the
   *  deck card front, distilled from existing description/highlight facts. */
  outcome?: string;
  role?: string;
  overview?: string;
  highlights?: string[];
  /** Optional system-flow steps rendered instead of a screenshot when a
   *  project has no shipped visual (e.g. myBot's backend-only flow). */
  flow?: string[];
  /** Per-detail demo clips, shown in the overlay under HIGHLIGHTS — each clip
   *  sits beside the copy explaining it. Only for details that are genuinely
   *  visual (an animation, a loader); engineering decisions that can't be
   *  filmed stay text-only. Keep clips short (3–8s), silent and loopable. */
  clips?: ProjectClip[];
  links?: {
    live?: string;
    github?: string;
  };
}
