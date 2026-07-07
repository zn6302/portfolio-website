# CLAUDE.md — zini-portfolio

葉子倪的個人作品集網站。目標：2026/7/15 前上線，用於實習申請。
讀者是實習審查者（停留 1–3 分鐘），優先序：真實作品 > 技術能力 > 個人風格。

> 本檔案於 2026/7/6 整合 `design-system.md`(v1.0)與 `website-color-guide.md` 之間的衝突。
> 三份文件的關係：**本文件是唯一的最終規範**；`website-color-guide.md` 是色彩的延伸說明文件（tag、按鈕、可及性細節可查）；`design-system.md` 的色票／字體／圓角／卡片邊框規範**已停用**，但其排版尺度、間距、動效 variant 程式碼仍可參考（已在下方對應章節整合）。

## ⛔ 最高原則（違反任何一條都算失敗）

1. **迭代現有架構，永遠不要重建專案**。不要建議換框架、換打包工具、重寫元件結構。
2. **禁止引入新顏色**。只能使用本文件第「色彩 token」章節的 token（即 `src/index.css` 的 `@theme`）。`design-system.md` 的舊色票（mist/slate/jade/coral-red/peach/blush/sand/mocha/periwinkle）不可再使用。需要深淺變化用 opacity 或 Tailwind 的 `color-mix`，不准加新 hex。
3. **每次 UI 修改後必須檢查五個尺寸**：1440 / 1120 / 768 / 390 / 320（1120 與 320 是歷史破版帶，詳見 `RWD指南.md`）。可用 `node scripts/rwd-scan.mjs` 自動掃水平溢出，或以截圖驗證。
4. 動畫語言上限四種：Hero 打字動畫、紙張漂浮、區塊進場、卡片 hover。區塊進場中，非捲動觸發（掛載時）用 Framer Motion，捲動觸發用 GSAP ScrollTrigger——兩者是同一種「進場」語言的兩種觸發方式，不算第五種；但**兩者不可用在同一元素上**。不要加真正的第五種動畫語言。
5. 所有動畫必須尊重 `prefers-reduced-motion`（現有 pattern 見 `Reveal.tsx` 與 `useLenis.ts`）。
6. 網站定位是「HCI × creative coding 學生作品集」。禁止加入接案顧問式區塊（Services、Process、Testimonials、FAQ、假 Blog）。
7. 沒完成的內容直接不放，禁止「coming soon」死連結。

## 技術棧

- React 19 + Vite + TypeScript
- Tailwind CSS v4（`@theme` token 在 `src/index.css`，無 config 檔）
- Framer Motion：元件掛載/進場動畫、hover
- GSAP + ScrollTrigger：滾動驅動動畫（滾動類統一用 GSAP，不要和 Framer Motion 混用在同一元素）
- Lenis：平滑滾動（`src/hooks/useLenis.ts`）
- React Three Fiber：hero 背景層，**lazy load**（`Scene.tsx` 獨立 chunk，不准改回同步 import）

## 架構

```
src/
├── data/projects.ts      # 唯一內容來源：作品、技能、NOW、EMAIL。改文案只改這裡
├── hooks/useLenis.ts
└── components/
    ├── Scene.tsx          # R3F 粒子背景。★ v2 接口：未來換 glTF 角色場景，只動這個檔
    ├── Nav.tsx            # 膠囊導覽 + OPEN TO INTERNSHIP 徽章
    ├── Hero.tsx           # 大字標題 + 雙人像卡（img onError 自動 fallback 佔位）
    ├── Projects.tsx       # 精選作品，左右交錯大卡
    ├── Sketches.tsx       # creative coding 深色輪播（framer-motion drag）
    ├── AboutContact.tsx   # About / NOW / 技能 / Contact / Footer
    └── Reveal.tsx         # 統一進場動畫元件
```

## 色彩 token（鎖定，唯一來源，取代 design-system.md 舊色票）

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
| `warm` | `#EBC8B6` | 溫暖背景、個人化區塊（如 NOW）。原 design-system.md 的 peach/blush/sand 三色統一併入此 token |

**使用比例**：70%（paper/cream）+ 20%（matcha 系）+ 7%（sky/warm）+ 3%（clay，全站不超過 5%）。

## 字體系統

| 角色 | 字體 |
|---|---|
| 標題 | **Noto Sans TC**，weight 900（display / h1）；h2–h4 依層級遞減字重，可依實際排版微調 |
| 內文 | **Noto Sans TC** |
| 英文小標/程式片段 | **IBM Plex Mono**，大寫、寬字距 |

字級階層（取自 design-system.md 的尺度，字體已改為上述兩款；1.25 ratio，基準 16px）：

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

## 間距（取自 design-system.md，無衝突，直接沿用）

8px 基準：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

- 元件內 padding：16–24
- 卡片間距：24–32
- 區塊（section）間距：96–128（桌機）、64（手機）

## 圓角與邊框（已依 CLAUDE 鎖定尺度修正，取代 design-system.md 的 16/24px 大圓角）

| Token | 值 | 用途 |
|---|---|---|
| `radius-sm` | 8px | tag、input |
| `radius-md` | 12px | 按鈕、卡片 |
| `radius-full` | 9999px | pill 按鈕、nav、標籤（既有結構，不受配色調整影響） |

- **不使用超過 12px 的大圓角**，也不使用任何 0 圓角矩形。
- 卡片/主要容器統一搭配 **2px ink 邊框 + 柔和陰影**，這是目前站上「帶一點手繪感」的核心質感語言，取代 design-system.md 舊版「純陰影無邊框」的扁平卡片做法。`line(#DDE4EA)` 只用於次要分隔線，不是卡片主邊框。

## 陰影（已依新 ink 值重新校正，取代 design-system.md 舊版本）

```css
--shadow-soft: 0 16px 40px rgba(45, 33, 33, 0.08);      /* 一般卡片 */
--shadow-soft-lg: 0 24px 56px rgba(45, 33, 33, 0.14);   /* hover / 強調層級 */
```

## 動態系統（Framer Motion + GSAP ScrollTrigger + Lenis）

動態靈感來自主視覺的飄浮紙張：輕、慢、有空氣感。禁止彈跳過度的 spring 或快速閃現。

```ts
export const motionTokens = {
  duration: {
    fast: 0.2,     // hover、按鈕回饋
    base: 0.4,     // 元素進場（Framer Motion）
    slow: 0.7,     // 區塊 reveal
    drift: 8,      // 紙張飄浮循環
  },
  ease: {
    out: [0.16, 1, 0.3, 1],
    inOut: [0.65, 0, 0.35, 1],
    gentle: [0.25, 0.1, 0.25, 1],
  },
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export const paperDrift = {
  animate: {
    y: [0, -14, 0],
    rotate: [-2, 3, -2],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
  },
};
```

- **捲動觸發的區塊進場一律用 GSAP ScrollTrigger**；掛載時的進場/hover 用 Framer Motion 上述 variants。兩者不可疊在同一元素上。
- Lenis：`new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) })`
- 已知例外：目前上線版本的 count-up 統計數字採 duration 1s、spring bounce 0，這是「卡片 hover / 區塊進場」語言下的參數變體，不算新增動畫類型。

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
| 陰影輕（`shadow-soft`）+ 2px `ink` 邊框作為主要質感語言 | 厚重 drop shadow，或無邊框的純扁平卡片（design-system.md 舊做法，已停用） |
| 圓角 8–12px + 膠囊（nav/按鈕/標籤既有結構） | 超過 12px 的大圓角、任何 0 圓角矩形 |
| 動態慢而有空氣感（0.4–0.7s），捲動用 GSAP、進場/hover 用 Framer Motion | 快速彈跳、過度 spring、GSAP 與 Framer Motion 疊加在同一元素 |
| hero 背景可疊極淡 radial glow | UI 元件（卡片/按鈕）使用漸層 |

## 素材路徑約定

```
public/assets/hero-typing-girl-v01.webm   # Hero 動畫（≤3MB）
public/assets/hero-typing-girl-v01.mp4    # 備援
public/assets/hero-poster.png             # 影片 poster；手機 <768px 只顯示這張，不載影片
public/images/portrait-photo.jpg          # 真人照片
public/images/portrait-illust.png         # 插畫人像
public/images/project-*.png               # 作品截圖 → 更新 projects.ts 的 image 欄位
```

Hero 影片規則：`autoplay muted loop playsinline` + `preload="metadata"`，手機以 CSS/JS 判斷不載入影片來源。

## 效能底線

- 主 bundle（不含 Scene chunk）gzip ≤ 150KB
- three.js 相關必須留在 lazy chunk
- 圖片上線前壓縮（截圖轉 webp，單張 ≤ 300KB）
- Lighthouse Performance 手機 ≥ 80 才算過

## QA 檢查清單（每次交付前跑）

1. `npm run build` 成功
2. 1440 / 1120 / 768 / 390 / 320 五尺寸無破版、無水平溢出（`node scripts/rwd-scan.mjs` 全綠，或逐尺寸截圖；規則見 `RWD指南.md`）
3. Hero 動畫/圖片不壓到標題文字
4. 佔位卡數量回報（目標：0）
5. `prefers-reduced-motion` 開啟時頁面仍完整可用
6. title / meta description / OG 標籤完整

## 目前狀態與待辦（隨進度更新此節）

- [x] v1 架構完成，build 通過，三尺寸 QA 通過
- [x] SEO/OG + favicon（favicon.svg 已建，og:url 待部署後補）
- [x] 2026/7/6：整合三份設計文件的衝突，色彩/字體/圓角/邊框/動效以本文件為準
- [ ] Hero 打字動畫影片接入（等素材：hero-typing-girl-v01.webm；打字文字動畫已上線）
- [ ] 人像 ×2、作品截圖替換（等素材；目前 onError fallback 佔位中）
- [ ] 作品文案換成真實作品（projects.ts 內 4 件為佔位內容，placeholder 欄位標記中）
- [ ] GSAP ScrollTrigger 精修（等使用者提供 3 個參考效果連結）
- [ ] Vercel 部署

## v2 路線（7/15 後，現在不做）

`Scene.tsx` 換成 glTF 角色場景（Ready Player Me → Mixamo Typing → Blender 匯出 → `useGLTF` + `useAnimations`）+ ScrollTrigger 鏡頭運鏡。架構已預留，不需要動其他檔案。