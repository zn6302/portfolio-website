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
  role?: string;
  overview?: string;
  highlights?: string[];
  links?: {
    live?: string;
    github?: string;
  };
}
