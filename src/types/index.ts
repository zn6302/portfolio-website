export interface Service {
  title: string;
  items: string[];
}

export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  links?: {
    live?: string;
    github?: string;
  };
}
