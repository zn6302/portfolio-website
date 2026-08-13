import { projects } from "./projects";

/**
 * Centralised SEO copy — single source of truth shared by the runtime app
 * (document head tags a component could set) and the build-time prerender
 * step (`scripts/prerender.mjs`, which generates the real static HTML search
 * engines see for each `/projects/<slug>` page).
 *
 * Per-project copy is hand-tuned (not auto-derived) so it reads naturally and
 * front-loads the real technology keywords a reviewer or recruiter searches
 * for, but it is keyed off `projects.ts` `id`s so the two data sets can never
 * drift apart on which projects exist.
 */

export const SITE_URL = "https://znye6302.com";
export const SITE_NAME = "葉子倪 YE Zi-Ni";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// 首頁的 title/description 不放在這裡，直接寫在 `index.html`：那份 head 在 dev
// server 與正式 build 都會原樣送出，而 prerender 只是把它當模板複製給作品頁。
// 若這裡再存一份首頁文案，就會出現兩個來源、且只有其中一份真的生效。

interface ProjectSeoCopy {
  /** 顯示寬度 ≤ 60：「{作品名} — {精簡 subtitle}｜葉子倪 YE Zi-Ni」 */
  seoTitle: string;
  /** 顯示寬度 ≤ 155（見下方註解），中文為主，技術關鍵字前置 */
  seoDescription: string;
}

// Hand-written per project (not derived from description/overview verbatim)
// so search snippets read naturally and lead with the stack keywords a
// recruiter searches.
//
// 長度規則用「顯示寬度」而不是字元數：Google 依像素寬度截斷摘要（桌機約
// 920px），全形中文字約佔半形的兩倍寬，所以常見的「155 字元」建議只適用於
// 英文。這裡以「全形計 2、半形計 1」估算，總和控制在 155 以內；超過的部分
// 會被截成「…」，等於白寫。關鍵字一律前置，確保截斷也不影響理解。
const PROJECT_SEO_COPY: Record<string, ProjectSeoCopy> = {
  "all-things-scored": {
    seoTitle: "All Things Scored — 把動作翻譯成音樂｜葉子倪 YE Zi-Ni",
    seoDescription:
      "用 React、TypeScript、Tone.js 與 Canvas 打造的互動裝置：Computer Vision 偵測動作，即時翻譯成音樂，穩定 60fps 的 creative coding 作品。",
  },
  "openhci-2026": {
    seoTitle: "OpenHCI 2026 官方網站 — (AI)dentity｜葉子倪 YE Zi-Ni",
    seoDescription:
      "用 Next.js 15、React 19、Tailwind v4、Framer Motion 開發的 OpenHCI 2026 官方網站，依 Figma 實作故障與像素風動畫敘事，已上線 2026.openhci.com。",
  },
  "click-or-check": {
    seoTitle: "Click or Check? — 可玩的媒體倫理｜葉子倪 YE Zi-Ni",
    seoDescription:
      "用 React 19、Vite、Tailwind 打造的媒體素養互動遊戲：在流量與公信力之間權衡查證抉擇，雙軸計分系統搭配零圖表庫的即時資料視覺化。",
  },
  mybot: {
    seoTitle: "myBot 體態管理 LINE Bot｜葉子倪 YE Zi-Ni",
    seoDescription:
      "用 TypeScript、Vercel Serverless、Gemini、Supabase 打造的 LINE Bot：拍照辨識搭配八層意圖路由與 TDEE 公式估算熱量，後端一人獨立開發。",
  },
  smiley: {
    seoTitle: "SMILEY 情緒日記 — 療癒從感受開始｜葉子倪 YE Zi-Ni",
    seoDescription:
      "用 Flutter、BERT、Firebase、MySQL 打造的情緒日記 App：BERT 六分類判讀情緒（precision 85–93%），轉譯成顏色、音樂與氣味的多感官回饋。",
  },
};

export interface ProjectSeo {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** Absolute URL — SVG covers (mybot) fall back to the site's default OG image. */
  ogImage: string;
  /** Absolute canonical URL for this project's dedicated page. */
  canonical: string;
}

function absoluteOgImage(image?: string): string {
  if (!image || image.endsWith(".svg")) return DEFAULT_OG_IMAGE;
  return `${SITE_URL}${image}`;
}

export const projectsSeo: ProjectSeo[] = projects.map((project) => {
  const copy = PROJECT_SEO_COPY[project.id];
  return {
    slug: project.id,
    title: project.title,
    seoTitle: copy?.seoTitle ?? `${project.title}｜${SITE_NAME}`,
    seoDescription: copy?.seoDescription ?? project.overview ?? project.description,
    ogImage: absoluteOgImage(project.image),
    canonical: `${SITE_URL}/projects/${project.id}`,
  };
});

export function getProjectSeo(slug: string): ProjectSeo | undefined {
  return projectsSeo.find((entry) => entry.slug === slug);
}
