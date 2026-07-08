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
  {
    slug: "flow-field",
    title: "向量場粒子",
    description: "五千顆粒子沿 Perlin noise 向量場流動，疊出毛絮狀的流線紋理。",
    preview: "/sketches/previews/flow-field.webp",
  },
  {
    slug: "quadtree",
    title: "四元樹分割",
    description: "點群聚集之處，四元樹（quadtree）即時遞迴細分空間——把抽象的空間索引結構畫出來。",
    preview: "/sketches/previews/quadtree.webp",
  },
  {
    slug: "joy-division",
    title: "稜線圖",
    description: "Perlin noise 疊出的等高稜線地形，向 Unknown Pleasures 專輯封面的視覺致敬。",
    preview: "/sketches/previews/joy-division.webp",
  },
];
