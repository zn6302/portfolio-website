import type { Locale, Service } from "../types";

export const services: Record<Locale, Service[]> = {
  zh: [
    {
      title: "1. 前端工程",
      items: ["JavaScript", "TypeScript", "React 19", "Next.js 15", "Tailwind", "Flutter"],
    },
    {
      title: "2. 互動 / 動畫",
      items: ["GSAP", "Framer Motion", "Tone.js", "Canvas", "IntersectionObserver"],
    },
    {
      title: "3. 後端與資料",
      items: ["Node.js", "Vercel Serverless", "Supabase", "Firebase", "MySQL"],
    },
    {
      title: "4. AI / 研究",
      items: ["LLM 串接", "BERT", "GraphRAG / VideoRAG", "Claude Code 工作流"],
    },
  ],
  en: [
    {
      title: "1. Frontend Engineering",
      items: ["JavaScript", "TypeScript", "React 19", "Next.js 15", "Tailwind", "Flutter"],
    },
    {
      title: "2. Interaction / Motion",
      items: ["GSAP", "Framer Motion", "Tone.js", "Canvas", "IntersectionObserver"],
    },
    {
      title: "3. Backend & Data",
      items: ["Node.js", "Vercel Serverless", "Supabase", "Firebase", "MySQL"],
    },
    {
      title: "4. AI / Research",
      items: ["LLM integration", "BERT", "GraphRAG / VideoRAG", "Claude Code workflows"],
    },
  ],
};
