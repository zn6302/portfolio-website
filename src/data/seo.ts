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
    "YE Zi-Ni's HCI × creative coding portfolio: interactive pieces in React, TypeScript and p5.js, and the live OpenHCI 2026 site, where she led the animation.",
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
      seoTitle: "All Things Scored — 用動作演奏的網頁樂器｜葉子倪 YE Zi-Ni",
      seoDescription:
        "用 React、TypeScript、Tone.js 和 Canvas 寫的網頁樂器：畫面上有一條線，電腦視覺偵測穿過它的動作，網頁即時發出落在音階上的音符。獨立開發，穩定 60fps。",
    },
    "openhci-2026": {
      seoTitle: "OpenHCI 2026 官方網站 — (AI)dentity｜葉子倪 YE Zi-Ni",
      seoDescription:
        "OpenHCI 2026 官方網站，團隊用 Next.js 15、React 19、Tailwind v4、Framer Motion 開發，已上線於 2026.openhci.com。她寫 UI 元件、主導互動動畫。",
    },
    "click-or-check": {
      seoTitle: "Click or Check? — 媒體識讀新聞遊戲｜葉子倪 YE Zi-Ni",
      seoDescription:
        "用 React 19、Vite、Tailwind 寫的媒體識讀遊戲：你是新聞編輯，每則新聞都得決定要不要查證，在流量和公信力之間取捨。",
    },
    mybot: {
      seoTitle: "myBot 體態管理 LINE Bot — 拍照記飲食｜葉子倪 YE Zi-Ni",
      seoDescription:
        "用 TypeScript、Vercel Serverless、Gemini、Supabase 寫的 LINE Bot：拍照記飲食，八層意圖路由先用規則分流，每日熱量用 Mifflin-St Jeor 公式算，後端獨立開發。",
    },
    smiley: {
      seoTitle: "SMILEY 情緒日記 — 用 BERT 辨識情緒的 App｜葉子倪 YE Zi-Ni",
      seoDescription:
        "用 Flutter、BERT、Firebase、MySQL 開發的情緒日記 App（畢業專題）：BERT 六分類辨識主要情緒（precision/recall 85–93%），再推薦顏色、音樂與精油。",
    },
  },
  // 英文同樣以顯示寬度計（英文字母一律計 1），所以就是一般的 60 / 155 字元上限。
  en: {
    "all-things-scored": {
      seoTitle: "All Things Scored — Turning Motion into Music | YE Zi-Ni",
      seoDescription:
        "A solo creative-coding piece in React, TypeScript, Tone.js and Canvas: anything that crosses a line on a video plays an in-key note, at a steady 60fps.",
    },
    "openhci-2026": {
      seoTitle: "OpenHCI 2026 Official Website — (AI)dentity | YE Zi-Ni",
      seoDescription:
        "Live at 2026.openhci.com: a team site in Next.js 15, React 19, Tailwind v4 and Framer Motion. She wrote UI components and led the interactive animation.",
    },
    "click-or-check": {
      seoTitle: "Click or Check? — A Media-Literacy News Game | YE Zi-Ni",
      seoDescription:
        "A media-literacy game in React 19, Vite and Tailwind: as a news editor, you decide whether to check each story, trading traffic against credibility.",
    },
    mybot: {
      seoTitle: "myBot, a LINE Fitness Coach — Log Meals by Photo | YE Zi-Ni",
      seoDescription:
        "A LINE bot in TypeScript, Vercel Serverless, Gemini and Supabase: photo meal logging, 8-layer intent routing, Mifflin-St Jeor calorie math. Solo backend.",
    },
    smiley: {
      seoTitle: "SMILEY Emotion Journal — Emotions Read by BERT | YE Zi-Ni",
      seoDescription:
        "A capstone journal app in Flutter, BERT, Firebase and MySQL: six-class emotion detection (85–93% precision/recall); it replies in color, music and scent.",
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
