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

export interface QuoteTestimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export interface MetricTestimonial {
  metric: string;
  label: string;
  intro: string;
  tone: "dark" | "purple";
}

export type Testimonial = QuoteTestimonial | MetricTestimonial;

export interface Faq {
  question: string;
  answer: string;
}

export interface Insight {
  category: string;
  date: string;
  title: string;
  description: string;
  image: string;
}
