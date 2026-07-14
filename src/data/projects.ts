import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "all-things-scored",
    category: "INTERACTIVE / CREATIVE CODING",
    title: "All Things Scored",
    description:
      "動作是看不見的旋律。世界上所有會動的東西都在演奏，只是我們聽不見——我畫了一條線，讓任何穿過它的動作都被翻譯成音符。",
    image: "/projects/all-things-scored.webp",
    video: "/projects/all-things-scored.mp4",
    tech: ["React", "TypeScript", "Tone.js", "Canvas"],
    subtitle: "motion becomes music — 動作是看不見的旋律",
    outcome: "即時影像 → 音樂 · 穩定 60fps · 獨立開發",
    role: "獨立開發",
    overview:
      "世界上所有會動的東西都在演奏，只是我們聽不見——這件作品畫一條線，把穿過它的動作翻譯成旋律。Computer Vision（背景差分）、Web Audio DSP（Tone.js 效果鏈與節拍量化）與樂理（音階映射），三個領域在同一條線上演奏。",
    highlights: [
      "自適應背景模型：EMA 雙學習率（觸發 0.01／未觸發 0.06），只掃觸發線上一條 scanline＋抽樣，穩定 60fps",
      "位置決定音高、強度決定力度，映射對齊音階而非連續頻率——怎麼動都不走音",
      "Tone.js PolySynth 效果鏈＋Transport 節拍量化（@8n/@16n），分 20 區段 cooldown 做 voice throttling 防爆音",
      "高頻 rAF 迴圈用 ref 同步 state，避開 stale closure——React 動畫迴圈的正確寫法",
    ],
    links: {
      live: "https://zn6302.github.io/All-Things-Scored",
      github: "https://github.com/zn6302/All-Things-Scored",
    },
  },
  {
    id: "openhci-2026",
    category: "SHIPPED / FRONTEND",
    title: "OpenHCI 2026 官方網站",
    description:
      "設計說了一個故障與像素的故事，程式就用動畫把它說完。這不只是設計稿的重現，而是讓每一次解碼與進場都延續「(AI)dentity」的世界觀。",
    image: "/projects/openhci-2026.webp",
    video: "/projects/openhci-2026.mp4",
    tech: ["Next.js 15", "React 19", "Tailwind v4", "Framer Motion"],
    subtitle: "(AI)dentity — 設計跟程式講同一個故事",
    outcome: "已上線 · 2026.openhci.com · 多人 PR 協作",
    role: "前端工程：UI 元件開發、設計系統維護、主導互動動畫",
    overview:
      "設計團隊用故障與像素講「(AI)dentity」的故事，我的工作是讓程式碼把這個故事說完。依 Figma 從零開發、GitHub Organization 多人 PR 協作，已上線於 2026.openhci.com——好的活動官網不是設計稿的影印機。",
    highlights: [
      "把 use-scramble 二次封裝成 ScrollScramble／LoopingShockScramble 設計系統元件，IntersectionObserver 進場才觸發、once 播完即 unobserve",
      "像素風 GlobalLoader 雙條件 gating：最短展示 2.5s＋document.fonts.ready，避免 FOUT 也保住儀式感",
      "Next.js 15 SSG（output: export）→ GitHub Pages＋Cloudflare DNS，零伺服器維運",
    ],
    links: {
      live: "https://2026.openhci.com",
    },
  },
  {
    id: "click-or-check",
    category: "INTERACTIVE / GAME",
    title: "Click or Check?",
    description:
      "媒體倫理很抽象，直到你必須親手按下「分享」。每一則新聞都是流量與公信力的拉扯，親手做過的選擇，比被告知正確答案更難忘。",
    image: "/projects/click-or-check.webp",
    video: "/projects/click-or-check.mp4",
    tech: ["React 19", "Vite", "Tailwind"],
    subtitle: "流量 vs 公信力 — 可玩的媒體倫理",
    outcome: "雙軸數值系統 · 零圖表庫資料視覺化",
    role: "獨立開發",
    overview:
      "「查證再分享」人人會說，但沒人感覺過它有多難——這個遊戲把媒體倫理翻譯成你必須親手權衡的選擇。玩家坐上新聞編輯的位子：查證要花時間、聳動標題換流量、信任會流失，而計分表本身就是教學設計。",
    highlights: [
      "查證流程是完整的時間軸狀態機（verifying→結果→fading→移除），用 cardTimersRef 統一清理所有 timer，杜絕卸載後 setState 與 memory leak",
      "計分表＝教學設計：標題聳動度 × 新聞真假的二維矩陣，數值設計即媒體倫理",
      "頂部雙軸 bar 用純數學算 CSS linear-gradient 做即時資料視覺化，零圖表庫",
    ],
    links: {
      live: "https://media-literacy-game-jade.vercel.app/",
      github: "https://github.com/JiaXiang114462003/media-literacy-game",
    },
  },
  {
    id: "mybot",
    category: "AI AGENT / FULLSTACK",
    title: "myBot 體態管理 LINE Bot",
    description:
      "把「維持健康」這件難事，翻譯成拍一張照的小事。體態管理缺的往往不是知識，而是一個簡單到能夠每天持續的入口。",
    // Backend-only project — the "UI" is LINE itself, so the cover is a flow
    // diagram with a real conversation screenshot rather than an app shot.
    image: "/projects/mybot_flow_mockup.svg",
    imageFit: "contain",
    tech: ["TypeScript", "Vercel Serverless", "Gemini", "Supabase"],
    subtitle: "隨傳隨到的 AI 體態教練 — 把難事變成小事",
    outcome: "LINE Bot · 八層意圖路由 · 後端一人完成",
    role: "獨立開發（後端一人完成）",
    overview:
      "體態管理失敗從來不是缺知識，是記錄太麻煩——所以我把它翻譯成一個最小動作：拍張照。溫柔的體驗，底下是冷靜的工程取捨：明確指令用規則擋、熱量用科學公式算，只把語意理解留給 LLM。AI 產品的關鍵不是到處用 AI，而是知道哪裡不該用。",
    highlights: [
      "八層意圖路由：便宜的正則/關鍵字先擋明確指令，擋不掉才進 Gemini——成本、延遲與可預測性的取捨",
      "兩段式拍照辨識＋TTL 暫存：先存 pending_context 反問補充，把 LINE 兩則獨立 webhook 關聯起來，解決多模態估份量不準",
      "月經週期 context injection：按比例算出四階段，注入教練/渴望/重訓三個 LLM 的 system prompt",
      "TDEE 用 Mifflin-St Jeor 公式而非叫 LLM 猜——可信、可解釋、零幻覺",
    ],
    links: {},
  },
  {
    id: "smiley",
    category: "CAPSTONE / PRODUCT",
    title: "SMILEY 情緒日記",
    description:
      "療癒，從感受情緒開始。SMILEY 把日記裡說不出口的情緒，翻譯成顏色、音樂與氣味，讓察覺在不被逼迫的時候自然發生。",
    image: "/projects/2.jpg",
    detailImage: "/projects/smiley.jpg",
    tech: ["Flutter", "BERT", "Firebase", "MySQL"],
    subtitle: "療癒，從感受情緒開始",
    outcome: "畢業專題組長 · BERT 六分類 85–93%",
    role: "組長：統籌架構、UI Flow 到商業模式",
    overview:
      "很多人不是沒有情緒，是說不出口——SMILEY 把日記裡的情緒翻譯成顏色、音樂與氣味，讓察覺自然發生。BERT 判讀主情緒後，App 用另一種語言回應你。這是我第一次從痛點、模型、UI Flow 一路做到商業模式。",
    highlights: [
      "BERT 六分類情緒模型：NTCIR-14 約 170 萬組語料、固定切分跑三次，precision/recall 85–93%",
      "TaiwanLLM＋Ollama 本地部署聊天回饋，並自建四面向量化評估 rubric 把關 LLM 品質",
      "Flutter 前端五大模組＋Firebase 驗證/MySQL 業務資料雙庫整合",
      "「多感官療癒」落地：盆栽花語、音樂、精油推薦，概念與互動一致",
    ],
    links: {},
  },
];
