# CLAUDE.md — zini-portfolio

葉子倪的個人作品集網站。目標：2026/7/15 前上線，用於實習申請。
讀者是實習審查者（停留 1–3 分鐘），優先序：真實作品 > 技術能力 > 個人風格。

> 本檔案於 2026/7/6 整合 `docs/design-system.md`(v1.0)與 `website-color-guide.md` 之間的衝突。
> 三份文件的關係：**本文件是唯一的最終規範**；`website-color-guide.md` 是色彩的延伸說明文件（tag、按鈕、可及性細節可查）；`docs/design-system.md` 的色票／字體／圓角／卡片邊框規範**已停用**，但其排版尺度、間距、動效 variant 程式碼仍可參考（已在下方對應章節整合）。

## ⛔ 最高原則（違反任何一條都算失敗）

1. **迭代現有架構，永遠不要重建專案**。不要建議換框架、換打包工具、重寫元件結構。
2. **禁止引入新顏色**。只能使用本文件第「色彩 token」章節的 token（即 `src/index.css` 的 `@theme`）。`docs/design-system.md` 的舊色票（mist/slate/jade/coral-red/peach/blush/sand/mocha/periwinkle）不可再使用。需要深淺變化用 opacity 或 Tailwind 的 `color-mix`，不准加新 hex。
3. **每次 UI 修改後必須檢查五個尺寸**：1440 / 1120 / 768 / 390 / 320（1120 與 320 是歷史破版帶，詳見 `docs/RWD指南.md`）。可用 `node scripts/rwd-scan.mjs` 自動掃水平溢出，或以截圖驗證。
4. 動畫語言上限四種：Hero 卡片翻轉旅程（HeroCardJourney）、區塊 GSAP ScrollTrigger 進場、卡片 hover、hero 影片。全站捲動驅動動畫統一用 GSAP ScrollTrigger（`useScrollFlip`），不要引入第二套動畫函式庫（過去規劃的 Framer Motion／Lenis／R3F 均未採用，見「技術棧」）。不要加真正的第五種動畫語言。
5. 所有動畫必須尊重 `prefers-reduced-motion`（現有 pattern 見 `useHeroVideoSources.ts`、`useAnchorScroll.ts`；ScrollTrigger 動畫需個別檢查 `window.matchMedia('(prefers-reduced-motion: reduce)')` 後降級或跳過）。
6. 網站定位是「HCI × creative coding 學生作品集」。禁止加入接案顧問式區塊（Process、Testimonials、FAQ、假 Blog）。注意：`src/components/sections/Services.tsx` 檔名沿用舊稱，實際內容是技能分類表（`src/data/services.ts`：前端工程/互動動畫/後端資料/AI 研究），不是接案服務項目，不違反本條。
7. 沒完成的內容直接不放，禁止「coming soon」死連結。

## 技術棧

- React 19 + Vite + TypeScript
- **純 CSS variables**：視覺基準線在 `src/styles.css`（手寫，2000+ 行，`:root` 即色彩/圓角/陰影 token 來源）
- Tailwind CSS v4：僅 incremental adoption，`src/index.css` 的 `@theme` 鏡射 `styles.css` 的色票供少量元件用 utility class 寫（目前僅 `AvailabilityPill.tsx`）；沒有載入 preflight，也沒有獨立的 tailwind config 檔，新元件預設仍手寫 CSS class 到 `styles.css`
- GSAP + ScrollTrigger：唯一的捲動驅動動畫方案（`useScrollFlip`、`useAnchorScroll` 用 ScrollToPlugin、Projects/ProjectOverlay/Footer/HeroCardJourney 內都直接用 ScrollTrigger）
- 沒有 Framer Motion、沒有 Lenis、沒有 React Three Fiber/Scene.tsx——這些是舊規劃，實作階段換成上述純 CSS + GSAP 方案，見下方架構樹

## 架構

```
src/
├── data/                        # 唯一內容來源，改文案只改這裡
│   ├── projects.ts              # 5 件作品的完整內容（title/highlights/links…）
│   ├── services.ts              # 技能分類（Services 區塊實際顯示為技能表，非接案服務）
│   ├── navigation.ts            # 導覽項目
│   └── assets.ts                # 圖片路徑集中管理
├── hooks/
│   ├── useScrollFlip.ts         # GSAP ScrollTrigger 包裝：捲動驅動的 from/to transform
│   ├── useCountUp.ts            # 數字滾動計數（cubic ease-out，非 GSAP）
│   ├── useScrolled.ts           # 監聽 scrollY 判斷導覽列是否加陰影
│   ├── useAnchorScroll.ts       # hash 連結點擊 → GSAP ScrollToPlugin（取代原生 scroll-behavior）
│   └── useHeroVideoSources.ts   # <768px 或 reduced-motion 時完全不設定影片 src，只留 poster
└── components/
    ├── sections/
    │   ├── Header.tsx           # 膠囊導覽 + OPEN TO 2026 INTERNSHIP 徽章
    │   ├── HeroCardJourney.tsx  # 頂層捲動編排：同一張卡從 hero 一路 flip 到 Services/About 卡槽
    │   │   ├── HeroTransition.tsx（內含 HeroIntro.tsx 打字標題 + HeroProfile.tsx 人像卡）
    │   │   ├── Services.tsx     # 技能表卡（disableCardFlip 模式，非接案服務項目）
    │   │   └── About.tsx        # About / NOW / Contact 前導卡
    │   ├── Projects.tsx         # 精選作品清單卡，點卡開 ProjectOverlay.tsx（全螢幕詳情覆蓋層）
    │   ├── Contact.tsx
    │   └── Footer.tsx
    └── ui/
        ├── AvailabilityPill.tsx # 唯一用 Tailwind utility 寫的元件
        ├── HiBubble.tsx
        └── Socials.tsx
```

沒有獨立的「Reveal.tsx」統一進場元件——各 section 的進場動畫直接寫在自己的 GSAP ScrollTrigger / CSS transition 裡（見下方動態系統）。

## 色彩 token（鎖定，唯一來源，取代 docs/design-system.md 舊色票）

| Token | Hex | 用途 |
|---|---|---|
| `paper` | `#EBEDF3` | 底色（霧白藍灰），全站主背景 |
| `paper-deep` | `#D8E7EA` | 次層底色/區塊交錯背景 |
| `cream` | `#F8FAFC` | 卡片面/紙感白，內容容器、表單底色 |
| `ink` | `#2D2121` | 主文字/深色區底（深咖黑），對比 13.28:1 on paper |
| `ink-soft` | `#5F686C` | 次要文字、caption |
| `ink-muted` | `#9D9FA0` | 淡化資訊（日期、註解）。**對比較弱，不可用於需通過 AA 的正文**，只做低優先級裝飾文字 |
| `matcha` | `#65959C` | 品牌主色/裝飾、淡色 icon。對比不足（3.17:1），**不可當小字文字色** |
| `matcha-deep` | `#3F6770` | 連結、重要標題強調、主要按鈕底色（5.93:1 on cream） |
| `matcha-hover` | `#2F525A` | matcha 按鈕 hover/active |
| `clay` | `#CF4342` | 強調色/CTA 底色（白字 4.63:1 可用）。**全站不超過 5%，每屏最多出現一次** |
| `clay-deep` | `#B93635` | clay 的文字/連結安全版。clay 本身不可直接當文字色 |
| `line` | `#DDE4EA` | 邊線、次要分隔線（非卡片主邊框，見下方質感規則） |
| `mint` | `#58C3B3` | 輕量 hover 背景、icon 背景 |
| `sky` | `#A7D0D1` | 柔和裝飾、插畫輔助色、tag 底色 |
| `warm` | `#EBC8B6` | 溫暖背景、個人化區塊（如 NOW）。原 docs/design-system.md 的 peach/blush/sand 三色統一併入此 token |

**使用比例**：70%（paper/cream）+ 20%（matcha 系）+ 7%（sky/warm）+ 3%（clay，全站不超過 5%）。

## 字體系統

| 角色 | 字體 |
|---|---|
| 標題 | **Noto Sans TC**，weight 900（display / h1）；h2–h4 依層級遞減字重，可依實際排版微調 |
| 內文 | **Noto Sans TC** |
| 英文小標/程式片段 | **IBM Plex Mono**，大寫、寬字距 |

字級階層（取自 docs/design-system.md 的尺度，字體已改為上述兩款；1.25 ratio，基準 16px）：

| Token | 大小 / 行高 | 字重 | 用途 |
|---|---|---|---|
| `display` | 61px / 1.1 | 900 | Hero 標題（手機降至 40px） |
| `h1` | 49px / 1.15 | 900 | 頁面標題 |
| `h2` | 39px / 1.2 | 700 | 區塊標題 |
| `h3` | 31px / 1.25 | 700 | 卡片標題 |
| `h4` | 25px / 1.3 | 600 | 小標 |
| `body-lg` | 20px / 1.6 | 400 | 導言 |
| `body` | 16px / 1.7 | 400 | 內文（中文行高取 1.7） |
| `caption` | 13px / 1.5 | 400 | 說明、日期 |
| `eyebrow` | 13px / 1.4 | 500（mono） | 區塊上方小標，letter-spacing 0.08em，全大寫 |

## 間距（取自 docs/design-system.md，無衝突，直接沿用）

8px 基準：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

- 元件內 padding：16–24
- 卡片間距：24–32
- 區塊（section）間距：96–128（桌機）、64（手機）

## 圓角與邊框（已依 CLAUDE 鎖定尺度修正，取代 docs/design-system.md 的 16/24px 大圓角）

| Token | 值 | 用途 |
|---|---|---|
| `radius-sm` | 8px | tag、input |
| `radius-md` | 12px | 按鈕、卡片 |
| `radius-full` | 9999px | pill 按鈕、nav、標籤（既有結構，不受配色調整影響） |

- **不使用超過 12px 的大圓角**，也不使用任何 0 圓角矩形。
- 卡片/主要容器統一搭配 **2px ink 邊框 + 柔和陰影**，這是目前站上「帶一點手繪感」的核心質感語言，取代 docs/design-system.md 舊版「純陰影無邊框」的扁平卡片做法。`line(#DDE4EA)` 只用於次要分隔線，不是卡片主邊框。

## 陰影（已依新 ink 值重新校正，取代 docs/design-system.md 舊版本）

```css
--shadow-soft: 0 16px 40px rgba(45, 33, 33, 0.08);      /* 一般卡片 */
--shadow-soft-lg: 0 24px 56px rgba(45, 33, 33, 0.14);   /* hover / 強調層級 */
```

## 動態系統（純 CSS transition/keyframes + GSAP ScrollTrigger）

動態靈感來自主視覺的飄浮紙張：輕、慢、有空氣感。禁止彈跳過度的 spring 或快速閃現。目前沒有集中的 motion tokens 檔（`motionTokens`/`fadeUp`/`stagger` 等 variant 常數尚未抽出），時長/easing 數值直接寫在各自的 GSAP tween 或 CSS `transition` 裡；未來若要抽共用常數，數值基準仍是：

- `fast`（0.2s）：hover、按鈕回饋（CSS transition）
- `base`（0.4s）：小型元素進場
- `slow`（0.7s）：區塊 reveal（GSAP ScrollTrigger tween）
- `ease.out` 慣用 `[0.16, 1, 0.3, 1]`（GSAP `power` 系或自訂 cubic-bezier）

- **捲動觸發的動畫一律用 GSAP ScrollTrigger**（`useScrollFlip`、Projects/ProjectOverlay/Footer/HeroCardJourney 內的 ScrollTrigger 用法）；卡片 hover 用純 CSS `:hover` transition。兩者不可疊在同一元素上。
- `useAnchorScroll`：GSAP `ScrollToPlugin` 取代原生 `scroll-behavior: smooth`（見 `src/styles.css` 開頭註解，避免雙重驅動捲動）。
- 已知例外：`useCountUp`（統計數字滾動）用手寫 `requestAnimationFrame` + cubic ease-out，不掛 GSAP 也不掛 Framer Motion——這是「卡片 hover / 區塊進場」語言下的參數變體，不算新增動畫類型。
- `feat/animations` 分支正在驗收 F1–F4 動效精修（MaskHeading 文字遮罩進場、useMagnetic 磁吸 hover、useHeroParallax 視差），尚未合併進 dev，驗收通過前不視為站上既有動畫語言。

## 元件規範（已依鎖定色票重新對應）

### 按鈕

| 類型 | 樣式 | 用途 |
|---|---|---|
| Primary | `clay` 底 + 白字，pill，hover 轉 `clay-deep` 並上移 2px | 每屏一個 CTA |
| Secondary | `matcha-deep` 底 + 白字，或 `cream` 底 + `matcha-deep` 字 + 1.5px `matcha` 邊框 | 次要動作 |
| Ghost | 透明底 + `matcha-deep` 字，hover 底色 `mint` | 導覽、低調動作 |

高度：48px（md）/ 40px（sm），左右 padding 24px；hover 一律 `duration.fast`。

### 卡片（作品集卡）

- 底色 `cream`，`radius-md`（12px），2px `ink` 邊框，`shadow-soft`
- hover：`shadow-soft-lg` + y 上移 4px
- 內距 24px；縮圖與內文區之間 16px
- 分類 tag：`sky` 底 + `matcha-deep` mono 小字，`radius-full`

### 導覽列

- `paper` 半透明（`backdrop-blur`），捲動後加 `shadow-soft`
- Logo 左、連結右；當前頁以 `clay` 圓點（6px）標示，不用底線

### 表單

- Input：`cream` 底、1.5px `line` 邊框、`radius-sm`，focus 時邊框轉 `matcha` 並外加 3px `sky` ring
- 錯誤訊息用 `clay-deep`，直接說明如何修正

### Hero 特例

- 背景可疊極淡 radial glow：`rgba(167, 208, 209, 0.28)`（唯一允許的漸層例外，僅限 hero 背景，UI 元件本身仍不用漸層）

## Do & Don't

| ✅ Do | ❌ Don't |
|---|---|
| `clay` 每屏只用一次，全站不超過 5% | 到處撒紅色 |
| 文字一律用 `-deep`/`-soft`/`-muted` 系或 `ink` | 用 `matcha`/`clay` 原色當內文 |
| 陰影輕（`shadow-soft`）+ 2px `ink` 邊框作為主要質感語言 | 厚重 drop shadow，或無邊框的純扁平卡片（docs/design-system.md 舊做法，已停用） |
| 圓角 8–12px + 膠囊（nav/按鈕/標籤既有結構） | 超過 12px 的大圓角、任何 0 圓角矩形 |
| 動態慢而有空氣感（0.4–0.7s），捲動用 GSAP ScrollTrigger、hover 用純 CSS transition | 快速彈跳、過度 spring、引入第二套動畫函式庫（Framer Motion/Lenis 等） |
| hero 背景可疊極淡 radial glow | UI 元件（卡片/按鈕）使用漸層 |

## 素材路徑約定

```
public/hero/hero-animation.mp4        # Hero 打字動畫（已上線）
public/hero/hero-animation.webm       # 備援格式
public/hero/avatar.jpg                # 導覽/徽章用的方形大頭照裁切
public/hero/services-portrait.jpg     # Services 卡人像（bust crop）
public/hero/about-keyframe.webp       # About/Skills 卡背面插圖（hero 影片截幀）
public/projects/*.webp                # 作品截圖 → 對應更新 src/data/projects.ts 的 image 欄位
```

圖片路徑集中在 `src/data/assets.ts`，不要在元件裡直接寫死路徑字串。`projects.ts` 目前 `mybot` 一件的 `image` 欄位為空字串——Projects.tsx 對應 fallback 顯示 `.project-loop-media-empty` 純標題卡而非破圖，這是刻意設計，不是待補的佔位。

Hero 影片規則：`<768px` 或 `prefers-reduced-motion: reduce` 時，`useHeroVideoSources` 完全不設定 `<video>` 的 `src`/`<source>`（不是只用 CSS 隱藏），只留 poster 畫面。

## 效能底線

- 主 bundle（JS）gzip ≤ 150KB（現況：`npm run build` 約 120KB gzip，dev 與 feat/animations 分支皆在底線內）
- 圖片上線前壓縮（截圖轉 webp，單張 ≤ 300KB；`public/projects/*.webp`、`public/hero/*.webp` 已依此處理）
- Lighthouse Performance 手機 ≥ 80 才算過（尚未實測，見待辦）

## QA 檢查清單（每次交付前跑）

1. `npm run build` 成功
2. 1440 / 1120 / 768 / 390 / 320 五尺寸無破版、無水平溢出（`node scripts/rwd-scan.mjs` 全綠，或逐尺寸截圖；規則見 `docs/RWD指南.md`）
3. Hero 動畫/圖片不壓到標題文字
4. 佔位卡數量回報（目標：0）
5. `prefers-reduced-motion` 開啟時頁面仍完整可用
6. title / meta description / OG 標籤完整

## 目前狀態與待辦（隨進度更新此節）

- [x] v1 架構完成，build 通過，五尺寸 QA 通過
- [x] Hero 打字動畫影片已接入（`public/hero/hero-animation.mp4`/`.webm` + poster，手機/reduced-motion 自動降級）
- [x] 5 件真實作品已上線（`src/data/projects.ts`：All Things Scored、OpenHCI 2026 官網、Click or Check?、myBot、SMILEY），無佔位卡
- [x] 人像/作品截圖已替換為真實素材（`public/hero/`、`public/projects/`）
- [x] title / meta description / og:title / og:description / og:type 齊全（`index.html`）
- [x] 2026/7/8：文件與實況校正——技術棧改為純 CSS + GSAP（無 Framer Motion/Lenis/R3F），架構樹改為實際檔案清單
- [ ] Vercel 部署
- [ ] og:image / og:url（部署後補正式網址）
- [ ] favicon：目前無 favicon 檔案、`index.html` 無 `<link rel="icon">`，瀏覽器預設請求 `/favicon.ico` 回 404（QA 已測得，不影響頁面內容，屬待補視覺資產）
- [ ] `feat/animations` 分支 F1–F4 動效精修驗收（MaskHeading、useMagnetic、useHeroParallax）後併回 dev
- [ ] Lighthouse Performance 手機分數實測（效能底線 ≥80，尚未實測記錄）

## v2 路線（7/15 後，現在不做）

現況沒有 Scene.tsx/R3F 背景層，架構也未預留 glTF 接口。若之後要做角色場景或更進階的 3D 視覺，屬於全新規劃，需要另外評估是否違反「迭代不重建」原則、以及對主 bundle 體積的影響，不在這次上線範圍內。