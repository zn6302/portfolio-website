import type { Locale } from "../types";

// UI copy that lives in components rather than in a content list (projects /
// sketches / services carry their own per-locale text). Display labels that
// read the same in both languages — section h2 words (SKILLS / ABOUT / …), the
// mono overlay labels (ROLE / STACK / LINKS / HIGHLIGHTS / ← PREV / NEXT →),
// LIVE SITE ↗ / GITHUB ↗ / OPEN ↗, nav labels, 中 / EN, "Hi" — stay inline in
// the components. Everything else a visitor reads or hears (incl. alt text and
// aria-labels) lives here, so wording can change without touching components.
export interface UiCopy {
  /** The page's one <h1> (App.tsx, visually hidden). */
  h1: string;
  heroName: string;
  heroTagline: string;
  aboutLabel: string;
  aboutLead: string;
  /** Rendered as separate lines joined by <br />. */
  aboutIntro: string[];
  statLaunched: string;
  aboutImageAlt: string;
  skillsLabel: string;
  skillsHeading: string;
  skillsLead: string;
  /** Formats one sr-only skills row: "前端工程：React、Vite" / "Frontend: React, Vite". */
  skillsRow: (category: string, items: string[]) => string;
  contactLabel: string;
  contactLead: string;
  sketchesLabel: string;
  sketchesLead: string;
  viewDetails: string;
  viewDetailsLabel: (title: string) => string;
  /** Overlay section label for per-detail demo clips. */
  detailsLabel: string;
  otherProjects: string;
  backToTop: string;
  portraitAlt: string;
  avatarAlt: string;
  /** Accessible name of the language toggle — written in the target language. */
  switchLanguage: string;

  // Hero intro overlay (HeroIntro.tsx).
  heroIntroName: string;
  /** Hero display role; each "\n" renders as a line break. */
  heroRole: string;
  heroConcept: string;
  scrollHint: string;

  /** Availability pill text (AvailabilityPill.tsx). */
  availability: string;

  // Call-to-action labels.
  ctaSeeWork: string;
  ctaContact: string;
  ctaEmail: string;
  ctaGithub: string;

  // Contact / about / footer labels.
  githubLabel: string;
  emailLabel: string;
  statProjects: string;
  statSketches: string;
  footerCredit: string;

  // Accessibility names.
  skipToWork: string;
  navPrimaryLabel: string;
  menuLabel: string;
  mobileNavLabel: string;
  socialLinksLabel: string;
  closeProject: string;
  /** Fallback alt text for a project's cover image (a project's own
   *  `imageAlt` wins when the generic wording would mislead). */
  coverAlt: (title: string) => string;
  /** Accessible name for a project's demo video. */
  demoLabel: (title: string) => string;

  // Copy-email control.
  copyEmail: string;
  emailCopied: string;
}

export const ui: Record<Locale, UiCopy> = {
  zh: {
    h1: "葉子倪 YE Zi-Ni — HCI × Creative Coding 作品集",
    heroName: "葉子倪",
    // The \u00a0 keeps "OpenHCI 2026" on one line.
    heroTagline: "我在政大讀數位內容學程，主導過 OpenHCI\u00a02026 官網的互動動畫。",
    aboutLabel: "關於我",
    aboutLead:
      "我寫前端，也做 creative coding。在 OpenHCI 2026 官網，我寫 UI 元件、維護設計系統，並主導互動動畫；自己做過拍照記熱量的 LINE Bot 和用動作演奏的網頁樂器。",
    aboutIntro: [
      "我喜歡 HCI 和互動藝術。",
      "我想找的前端工作，是設計和動畫也能自己動手做的那種。",
    ],
    statLaunched: "個已上線的活動官網",
    aboutImageAlt: "葉子倪在書桌前打鍵盤的插畫，身邊飄著紙張，桌上有盆栽和一杯咖啡",
    skillsLabel: "技術棧",
    skillsHeading: "SKILLS / 技術棧",
    skillsLead: "我用過的技術，依用途分類。",
    skillsRow: (category, items) => `${category}：${items.join("、")}`,
    contactLabel: "聯絡方式",
    contactLead: "我在找前端或 creative coding 實習。寄信找我最快，公開的程式碼在 GitHub。",
    sketchesLabel: "Playground：p5.js 小品",
    sketchesLead: "這些是沒有 deadline、寫來保持手感的小品，點一下會在新分頁開啟，可以直接玩。",
    viewDetails: "看作品細節 →",
    // 「」 around the title keeps the spacing right whether a title ends in
    // Latin ("Click or Check?") or CJK ("SMILEY 情緒日記").
    viewDetailsLabel: (title) => `看「${title}」的作品細節`,
    detailsLabel: "DETAILS",
    otherProjects: "其他作品",
    backToTop: "回到頂端",
    portraitAlt: "葉子倪的半身照",
    avatarAlt: "葉子倪的個人照",
    switchLanguage: "Switch to English",
    heroIntroName: "葉子倪 YE ZI-NI",
    heroRole: "FRONTEND /\nCREATIVE CODER",
    heroConcept: "把看不見的，翻譯成感覺得到的。",
    scrollHint: "往下滑",
    availability: "找實習中",
    ctaSeeWork: "VIEW WORK",
    ctaContact: "CONTACT",
    ctaEmail: "EMAIL ME",
    ctaGithub: "GITHUB",
    githubLabel: "GitHub",
    emailLabel: "Email",
    statProjects: "件作品",
    statSketches: "件 p5.js 小品",
    footerCredit: "© 2026 葉子倪 · 用 React、TypeScript 和 GSAP 寫成",
    skipToWork: "跳到作品",
    navPrimaryLabel: "主要導覽",
    menuLabel: "選單",
    // Screen readers add the "navigation" role after the label.
    mobileNavLabel: "手機版",
    socialLinksLabel: "社群連結",
    closeProject: "關閉作品詳情",
    coverAlt: (title) => `「${title}」作品畫面`,
    demoLabel: (title) => `「${title}」示範影片`,
    copyEmail: "複製",
    emailCopied: "已複製",
  },
  en: {
    h1: "YE Zi-Ni — HCI × Creative Coding Portfolio",
    heroName: "YE Zi-Ni",
    heroTagline: "I study Digital Content at National Chengchi University and led the interactive animation for the OpenHCI\u00a02026 website.",
    aboutLabel: "About me",
    aboutLead:
      "I write frontend code and make creative-coding pieces. On the OpenHCI 2026 website I wrote UI components, maintained the design system and led the interactive animation. On my own, I've made a LINE bot that logs meals from a photo and a browser instrument played by motion in a video.",
    aboutIntro: [
      "I like HCI and interactive art.",
      "I want frontend work where I shape the design and the motion as well as the code.",
    ],
    statLaunched: "live event site",
    aboutImageAlt:
      "Illustration of YE Zi-Ni typing at a desk, with papers floating around her, a potted plant and a cup of coffee",
    skillsLabel: "Skills",
    skillsHeading: "SKILLS / STACK",
    skillsLead: "Tools I've used, grouped by what they're for.",
    skillsRow: (category, items) => `${category}: ${items.join(", ")}`,
    contactLabel: "Contact",
    contactLead:
      "I'm looking for a frontend or creative-coding internship. Email is the fastest way to reach me; my public code is on GitHub.",
    sketchesLabel: "Playground: p5.js sketches",
    sketchesLead: "I make these small pieces for practice when nothing is due. Each one opens in a new tab, ready to play.",
    viewDetails: "View details →",
    viewDetailsLabel: (title) => `View details for ${title}`,
    detailsLabel: "DETAILS",
    otherProjects: "More projects",
    backToTop: "Back to top",
    portraitAlt: "Portrait of YE Zi-Ni",
    avatarAlt: "Photo of YE Zi-Ni",
    switchLanguage: "切換為中文",
    heroIntroName: "YE ZI-NI",
    heroRole: "FRONTEND /\nCREATIVE CODER",
    heroConcept: "I translate the invisible into experience.",
    scrollHint: "Scroll",
    availability: "OPEN TO INTERNSHIPS",
    ctaSeeWork: "VIEW WORK",
    ctaContact: "CONTACT",
    ctaEmail: "EMAIL ME",
    ctaGithub: "GITHUB",
    githubLabel: "GitHub",
    emailLabel: "Email",
    statProjects: "projects",
    statSketches: "p5.js sketches",
    footerCredit: "© 2026 YE Zi-Ni · Built with React, TypeScript and GSAP",
    skipToWork: "Skip to projects",
    navPrimaryLabel: "Primary",
    menuLabel: "Menu",
    mobileNavLabel: "Mobile",
    socialLinksLabel: "Social links",
    closeProject: "Close project details",
    coverAlt: (title) => `Screenshot of ${title}`,
    demoLabel: (title) => `${title} demo`,
    copyEmail: "Copy",
    emailCopied: "Copied",
  },
};
