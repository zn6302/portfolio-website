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
    subtitle: "motion becomes music — 把動作變成樂器",
    role: "獨立開發",
    overview:
      "把 Computer Vision（背景差分）、Web Audio DSP（Tone.js 效果鏈與節拍量化）、音樂理論（音階映射）接在一起的即時「動作樂器」——影片中的物體穿越觸發線，就變成不會走音的旋律。",
    highlights: [
      "自適應背景模型：EMA 雙學習率（觸發 0.01／未觸發 0.06），只掃觸發線上一條 scanline＋抽樣，穩定 60fps",
      "位置決定音高、強度決定力度，映射對齊音階而非連續頻率——怎麼動都不走音",
      "Tone.js PolySynth 效果鏈＋Transport 節拍量化（@8n/@16n），分 20 區段 cooldown 做 voice throttling 防爆音",
      "高頻 rAF 迴圈用 ref 同步 state，避開 stale closure——React 動畫迴圈的正確寫法",
    ],
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
    subtitle: "(AI)dentity — 已上線的高互動活動官網",
    role: "前端工程：UI 元件開發、設計系統維護、主導互動動畫",
    overview:
      "OpenHCI 2026 工作坊官方網站，依 Figma 從零開發、GitHub Organization 多人 PR 協作，已上線於 2026.openhci.com。年度主題「(AI)dentity」＝故障、解碼、像素——設計跟程式講同一個故事。",
    highlights: [
      "把 use-scramble 二次封裝成 ScrollScramble／LoopingShockScramble 設計系統元件，IntersectionObserver 進場才觸發、once 播完即 unobserve",
      "像素風 GlobalLoader 雙條件 gating：最短展示 2.5s＋document.fonts.ready，避免 FOUT 也保住儀式感",
      "講師/FAQ/贊助全抽成 JSON 資料驅動——每年換屆的志工組織，非工程幹部也能直接改內容",
      "Next.js 15 SSG（output: export）→ GitHub Pages＋Cloudflare DNS，零伺服器維運",
    ],
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
    subtitle: "流量 vs 公信力——可玩的媒體倫理",
    role: "獨立開發",
    overview:
      "媒體識讀互動遊戲。玩家經營新聞平台，在「查證加信任」與「聳動標題換粉絲」之間權衡——把抽象的媒體倫理變成親手操作的雙軸數值系統。",
    highlights: [
      "查證流程是完整的時間軸狀態機（verifying→結果→fading→移除），用 cardTimersRef 統一清理所有 timer，杜絕卸載後 setState 與 memory leak",
      "計分表＝教學設計：標題聳動度 × 新聞真假的二維矩陣，數值設計即媒體倫理",
      "頂部雙軸 bar 用純數學算 CSS linear-gradient 做即時資料視覺化，零圖表庫",
      "題庫集中資料驅動，老師可獨立擴充",
    ],
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
    // Backend-only project — no shipped UI screenshot; renders a title block.
    tech: ["TypeScript", "Vercel Serverless", "Gemini", "Supabase"],
    subtitle: "隨傳隨到的科學實證體態管理師",
    role: "獨立開發（後端一人完成）",
    overview:
      "LINE 體態管理 Bot：拍食物照或打字即可估算熱量與營養素、追蹤每日進度。核心設計哲學——該用規則就用規則、該用公式就用公式、只在語意理解上用 LLM。",
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
      "畢業專題、擔任組長。情緒分析日記 App：BERT 六分類情緒模型（85–93%）+ TaiwanLLM 聊天回饋 + 芳療推薦，從痛點到商業模式端到端。",
    image: "/projects/smiley.webp",
    tech: ["Flutter", "BERT", "Firebase", "MySQL"],
    subtitle: "療癒，從感受情緒開始",
    role: "組長：統籌架構、UI Flow 到商業模式",
    overview:
      "畢業專題。情緒分析日記 App：寫日記 → BERT 判讀主情緒 → 數據化分析、聊天機器人回饋、精油／音樂推薦 → 社群分享。從痛點到商業模式端到端。",
    highlights: [
      "BERT 六分類情緒模型：NTCIR-14 約 170 萬組語料、固定切分跑三次，precision/recall 85–93%",
      "TaiwanLLM＋Ollama 本地部署聊天回饋，並自建四面向量化評估 rubric 把關 LLM 品質",
      "Flutter 前端五大模組＋Firebase 驗證/MySQL 業務資料雙庫整合",
      "「多感官療癒」落地：盆栽花語、音樂、精油推薦，概念與互動一致",
    ],
    links: {},
  },
];
