import type { Locale } from "../types";

// UI copy that lives in components rather than in a content list (projects /
// sketches / services carry their own per-locale text). Strings that read the
// same in both languages — nav labels, LIVE SITE ↗, OPEN TO 2026 INTERNSHIP —
// stay inline in the components.
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
}

export const ui: Record<Locale, UiCopy> = {
  zh: {
    h1: "葉子倪 YE Zi-Ni — HCI × Creative Coding 作品集",
    heroName: "葉子倪",
    heroTagline: "我用程式，將世界表現出來。",
    aboutLabel: "關於我",
    aboutLead:
      "我相信前端工程師是翻譯者：在設計與程式之間、在人與機器之間。我做的每一件作品，都是一次翻譯練習——把動作翻譯成音樂、把情緒翻譯成氣味、把設計稿裡的故事翻譯成會動的程式碼。",
    aboutIntro: [
      "我是葉子倪，政大數位內容，喜歡 HCI 與互動藝術，",
      "目標是成為「能把設計、互動、工程和使用者體驗整合起來的前端工程師」。",
    ],
    statLaunched: "個已上線官網",
    aboutImageAlt: "葉子倪坐在書桌前工作的插畫，擷取自首頁動畫畫格",
    skillsLabel: "技能棧",
    skillsHeading: "SKILLS / 技能棧",
    skillsLead: "前端工程、互動動畫、後端資料到 AI 應用，這是我實際用來做出上線作品的技術棧。",
    skillsRow: (category, items) => `${category}：${items.join("、")}`,
    contactLabel: "聯絡方式",
    contactLead: "想看更多或聊聊互動專案，歡迎透過以下方式找我。",
    sketchesLabel: "Playground：Creative Coding 互動作品",
    sketchesLead: "翻譯的練習簿——把演算法與隨機性，翻譯成可以觀看、可以玩的東西。",
    viewDetails: "查看詳情 ↗",
    viewDetailsLabel: (title) => `查看 ${title} 詳情`,
    detailsLabel: "巧思 DETAILS",
    otherProjects: "其他作品",
    backToTop: "回到頂部",
    portraitAlt: "葉子倪的個人半身照",
    avatarAlt: "葉子倪的個人照",
    switchLanguage: "Switch to English",
  },
  en: {
    h1: "YE Zi-Ni — HCI × Creative Coding Portfolio",
    heroName: "YE Zi-Ni",
    heroTagline: "I write code to render the world.",
    aboutLabel: "About me",
    aboutLead:
      "I believe frontend engineers are translators — between design and code, between people and machines. Every piece I build is a translation exercise: motion into music, emotion into scent, the story inside a design file into code that moves.",
    aboutIntro: [
      "I'm YE Zi-Ni, studying Digital Content at National Chengchi University (NCCU), with a love for HCI and interactive art.",
      "My goal: to become a frontend engineer who brings design, interaction, engineering and user experience together.",
    ],
    statLaunched: "Official site shipped",
    aboutImageAlt: "Illustration of YE Zi-Ni working at a desk, a frame from the homepage animation",
    skillsLabel: "Skills",
    skillsHeading: "SKILLS / STACK",
    skillsLead:
      "From frontend engineering and interactive animation to backend data and applied AI — the stack I actually use to ship live work.",
    skillsRow: (category, items) => `${category}: ${items.join(", ")}`,
    contactLabel: "Contact",
    contactLead: "Want to see more, or talk about an interactive project? Here's where to find me.",
    sketchesLabel: "Playground: creative coding experiments",
    sketchesLead:
      "A translation sketchbook — turning algorithms and randomness into things you can watch and play with.",
    viewDetails: "View details ↗",
    viewDetailsLabel: (title) => `View ${title} details`,
    detailsLabel: "DETAILS",
    otherProjects: "More projects",
    backToTop: "Back to top",
    portraitAlt: "Portrait of YE Zi-Ni",
    avatarAlt: "Photo of YE Zi-Ni",
    switchLanguage: "切換為中文",
  },
};
