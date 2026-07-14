# zini-portfolio — 葉子倪個人作品集

葉子倪的個人作品集網站，用於 2026 實習申請。單頁、無後端，聚焦真實作品：HCI 研究、互動
原型、creative coding、前端實作。設計與工程規範以 [CLAUDE.md](CLAUDE.md) 為唯一最終依據。

## 技術棧

| 面向     | 選用                                                          |
| -------- | ------------------------------------------------------------ |
| 建置工具 | [Vite](https://vitejs.dev/) 6                                |
| UI       | React 19 + React DOM                                         |
| 語言     | TypeScript 5.6（strict 模式）                                |
| 樣式     | 手寫全域 CSS（`src/styles.css`，2000+ 行，`:root` 即 token 來源）＋ Tailwind v4 少量 utility |
| 動畫     | [GSAP](https://gsap.com/) + ScrollTrigger（唯一捲動驅動方案）；hover 用純 CSS transition |
| 圖示     | [lucide-react](https://lucide.dev/)                          |
| 字體     | Noto Sans TC + IBM Plex Mono（CSS 載入）                     |
| 圖片     | 本地資產（`public/hero/*`、`public/projects/*.webp`），路徑集中於 `src/data/assets.ts` |

沒有路由、沒有後端、沒有狀態管理函式庫；沒有 Framer Motion / Lenis / React Three Fiber
（皆為舊規劃，實作改為純 CSS + GSAP）。

## 快速開始

本專案以 **pnpm** 管理（`pnpm-lock.yaml`）；`pnpm run <script>` 或 `npm run <script>` 皆可
執行 scripts，但安裝相依請用 pnpm。

```bash
pnpm install

# 開發伺服器
pnpm dev

# 型別檢查 + 產出正式版本 → dist/
pnpm build

# 本地預覽正式版本
pnpm preview
```

## 分支與部署

本專案採用固定發布流程：

```text
dev  開發中、尚未正式發布
  ↓ Pull Request
main 已確認、可部署的正式版本
  ↓ Cloudflare Workers
https://znye6302.com
```

日常修改請推到 `dev`，確認後透過 Pull Request 合併到 `main`；不要直接把未確認的功能推到
`main`。

Cloudflare Workers Builds 應使用以下設定：

| 設定 | 值 |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm build` |
| Deploy command | `pnpm deploy` |
| Non-production branch builds | Enabled |
| Non-production branch deploy command | `pnpm deploy:preview` |

`pnpm deploy` 只允許 `main` 部署 `production` environment，並更新 `znye6302.com`；
`pnpm deploy:preview` 只上傳 preview version，不會推進正式流量。`wrangler.jsonc` 的預設 Worker
名稱為 `portfolio-website-preview`，正式 Worker `portfolio-website` 只能透過
`--env production` 明確部署，避免 `dev` 誤覆蓋正式網站。

## 品質護欄

```bash
pnpm typecheck   # tsc -b，型別檢查
pnpm build       # 型別檢查 + 打包，主 bundle gzip ≤ 150KB
pnpm test:rwd    # RWD 水平溢出掃描（先跑 build + preview，見下）
```

RWD 掃描用 `puppeteer-core`（本地可選工具，走系統 Chrome、不下載瀏覽器）。首次使用前先安裝到本機，再啟動 preview：

```bash
pnpm add -D puppeteer-core   # 本地 QA 需要；Cloudflare build 不需要
pnpm build && pnpm preview   # 另開終端
pnpm test:rwd                # 預設掃 24 個寬度；node scripts/rwd-scan.mjs 390,768 只掃指定寬度
```

五個關鍵尺寸 1440 / 1120 / 768 / 390 / 320 需全部無水平溢出（規則見 `docs/RWD指南.md`）。

## 專案結構

```
.
├── index.html                 # HTML 外殼 + title/meta/OG 標籤
├── CLAUDE.md                  # 設計系統與工程規範（最終依據）
├── docs/                      # 延伸文件（RWD 指南、色彩指南、design-system 舊稿）
├── scripts/rwd-scan.mjs       # RWD 水平溢出掃描器
└── src/
    ├── main.tsx               # React 進入點
    ├── App.tsx                # 組合各頁面區塊
    ├── styles.css             # 全域樣式、CSS 變數、響應式規則
    ├── data/                  # 唯一內容來源（projects / services / navigation / assets）
    ├── types/                 # 共用 TypeScript 介面
    ├── hooks/                 # useScrollFlip / useCountUp / useScrolled / useAnchorScroll / useHeroVideoSources …
    └── components/
        ├── ui/                # AvailabilityPill / HiBubble / Socials …
        └── sections/          # Header / HeroCardJourney / Services / About / Projects / Contact / Footer …
```

## 值得留意的部分

- **`HeroCardJourney`**——同一張卡從 hero 全螢幕影片一路 flip 進 Services / About 卡槽的頂層
  捲動編排。斷點（1080px）與 `prefers-reduced-motion` 由 `gsap.matchMedia()` 管理，跨斷點會
  完整 teardown / rebuild。
- **`Projects` + `ProjectOverlay`**——精選作品清單卡，「查看詳情」按鈕開全螢幕詳情覆蓋層
  （FLIP 展開動畫、focus trap、背景 inert、ESC / 背景點擊關閉）。
- **`SkillsGraph`**——手排的技能星座圖（measure-and-relax 版面），同樣以 `gsap.matchMedia()`
  管理斷點；手機退回純標籤格。
- 所有捲動動畫皆尊重 `prefers-reduced-motion`：關閉動效時降級為靜態、完整可用的版面。

## 內容維護

改文案只改 `src/data/`。新增作品在 `src/data/projects.ts` 補一筆，截圖轉 webp（單張
≤ 300KB）放 `public/projects/` 並填 `image` 欄位；後端型、無截圖的作品可省略 `image`，會自動
渲染純標題卡而非破圖。
