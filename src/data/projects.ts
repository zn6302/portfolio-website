import type { Locale, Project } from "../types";
import { projectCopyEn } from "./projects.en";

// zh is the base entry for every project; the English site swaps in the text
// fields from projects.en.ts and keeps everything else.
const projectsZh: Project[] = [
  {
    id: "all-things-scored",
    category: "INTERACTIVE / CREATIVE CODING",
    title: "All Things Scored",
    description:
      "動作是看不見的旋律。世界上所有會動的東西都在演奏，只是我們聽不見。我畫了一條線，讓任何穿過它的動作都被翻譯成音符。",
    image: "/projects/all-things-scored.webp",
    video: "/projects/all-things-scored.mp4",
    tech: ["React", "TypeScript", "Tone.js", "Canvas"],
    subtitle: "用動作演奏的網頁樂器",
    outcome: "獨立開發 · 穩定 60fps · 可線上試玩",
    role: "獨立開發",
    overview:
      "我把它拆成三塊：電腦視覺抓出穿過線的動作，Web Audio 把它變成聲音，音階映射決定發哪個音，全部在瀏覽器裡即時跑。試玩版放在 GitHub Pages，程式碼也公開。",
    highlights: [
      "只看一條線：自適應背景模型用 EMA 雙學習率（觸發 0.01／未觸發 0.06），只掃觸發線所在的那條 scanline 並抽樣，穩定 60fps",
      "不會走音：位置決定音高、強度決定力度；音高只取音階上的音，不用連續頻率",
      "動作再密也不爆音：音符經 Tone.js PolySynth 和效果鏈發出，可選擇用 Transport 量化到 @8n/@16n；20 個區段各有 cooldown，做 voice throttling",
      "動畫迴圈讀 ref：高頻 rAF 迴圈用 ref 同步 state，避開 stale closure",
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
      "設計團隊用像素和故障風表現主題，我主導的互動動畫也照這個風格做。文字從亂碼解碼進場，像素風 loader 等字體載完才收起來。",
    image: "/projects/openhci-2026.webp",
    video: "/projects/openhci-2026.mp4",
    tech: ["Next.js 15", "React 19", "Tailwind v4", "Framer Motion"],
    subtitle: "以「(AI)dentity」為主題的活動官網",
    outcome: "已上線 · 2026.openhci.com · 多人 PR 協作",
    role: "前端工程師：UI 元件、設計系統維護、主導互動動畫",
    overview:
      "「(AI)dentity」談的是身分在 AI 時代怎麼故障、被解碼、再重組。網站是我們照設計團隊的 Figma 稿從零寫的，在 GitHub Organization 用 PR 協作。",
    highlights: [
      "亂碼字做成元件：把 use-scramble 包成 ScrollScramble／LoopingShockScramble 設計系統元件，進場時由 IntersectionObserver 觸發，播一次就 unobserve",
      "Loader 雙重門檻：像素風 GlobalLoader 至少顯示 2.5s，並等 document.fonts.ready 才關閉，避免 FOUT",
      "純靜態部署：Next.js 15 SSG（output: export）輸出靜態檔，放在 GitHub Pages，DNS 走 Cloudflare",
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
      "你是新聞編輯。查證要花時間，聳動標題能換流量，公信力則會流失；每則新聞都要你在按「分享」前決定查不查。",
    image: "/projects/click-or-check.webp",
    video: "/projects/click-or-check.mp4",
    tech: ["React 19", "Vite", "Tailwind"],
    subtitle: "在流量與公信力之間取捨的新聞遊戲",
    outcome: "媒體識讀遊戲 · 可線上試玩 · 程式碼公開",
    role: "團隊專案",
    overview:
      "每則新聞依標題多聳動、內容是真是假計分，頂部的雙軸數值條即時更新。遊戲用 React 19 和 Vite 寫，部署在 Vercel。",
    highlights: [
      "計時器全部收乾淨：查證流程是時間軸狀態機（verifying → result → fading → removed），所有 timer 都由同一個 cardTimersRef 清理，元件卸載後不再 setState，也沒有 memory leak",
      "二維矩陣計分：一軸是標題多聳動，另一軸是新聞真假",
      "只用 CSS 畫：頂部的雙軸數值條是用公式算出的 CSS linear-gradient，即時更新",
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
      "在 LINE 傳一張餐點照片，Gemini 估出熱量和營養素，myBot 再依你今天剩下的熱量額度建議下一餐。",
    // Backend-only project — the "UI" is LINE itself, so the cover is a flow
    // diagram with a real conversation screenshot rather than an app shot.
    image: "/projects/mybot_flow_mockup.svg",
    imageAlt: "myBot 流程圖：拍照上傳、Bot 追問細節、使用者回覆、Bot 回傳估出的熱量和營養素，旁邊附 LINE 對話截圖",
    imageFit: "contain",
    tech: ["TypeScript", "Vercel Serverless", "Gemini", "Supabase"],
    subtitle: "拍照就能記飲食的 AI 教練",
    outcome: "LINE Bot · 八層意圖路由 · 後端獨立開發",
    role: "後端獨立開發",
    overview:
      "記飲食最麻煩的是打開 App、搜尋食物、填表格；用 myBot，先拍照就好。後端我把 LLM 放在最後一關，壓住成本和延遲，也讓回覆比較可預期：明確指令先用規則擋，每日熱量需求用公式算，LLM 只處理照片和需要理解語意的訊息。",
    highlights: [
      "規則優先：八層意圖路由先用便宜的 regex／關鍵字擋下明確指令，擋不掉的才送進 Gemini",
      "追問補份量：拍照辨識分兩段。Bot 先把 pending_context 存進 TTL 暫存，再追問份量，把兩則獨立的 LINE webhook 串起來，讓 Gemini 估的份量更準",
      "依週期調整回覆：月經週期按比例分成四個階段，再把目前階段注入「教練」「渴望」「重訓」三個 LLM 的 system prompt",
      "TDEE 用公式算：套 Mifflin-St Jeor 方程式，不讓 LLM 估，同樣的輸入每次都得到同樣的數字",
    ],
    links: {},
  },
  {
    id: "smiley",
    category: "CAPSTONE / PRODUCT",
    title: "SMILEY 情緒日記",
    description:
      "療癒，從感受情緒開始。SMILEY 把日記裡說不出口的情緒，翻譯成顏色、音樂與氣味，讓察覺自然而然的發生。",
    image: "/projects/smiley-cover.webp",
    imageAlt: "SMILEY 主頁的插畫小房間：角色坐在日記本旁，周圍的手機畫面是盆栽、精油和音樂推薦",
    detailImage: "/projects/smiley.webp",
    tech: ["Flutter", "BERT", "Firebase", "MySQL"],
    subtitle: "用 BERT 辨識情緒的日記 App",
    outcome: "畢業專題 · 組長 · precision/recall 85–93%",
    role: "組長：統籌整體架構，從 UI Flow 到商業模式",
    overview:
      "SMILEY 是我們的畢業專題，我當組長、統籌架構。我們注意到很多人連對自己都說不出心裡的感受，所以使用者只要寫日記，判斷情緒就交給 BERT。這是我第一次從痛點、模型、UI Flow 一路做到商業模式。",
    highlights: [
      "用 BERT 分六種情緒：NTCIR-14 約 170 萬組語料，固定切分跑三次，precision/recall 85–93%",
      "聊天回饋在本地跑：用 Ollama 部署 TaiwanLLM，並用我們自己訂的四面向 rubric 量化評估回覆品質",
      "兩個資料庫分工：Firebase 負責驗證，MySQL 存 App 的資料；前端用 Flutter，分成五個模組",
      "每種情緒各有一組推薦：依 BERT 辨識出的情緒，挑出帶花語的盆栽、音樂和精油",
    ],
    links: {},
  },
];

export const projects: Record<Locale, Project[]> = {
  zh: projectsZh,
  en: projectsZh.map((project) => ({ ...project, ...projectCopyEn[project.id] })),
};
