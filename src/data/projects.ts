import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "all-things-scored",
    category: "INTERACTIVE / CREATIVE CODING",
    title: "All Things Scored",
    description:
      "把影片中穿越觸發線的動作即時轉成音樂。Canvas 逐像素差分偵測動態，Tone.js 合成音階與效果鏈——位置決定音高、強度決定力度，節拍量化讓隨機動作變成旋律。",
    image: "/projects/all-things-scored.webp",
    tech: ["React", "TypeScript", "Tone.js", "Canvas"],
    links: {
      github: "https://github.com/zn6302/All-Things-Scored",
    },
  },
  {
    id: "openhci-2026",
    category: "SHIPPED / FRONTEND",
    title: "OpenHCI 2026 官方網站",
    description:
      "依 Figma 從零開發、已上線的高互動活動官網。故障字元解碼動畫、像素風 loader、JSON 資料驅動內容；GitHub 多人協作走 PR 流程。",
    image: "/projects/openhci-2026.webp",
    tech: ["Next.js 15", "React 19", "Tailwind v4", "Framer Motion"],
    links: {
      live: "https://2026.openhci.com",
      github: "https://github.com/OpenHCI-tw/2026-official-site",
    },
  },
  {
    id: "click-or-check",
    category: "INTERACTIVE / GAME",
    title: "Click or Check?",
    description:
      "媒體識讀互動遊戲。把「流量 vs 公信力」的媒體倫理變成玩家必須權衡的雙軸數值系統——聳動標題換粉絲、犧牲信任。",
    image: "/projects/click-or-check.webp",
    tech: ["React 19", "Vite", "Tailwind"],
    links: {
      github: "https://github.com/JiaXiang114462003/media-literacy-game",
    },
  },
  {
    id: "mybot",
    category: "AI AGENT / FULLSTACK",
    title: "myBot 體態管理 LINE Bot",
    description:
      "拍食物照 → Gemini Vision 辨識熱量與營養素 → 依當日剩餘額度主動建議下一餐。規則路由先擋、LLM 只管語意理解，後端一人完成。",
    image: "",
    tech: ["TypeScript", "Vercel Serverless", "Gemini", "Supabase"],
    links: {},
  },
  {
    id: "smiley",
    category: "CAPSTONE / PRODUCT",
    title: "SMILEY 情緒日記",
    description:
      "畢業專題、擔任組長。情緒分析日記 App：BERT 六分類情緒模型（85–93%）+ TaiwanLLM 聊天回饋 + 芳療推薦，從痛點到商業模式端到端。",
    image: "/projects/smiley.webp",
    tech: ["Flutter", "BERT", "Firebase", "MySQL"],
    links: {},
  },
];
