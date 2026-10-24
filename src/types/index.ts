/** Site language. `zh` (Traditional Chinese) is the root site, `en` lives under /en. */
export type Locale = "zh" | "en";

export interface Service {
  title: string;
  items: string[];
}

export interface Sketch {
  slug: string;
  title: string;
  description: string;
  preview: string;
  /** Descriptive alt text for the preview screenshot — describes what the
   *  generated sketch actually looks like (not just "<title> 預覽畫面"), for
   *  screen readers and Google Image Search. */
  alt: string;
  liveUrl: string;
  githubUrl: string;
}

export interface Hackathon {
  slug: string;
  title: string;
  /** Mono meta strip above the title, e.g. "HACKATHON · 2026/09 · 5 人團隊". */
  meta: string;
  description: string;
  role: string;
  /** Hard-fact bullets, same voice as a project's highlights. */
  points: string[];
  image: string;
  alt: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
}

/** One delivered automation job in the Freelance section. */
export interface FreelanceCase {
  slug: string;
  /** Mono meta strip, e.g. "付費接案 · 2026/06–". */
  meta: string;
  title: string;
  /** Who it was for, in a plain phrase. */
  client: string;
  description: string;
  /** Hard-fact bullets: what was built and how it holds up. */
  points: string[];
  tech: string[];
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
  /** Alt text for `image` when the generic "<title> 作品畫面" / "Screenshot of
   *  <title>" would mislead (e.g. myBot's cover is a flow diagram). Not used
   *  for `detailImage`. */
  imageAlt?: string;
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

/** The translatable text fields of a Project. Other locales supply these per
 *  project id and inherit everything else (media, tech, links) from the zh
 *  entry, so assets and links can never drift between languages. */
export type ProjectCopy = Pick<
  Project,
  | "category"
  | "title"
  | "description"
  | "subtitle"
  | "outcome"
  | "role"
  | "overview"
  | "highlights"
  | "imageAlt"
>;
