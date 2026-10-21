import type { Locale } from "../types";
import { localePath } from "./locale";
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
const SITE_NAME_EN = "YE Zi-Ni";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// 中文首頁的 title/description 不放在這裡，直接寫在 `index.html`：那份 head 在 dev
// server 與正式 build 都會原樣送出，而 prerender 只是把它當模板複製給作品頁。
// 若這裡再存一份首頁文案，就會出現兩個來源、且只有其中一份真的生效。
// 英文首頁（/en）沒有自己的 html 檔，是 prerender 以同一份模板產生的，所以它的
// 文案唯一來源就是下面的 HOME_SEO_EN。
export const HOME_SEO_EN = {
  title: "YE Zi-Ni | Creative Developer · HCI × Interactive Frontend",
  description:
    "YE Zi-Ni's HCI × creative coding portfolio: interactive web work in React, TypeScript, GSAP and p5.js, including the live OpenHCI 2026 website.",
};

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
const PROJECT_SEO_COPY: Record<Locale, Record<string, ProjectSeoCopy>> = {
  zh: {
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
  },
  // 英文同樣以顯示寬度計（英文字母一律計 1），所以就是一般的 60 / 155 字元上限。
  en: {
    "all-things-scored": {
      seoTitle: "All Things Scored — Turning Motion into Music | YE Zi-Ni",
      seoDescription:
        "An interactive piece built with React, TypeScript, Tone.js and Canvas: computer vision detects motion and turns it into music in real time at 60fps.",
    },
    "openhci-2026": {
      seoTitle: "OpenHCI 2026 Official Website — (AI)dentity | YE Zi-Ni",
      seoDescription:
        "The OpenHCI 2026 website, built with Next.js 15, React 19, Tailwind v4 and Framer Motion: glitch and pixel animation from Figma, live at 2026.openhci.com.",
    },
    "click-or-check": {
      seoTitle: "Click or Check? — Media Ethics You Can Play | YE Zi-Ni",
      seoDescription:
        "A media literacy game in React 19, Vite and Tailwind: weigh fact-checking against traffic, with two-axis scoring and live data viz using no chart library.",
    },
    mybot: {
      seoTitle: "myBot Fitness Coach LINE Bot | YE Zi-Ni",
      seoDescription:
        "A LINE Bot built with TypeScript, Vercel Serverless, Gemini and Supabase: photo food logging, 8-layer intent routing and TDEE-based calories, solo backend.",
    },
    smiley: {
      seoTitle: "SMILEY Emotion Journal — Healing Through Feeling | YE Zi-Ni",
      seoDescription:
        "An emotion journal app in Flutter, BERT, Firebase and MySQL: six-class BERT emotion detection (85–93% precision) turned into color, music and scent.",
    },
  },
};

export interface ProjectSeo {
  slug: string;
  locale: Locale;
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** Absolute URL — SVG covers (mybot) fall back to the site's default OG image. */
  ogImage: string;
  /** Absolute canonical URL for this project's dedicated page in this locale. */
  canonical: string;
}

function absoluteOgImage(image?: string): string {
  if (!image || image.endsWith(".svg")) return DEFAULT_OG_IMAGE;
  return `${SITE_URL}${image}`;
}

/** Absolute URL of a locale-neutral path in the given locale. */
export function absoluteUrl(path: string, locale: Locale): string {
  const localized = localePath(path, locale);
  return localized === "/" ? `${SITE_URL}/` : `${SITE_URL}${localized}`;
}

function buildProjectsSeo(locale: Locale): ProjectSeo[] {
  const siteName = locale === "zh" ? SITE_NAME : SITE_NAME_EN;
  const separator = locale === "zh" ? "｜" : " | ";
  return projects[locale].map((project) => {
    const copy = PROJECT_SEO_COPY[locale][project.id];
    return {
      slug: project.id,
      locale,
      title: project.title,
      seoTitle: copy?.seoTitle ?? `${project.title}${separator}${siteName}`,
      seoDescription: copy?.seoDescription ?? project.overview ?? project.description,
      ogImage: absoluteOgImage(project.image),
      canonical: absoluteUrl(`/projects/${project.id}`, locale),
    };
  });
}

export const projectsSeo: Record<Locale, ProjectSeo[]> = {
  zh: buildProjectsSeo("zh"),
  en: buildProjectsSeo("en"),
};

export function getProjectSeo(slug: string, locale: Locale): ProjectSeo | undefined {
  return projectsSeo[locale].find((entry) => entry.slug === slug);
}
