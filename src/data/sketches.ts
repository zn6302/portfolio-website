import type { Locale, Sketch } from "../types";

// 唯一內容來源：Playground / creative coding 作品牆。
// 點擊卡片會在新分頁開啟 GitHub Pages 上可玩的原作。
const sketchesZh: Sketch[] = [
  {
    slug: "pixel-blocks",
    title: "Tinshack",
    description: "鐵皮屋的鏽蝕與摺痕被拆成色彩、光影與密集圓點——每次生成，都是一面被不同時間留下痕跡的牆。",
    preview: "/sketches/previews/pixel-blocks.webp",
    alt: "以 p5.js 生成的鐵皮屋鏽蝕與摺痕紋理，畫面由密集的彩色圓點構成不規則色塊。",
    liveUrl: "https://zn6302.github.io/ccc_project1_Tinshack/",
    githubUrl: "https://github.com/zn6302/ccc_project1_Tinshack",
  },
  {
    slug: "interactive-garden",
    title: "Flowers",
    description: "黃金角度是一串數字，直到它開成一座會跟著滑鼠呼吸的花圃。",
    preview: "/sketches/previews/interactive-garden.webp",
    alt: "以 p5.js 打造、依黃金角度排列的互動花圃，花朵會隨滑鼠移動而擺動。",
    liveUrl: "https://zn6302.github.io/ccc_project2_flowers/",
    githubUrl: "https://github.com/zn6302/ccc_project2_flowers",
  },
];

// English text per slug; everything else is inherited from the zh entry.
const sketchCopyEn: Record<string, Pick<Sketch, "description" | "alt">> = {
  "pixel-blocks": {
    description:
      "The rust and creases of a tin shack, broken down into color, light and dense dots — every run generates a wall marked by a different stretch of time.",
    alt: "A p5.js-generated texture of a rusted, creased tin shack wall, built from dense colored dots that form irregular patches.",
  },
  "interactive-garden": {
    description: "The golden angle is just a number — until it blooms into a garden that breathes with your mouse.",
    alt: "An interactive p5.js flower garden laid out by the golden angle; the flowers sway as the mouse moves.",
  },
};

export const sketches: Record<Locale, Sketch[]> = {
  zh: sketchesZh,
  en: sketchesZh.map((sketch) => ({ ...sketch, ...sketchCopyEn[sketch.slug] })),
};
