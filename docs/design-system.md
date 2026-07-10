# Zi-Ni Portfolio — Design System v1.0

> 依據主視覺插畫(打字中的女孩 × 飛舞紙張)建立的設計規範。
> 適用技術棧:React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + Lenis + R3F
> 最後更新:2026-07-05

---

## 1. 設計理念

主視覺傳達的核心氛圍:**在混亂中保持從容**。紙張漫天飛舞,但角色神情自在、嘴角帶笑——這正好呼應「創意編碼者」的敘事:用程式碼作畫筆,在複雜的技術中找到詩意。

三個關鍵字貫穿整個系統:

1. **柔和(Soft)** — 低飽和的粉彩色、大圓角、無銳利邊緣
2. **扁平(Flat)** — 純色塊、無漸層、無寫實陰影,陰影只用於功能性層級
3. **俏皮的秩序(Playful order)** — 飄浮的紙張元素帶來動態感,但排版本身乾淨克制

**設計原則:大膽只花在一個地方。** 每個頁面只有一個記憶點(如首頁的飄紙動畫),其餘元素保持安靜。

---

## 2. 色彩系統

所有顏色直接取樣自主視覺插畫。

### 2.1 核心色票

| Token | Hex | 取樣來源 | 角色 |
|---|---|---|---|
| `mist` | `#E9EDF4` | 背景 | 頁面主背景 |
| `paper` | `#FDFDFD` | 飛舞的紙張 | 卡片、表面、Modal |
| `periwinkle` | `#CDD8E8` | 藍色紙屑 | 分隔線、裝飾、hover 底色 |
| `slate` | `#728F9D` | 襯衫 | 品牌主色(大面積、按鈕底色) |
| `slate-deep` | `#52707E` | slate 加深 | 主色的文字安全版(4.5:1)|
| `jade` | `#48BBAA` | 盆栽葉子 | 輔助色(icon、標籤、插圖)|
| `jade-deep` | `#2E8577` | jade 加深 | 輔助色的文字/連結安全版 |
| `coral-red` | `#CF4140` | 花盆 | 強調色(CTA、重點標記)|
| `coral-deep` | `#B03432` | coral 加深 | 強調色的文字安全版 |
| `peach` | `#FFD9CA` | 膚色 | 溫暖點綴、highlight 底色 |
| `blush` | `#F8B8A8` | 腮紅 | 裝飾、hover 微光 |
| `sand` | `#DCC5B3` | 挑染髮色 | 次要裝飾、米色點綴 |
| `ink` | `#292025` | 頭髮 | 主要文字色(帶暖調的近黑)|
| `mocha` | `#604030` | 咖啡 | 深棕點綴(少用)|

### 2.2 語意化角色(Semantic tokens)

| 語意 Token | 對應 | 用途 |
|---|---|---|
| `bg-base` | mist | 頁面背景 |
| `bg-surface` | paper | 卡片、面板 |
| `bg-muted` | periwinkle | 次要區塊、tag 底色 |
| `text-primary` | ink | 標題與內文 |
| `text-secondary` | slate-deep | 說明文字、caption |
| `text-inverse` | paper | 深色底上的文字 |
| `brand` | slate | 品牌識別、按鈕 |
| `accent` | coral-red | CTA、僅限每個畫面一處 |
| `positive` | jade-deep | 成功、確認 |

### 2.3 使用比例(60-30-10 法則)

- **60%** — `mist` + `paper`(背景與表面)
- **30%** — `slate` 系 + `periwinkle`(結構與品牌)
- **10%** — `jade`、`coral-red`、`peach`(點綴,coral-red 每屏最多出現一次)

### 2.4 對比度備註(WCAG AA)

- `ink` on `mist`:13.5:1 ✅ 任意尺寸
- `slate-deep` on `mist`:4.5:1 ✅ 內文可用;`slate` 本身只有 2.9:1,**只能當底色或大型裝飾,不可當文字色**
- `jade` 只能當裝飾;文字請用 `jade-deep`(3.8:1,限 18px+ 粗體或搭配 paper 底)
- 白字 on `coral-red`:4.7:1 ✅ 按鈕可用
- 白字 on `slate`:3.4:1 ⚠️ 僅限大型文字按鈕(≥18px semibold)

---

## 3. 字體系統

### 3.1 字體家族

| 角色 | 字體 | 備援 | 理由 |
|---|---|---|---|
| Display(英文標題) | **Bricolage Grotesque** | system-ui | 有個性的圓潤 grotesque,呼應插畫的柔和感,但不甜膩 |
| 中文 & 內文 | **LINE Seed Sans TC** | Noto Sans TC | 圓角端點與扁平插畫風格一致,台灣使用者熟悉度高 |
| Mono(程式碼/標籤) | **JetBrains Mono** | monospace | 「code as paintbrush」的身分證明,用於 eyebrow 標籤與程式片段 |

### 3.2 字級階層(1.25 ratio,基準 16px)

| Token | 大小 / 行高 | 字重 | 用途 |
|---|---|---|---|
| `display` | 61px / 1.1 | 700 | Hero 標題(手機降至 40px)|
| `h1` | 49px / 1.15 | 700 | 頁面標題 |
| `h2` | 39px / 1.2 | 600 | 區塊標題 |
| `h3` | 31px / 1.25 | 600 | 卡片標題 |
| `h4` | 25px / 1.3 | 600 | 小標 |
| `body-lg` | 20px / 1.6 | 400 | 導言 |
| `body` | 16px / 1.7 | 400 | 內文(中文行高取 1.7)|
| `caption` | 13px / 1.5 | 400 | 說明、日期 |
| `eyebrow` | 13px / 1.4 | 500 (mono) | 區塊上方小標,letter-spacing 0.08em,全大寫 |

**規則:** 中英混排時,英文標題用 Bricolage,中文標題直接用 LINE Seed Bold;不要讓兩種 display 字體同屏打架。

---

## 4. 間距、圓角、陰影

### 4.1 間距(8px 基準)

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

- 元件內 padding:16–24
- 卡片間距:24–32
- 區塊(section)間距:96–128(桌機)、64(手機)

### 4.2 圓角

| Token | 值 | 用途 |
|---|---|---|
| `radius-sm` | 8px | tag、input |
| `radius-md` | 16px | 按鈕、小卡片 |
| `radius-lg` | 24px | 主要卡片 |
| `radius-full` | 9999px | pill 按鈕、頭像 |

插畫是無稜角的世界,**任何元素都不使用 0 圓角**。

### 4.3 陰影(功能性,非裝飾)

扁平風格下陰影要極輕,只表達「浮起」:

```css
--shadow-card: 0 2px 8px rgb(41 32 37 / 0.06);
--shadow-hover: 0 8px 24px rgb(41 32 37 / 0.10);
--shadow-modal: 0 16px 48px rgb(41 32 37 / 0.14);
```

---

## 5. 動態系統(Framer Motion + Lenis)

### 5.1 動態原則

動態的靈感來自主視覺的**飄浮紙張**:輕、慢、有空氣感。禁止彈跳過度的 spring 或快速閃現。

### 5.2 Duration & Easing tokens

```ts
export const motionTokens = {
  duration: {
    fast: 0.2,     // hover、按鈕回饋
    base: 0.4,     // 元素進場
    slow: 0.7,     // 區塊 reveal
    drift: 8,      // 紙張飄浮循環
  },
  ease: {
    out: [0.16, 1, 0.3, 1],      // 進場(easeOutExpo 系)
    inOut: [0.65, 0, 0.35, 1],   // 位移
    gentle: [0.25, 0.1, 0.25, 1] // 飄浮
  },
} as const;
```

### 5.3 常用 Variants

```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// 招牌動態:飄浮紙張(hero 專用)
export const paperDrift = {
  animate: {
    y: [0, -14, 0],
    rotate: [-2, 3, -2],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
  },
};
```

### 5.4 Lenis 設定

```ts
new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
```

### 5.5 無障礙

所有循環動畫必須尊重 `prefers-reduced-motion`:

```tsx
const shouldReduceMotion = useReducedMotion();
// reduced motion 時:飄浮紙張改為靜態、reveal 改為單純 fade
```

---

## 6. 元件規範

### 6.1 按鈕

| 類型 | 樣式 | 用途 |
|---|---|---|
| Primary | `coral-red` 底 + 白字,pill,hover 變 `coral-deep` 並上移 2px | 每屏一個 CTA |
| Secondary | `slate` 底 + 白字(≥18px semibold)或 `paper` 底 + `slate-deep` 字 + 1.5px slate 邊框 | 次要動作 |
| Ghost | 透明底 + `slate-deep` 字,hover 底色 `periwinkle` | 導覽、低調動作 |

- 高度:48px(md)/ 40px(sm),左右 padding 24px
- hover 一律 `duration.fast`,transform + 顏色同時變化

### 6.2 卡片(作品集卡)

- 底色 `paper`,`radius-lg`,`shadow-card`
- hover:`shadow-hover` + y 上移 4px(呼應紙張飄起)
- 內距 24px;縮圖與內文區之間 16px
- 卡片上的分類 tag:`periwinkle` 底 + `slate-deep` mono 小字,`radius-full`

### 6.3 導覽列

- `mist` 半透明(`backdrop-blur`),捲動後加 `shadow-card`
- Logo 左、連結右;當前頁以 `coral-red` 圓點(6px)標示,不用底線

### 6.4 表單

- Input:`paper` 底、1.5px `periwinkle` 邊框、`radius-sm`,focus 時邊框轉 `slate` 並外加 3px `periwinkle` ring
- 錯誤訊息用 `coral-deep`,直接說明如何修正

---

## 7. 插畫與圖形語言

- **風格:** 純色塊扁平插畫,細節用同色系深一階的細線(如紙張的橫線),不使用外框線、漸層、材質
- **人物:** 圓潤比例、簡化五官(點狀眼睛、單線嘴角)、腮紅點綴
- **招牌圖形元素:** 白色紙張 + `periwinkle` 小紙屑,可作為全站的裝飾母題(section 轉場、404 頁、loading 畫面)
- **R3F 使用時機:** 3D 元素也遵守同一色票與「低多邊形 + 純色材質」原則,光源用柔和的環境光,避免寫實反射

---

## 8. Tailwind CSS v4 `@theme` 設定

```css
/* app.css */
@import 'tailwindcss';

@theme {
  /* Colors */
  --color-mist: #e9edf4;
  --color-paper: #fdfdfd;
  --color-periwinkle: #cdd8e8;
  --color-slate: #728f9d;
  --color-slate-deep: #52707e;
  --color-jade: #48bbaa;
  --color-jade-deep: #2e8577;
  --color-coral: #cf4140;
  --color-coral-deep: #b03432;
  --color-peach: #ffd9ca;
  --color-blush: #f8b8a8;
  --color-sand: #dcc5b3;
  --color-ink: #292025;
  --color-mocha: #604030;

  /* Typography */
  --font-display: 'Bricolage Grotesque', system-ui, sans-serif;
  --font-sans: 'LINE Seed Sans TC', 'Noto Sans TC', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;

  /* Shadows */
  --shadow-card: 0 2px 8px rgb(41 32 37 / 0.06);
  --shadow-hover: 0 8px 24px rgb(41 32 37 / 0.1);
  --shadow-modal: 0 16px 48px rgb(41 32 37 / 0.14);

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-gentle: cubic-bezier(0.25, 0.1, 0.25, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

使用範例:`bg-mist text-ink`、`bg-coral hover:bg-coral-deep text-paper rounded-full`、`font-mono text-slate-deep tracking-wider uppercase`。

---

## 9. Do & Don't

| ✅ Do | ❌ Don't |
|---|---|
| coral-red 每屏只用一次 | 到處撒紅色 |
| 文字一律用 `-deep` 系或 `ink` | 用 `slate` / `jade` 原色當內文 |
| 陰影輕到幾乎看不見 | 厚重 drop shadow 或漸層陰影 |
| 動態慢而有空氣感(0.4–0.7s) | 快速彈跳、過度 spring |
| 圓角無所不在 | 任何 0 圓角的矩形 |
| 紙張母題貫穿全站 | 每頁換一套裝飾語言 |
