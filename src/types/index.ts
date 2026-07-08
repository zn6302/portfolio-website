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
  image: string;
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
