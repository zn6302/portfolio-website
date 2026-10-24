import type { FreelanceCase, Locale, Service } from "../types";

// 唯一內容來源：接案（自動化）區塊。`offers` 是能接的案子類型，`cases` 是真的交付過的案子。
const offersZh: Service[] = [
  { title: "文件與表單自動化", items: ["PDF 表單", "批次轉 Excel", "報表彙整"] },
  { title: "AI 文件辨識", items: ["OCR", "視覺語言模型", "信心分數＋人工複核"] },
  { title: "內部小工具", items: ["Flask 填表網站", "管理後台", "桌面工具"] },
  { title: "Bot 與 API 串接", items: ["LINE Bot", "LLM API", "Serverless"] },
];

const offersEn: Service[] = [
  { title: "Document & form automation", items: ["PDF forms", "Batch to Excel", "Report merging"] },
  { title: "AI document reading", items: ["OCR", "Vision-language models", "Confidence + human review"] },
  { title: "Internal tools", items: ["Flask form sites", "Admin pages", "Desktop apps"] },
  { title: "Bots & API integration", items: ["LINE Bot", "LLM APIs", "Serverless"] },
];

const casesZh: FreelanceCase[] = [
  {
    slug: "nccu-alumni",
    meta: "付費接案 · 2026/06–",
    title: "政大傑出校友遴選系統",
    client: "國立政治大學 秘書處",
    description:
      "把傑出校友從推薦、填表到彙整遴選總表的流程自動化。需求訪談、報價、範圍界定、交付和三輪需求變更都由我負責。",
    points: [
      "PDF 推薦表單改版，加上 Flask 線上填寫網站與管理設定頁",
      "桌面工具：批次把 PDF 表單轉成遴選總表 Excel",
      "紙本掃描件的個資遮蔽",
      "777 個自動化測試；每輪變更先更新規格與決策紀錄，再改程式",
    ],
    tech: ["Python", "Flask", "PyMuPDF", "openpyxl", "pytest"],
  },
  {
    slug: "ranktool",
    meta: "助教工作 · 2026/10",
    title: "ranktool 成績單排名擷取",
    client: "政大數位內容碩士學位學程 甄試書審",
    description:
      "書審原本要人工逐份翻成績單找排名。ranktool 從掃描成績單擷取累計班排名與系排名，自動填進評分單。",
    points: [
      "三個 OCR 引擎加上視覺語言模型各自判讀，用信心分數分成「可直接採用／建議抽查／必須人工確認」",
      "在從沒看過的 115 學年 71 位考生上驗證，「可直接採用」66/66 格全對",
      "成績單有身分證字號，所以全部在本機執行、不上傳雲端；附拖曳式桌面介面",
    ],
    tech: ["Python", "OCR", "MLX", "PySide6", "openpyxl"],
  },
  {
    slug: "clinic-internship",
    meta: "新創實習 · 2026/07–09",
    title: "醫美診所系統：AI 客群分析與平板串接",
    client: "醫美診所軟體新創（前端／全端實習）",
    description:
      "診所想找出「半年沒回來、但以前常來」的客人做回訪，原本要懂資料查詢的人來下條件。我把它做成用白話就能圈出名單。",
    points: [
      "拉幾個選項就即時顯示符合人數，也能直接打一句話開出名單；AI 會追問，並附上真實數字讓人比較",
      "接手 iPad App 前端，從實機簽章除錯做到上架 App Store；把平板上的醫材盤點接回診所的 Odoo 系統",
      "自己寫了 cclog：每晚自動整理當天的開發紀錄，兩個半月累積 285 件工作項目，隨時能切區間出報告",
    ],
    tech: ["Odoo", "Python", "React", "TypeScript", "React Native", "Gemini", "GCP"],
  },
];

const caseCopyEn: Record<string, Pick<FreelanceCase, "meta" | "title" | "client" | "description" | "points">> = {
  "nccu-alumni": {
    meta: "PAID CLIENT WORK · 2026/06–",
    title: "NCCU Distinguished Alumni Selection System",
    client: "Secretariat, National Chengchi University",
    description:
      "Automates the distinguished-alumni process from nomination forms to the final selection sheet. I handled requirements interviews, quoting, scoping, delivery and three rounds of change requests.",
    points: [
      "Redesigned the PDF nomination forms and built a Flask site for filling them in, with an admin settings page",
      "A desktop tool that batch-converts the PDF forms into the selection sheet in Excel",
      "Redaction of personal data on scanned paper forms",
      "777 automated tests; each change round updates the spec and decision records before the code",
    ],
  },
  ranktool: {
    meta: "TEACHING ASSISTANT WORK · 2026/10",
    title: "ranktool: transcript rank extraction",
    client: "NCCU Digital Content master's program, admissions review",
    description:
      "Reviewers used to page through every scanned transcript to find the applicant's rank. ranktool reads the cumulative class and department rank and fills in the scoring sheet.",
    points: [
      "Three OCR engines and a vision-language model read each transcript, and a confidence score sorts every cell into accept, spot-check or review by hand",
      "Tested on 71 applicants from a year it had never seen: 66 of 66 \"accept\" cells were correct",
      "Transcripts carry national ID numbers, so everything runs locally with nothing uploaded; it ships with a drag-and-drop desktop app",
    ],
  },
  "clinic-internship": {
    meta: "STARTUP INTERNSHIP · 2026/07–09",
    title: "Aesthetic clinic system: AI customer segments and tablet sync",
    client: "Aesthetic-clinic software startup (frontend / full-stack intern)",
    description:
      "Clinics want to find customers who used to come often but haven't been back in six months. That used to take someone who could write data queries. I made it possible in plain language.",
    points: [
      "Pick a few options and see the matching count live, or type one sentence to get the list; the AI asks follow-up questions and shows real numbers to compare",
      "Took over the iPad app's frontend, from on-device signing and debugging through App Store release, and connected its stock counts back to the clinic's Odoo system",
      "Wrote cclog, which turns each day's development log into work entries every night: 285 entries over two and a half months, reportable for any date range",
    ],
  },
};

export const freelance: Record<Locale, { offers: Service[]; cases: FreelanceCase[] }> = {
  zh: { offers: offersZh, cases: casesZh },
  en: {
    offers: offersEn,
    cases: casesZh.map((item) => ({ ...item, ...caseCopyEn[item.slug] })),
  },
};
