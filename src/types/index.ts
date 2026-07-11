export interface Service {
  title: string;
  items: string[];
}

export interface Sketch {
  slug: string;
  title: string;
  description: string;
  preview: string;
}

export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  /** Cover screenshot path. Omit when a project has no shipped visual (e.g.
   *  backend-only work) — consumers render a token-coloured title block. */
  image?: string;
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
  links?: {
    live?: string;
    github?: string;
  };
}
