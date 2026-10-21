import type { Locale, Sketch } from "../types";

// 唯一內容來源：Playground / creative coding 作品牆。
// 點擊卡片會在新分頁開啟 GitHub Pages 上可玩的原作。
const sketchesZh: Sketch[] = [
  {
    slug: "pixel-blocks",
    title: "Tinshack",
    description: "用密集排列的圓點模擬鐵皮浪板，間距、亮部條紋、缺損率和配色每次生成都不一樣。",
    preview: "/sketches/previews/pixel-blocks.webp",
    alt: "用 p5.js 生成的鐵皮浪板紋理：鏽紅、銅橘、米白和深藍的密集圓點，排成一條條直向色帶。",
    liveUrl: "https://zn6302.github.io/ccc_project1_Tinshack/",
    githubUrl: "https://github.com/zn6302/ccc_project1_Tinshack",
  },
  {
    slug: "interactive-garden",
    title: "Flowers",
    description: "花朵依黃金角度排列，會跟著滑鼠擺動。",
    preview: "/sketches/previews/interactive-garden.webp",
    alt: "用 p5.js 寫的小花圃：米色的地面上，開著淺藍和淡紫、形狀各不相同的花。",
    liveUrl: "https://zn6302.github.io/ccc_project2_flowers/",
    githubUrl: "https://github.com/zn6302/ccc_project2_flowers",
  },
];

// English text per slug; everything else is inherited from the zh entry.
const sketchCopyEn: Record<string, Pick<Sketch, "description" | "alt">> = {
  "pixel-blocks": {
    description:
      "Dense dots imitate corrugated tin. Spacing, highlight stripes, gaps and colors change on every run.",
    alt: "Vertical strips of rust, copper, cream and navy dots, like a weathered corrugated-tin wall, generated in p5.js.",
  },
  "interactive-garden": {
    description: "The flowers are laid out by the golden angle and sway when you move the mouse.",
    alt: "A small p5.js flower bed: pale blue and lilac flowers of different shapes on a beige patch of ground.",
  },
};

export const sketches: Record<Locale, Sketch[]> = {
  zh: sketchesZh,
  en: sketchesZh.map((sketch) => ({ ...sketch, ...sketchCopyEn[sketch.slug] })),
};
