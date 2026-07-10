import type { Sketch } from "../types";

// 唯一內容來源：Playground / creative coding 作品牆。
// 每件都是自站託管的 p5.js sketch（public/sketches/<slug>/index.html），
// 點擊卡片會在新分頁開啟可玩的原作。
export const sketches: Sketch[] = [
  {
    slug: "pixel-blocks",
    title: "像素色塊",
    description: "隨機色票驅動的直向像素色塊生成，畫布重跑一次就換一種配色與紋理。",
    preview: "/sketches/previews/pixel-blocks.webp",
  },
  {
    slug: "interactive-garden",
    title: "互動花圃",
    description: "以黃金角度排列的向量花卉場域，滑鼠靠近會讓花朵微微擺動。",
    preview: "/sketches/previews/interactive-garden.webp",
  },
];
