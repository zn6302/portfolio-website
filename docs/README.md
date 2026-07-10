# Portavia — Framer 作品集重製版

這是一個使用 **Vite + React 19 + TypeScript** 打造的單頁設計師作品集網站，手工重製自
[Portavia](https://www.framer.com/marketplace/templates/portavia/) Framer 範本
——一位虛構數位設計師「Duncan Robert」的個人作品集。

程式碼採用業界常見的功能分層架構：內容資料、型別、hooks、共用 UI 與頁面區塊各自獨立成
模組，[src/App.tsx](src/App.tsx) 只負責組合這些區塊。樣式則集中在單一的全域樣式表
[src/styles.css](src/styles.css)。沒有路由、沒有後端、也沒有狀態管理函式庫——只用了
React hooks 與 CSS。

## 技術棧

| 面向         | 選用                                                    |
| ------------ | ------------------------------------------------------- |
| 建置工具     | [Vite](https://vitejs.dev/) 6                           |
| UI           | React 19 + React DOM                                    |
| 語言         | TypeScript 5.6（strict 模式）                           |
| 圖示         | [lucide-react](https://lucide.dev/)                     |
| 捲動動畫     | [GSAP](https://gsap.com/) + ScrollTrigger（3D 翻卡效果） |
| 字體         | Google Fonts（`Inter` + `Antonio`），透過 CSS 載入      |
| 圖片         | 遠端託管於 `framerusercontent.com`                      |
| 套件管理器   | pnpm（見 `pnpm-lock.yaml` / `pnpm-workspace.yaml`）     |

## 快速開始

```bash
# 安裝相依套件（建議使用 pnpm）
pnpm install

# 啟動開發伺服器（http://127.0.0.1:5173）
pnpm dev

# 型別檢查 + 產出正式版本 → dist/
pnpm build

# 在本地預覽正式版本
pnpm preview
```

> npm / yarn 也可以使用，但本專案附帶 `pnpm-lock.yaml`，用 pnpm 安裝可獲得最一致、可重現
> 的結果。

## 專案結構

```
.
├── index.html                 # HTML 外殼，掛載 #root、載入 /src/main.tsx
├── vite.config.ts             # Vite 設定（React plugin）
├── tsconfig.json              # 應用程式 TS 設定（strict）
├── tsconfig.node.json         # Vite / node 工具鏈的 TS 設定
├── package.json               # scripts 與相依套件
└── src/
    ├── main.tsx               # React 進入點——createRoot + <StrictMode>
    ├── App.tsx                # 只負責組合各頁面區塊
    ├── styles.css             # 所有全域樣式、CSS 變數、響應式規則
    ├── lucide-react.d.ts      # 圖示函式庫的本地型別補充
    ├── types/                 # 共用 TypeScript 介面
    │   └── index.ts
    ├── data/                  # 內容資料（與 markup 分離）
    │   ├── assets.ts          #   遠端圖片網址
    │   ├── navigation.ts      #   導覽連結
    │   ├── services.ts
    │   ├── projects.ts
    │   ├── testimonials.ts
    │   ├── faqs.ts
    │   ├── insights.ts
    │   └── index.ts           #   barrel 匯出
    ├── hooks/                 # 可重用的自訂 hooks
    │   ├── useScrolled.ts
    │   ├── useCountUp.ts
    │   └── index.ts
    └── components/
        ├── ui/                # 小型、跨區塊共用的呈現用元件
        │   ├── AvailabilityPill.tsx
        │   ├── HiBubble.tsx
        │   ├── Socials.tsx
        │   ├── StarRow.tsx
        │   └── index.ts
        └── sections/          # 每個頁面區塊各一個檔案
            ├── Header.tsx
            ├── Hero.tsx
            ├── Services.tsx
            ├── About.tsx
            ├── Projects.tsx
            ├── Testimonials.tsx
            ├── FAQ.tsx
            ├── Insights.tsx
            ├── Contact.tsx
            ├── Footer.tsx
            ├── FloatingFramerBadges.tsx
            └── index.ts
```

## 架構理念

重構後採用「關注點分離（separation of concerns）」的功能分層，這是中大型 React 專案常見的
組織方式：

- **`data/`**——所有文案與圖片網址都是純資料，修改內容不必動到任何 markup。每個資料檔皆以
  `types/` 中的介面標註型別。
- **`types/`**——集中管理共用型別（如 `Project`、`Testimonial` 聯合型別、`Faq` 等）。
- **`hooks/`**——把可重用的邏輯（捲動偵測 `useScrolled`、數字動畫 `useCountUp`）抽離元件。
- **`components/ui/`**——無業務邏輯、可跨區塊重用的小元件。
- **`components/sections/`**——頁面的每一段各自成檔，方便單獨閱讀與維護。
- **barrel 匯出（`index.ts`）**——讓匯入路徑保持簡潔，例如
  `import { Header, Hero } from "./components/sections"`。

## 頁面如何組成

`App` 元件只負責依序組合以下區塊：

`Header` → `Hero` → `Services` → `About` → `Projects` → `Testimonials` → `FAQ` →
`Insights` → `Contact` → `Footer` → `FloatingFramerBadges`

每個區塊自行從 `data/` 匯入所需內容、從 `hooks/` 匯入邏輯、從 `components/ui/` 匯入共用
元件，因此彼此獨立、易於單獨修改。

### 值得留意的部分

- **`useScrolled(offset)`**——追蹤頁面是否已捲動超過門檻值的 hook。用來在捲動時隱藏頂部
  導覽列，並顯示浮動的「Available for work」膠囊按鈕與選單按鈕。
- **`useCountUp(target, duration)`**——以 ease-out 曲線（`requestAnimationFrame`）將數字
  由 0 動畫到目標值。驅動 About 區塊的統計數據（12 年、270 個專案、50 位客戶）以及
  98% / 200% 的數據卡。
- **`AvailabilityPill`**、**`HiBubble`**、**`Socials`**、**`StarRow`**——跨區塊共用的小型
  呈現用元件。
- **`Header`**——桌面版導覽，加上由選單按鈕切換的行動版抽屜選單。
- **`Contact`**——靜態聯絡表單（欄位並未接上送出處理函式；送出按鈕為 `type="button"`）。
- **`FloatingFramerBadges`**——「Made in Framer」／「Get Template」膠囊按鈕，以及一個
  （無實際功能的）淺色／深色模式切換鈕，用來模擬原範本的介面裝飾。

## 樣式

所有樣式都在 [src/styles.css](src/styles.css) 中。它透過 `:root` 上的 CSS 自訂屬性定義了
一組精簡的設計 token 色盤：

```css
--ink:    #303030;  /* 主要文字 */
--muted:  #5d5d5d;
--line:   #dddddd;
--paper:  #ffffff;  /* 背景     */
--soft:   #f4f4f4;
--violet: #5f68e8;  /* 強調色   */
--dark:   #2f2f2f;
--radius: 24px;
```

字體排版使用 **Inter** 作為內文，並以 **Antonio** 作為大型標題字體，兩者都在樣式表頂部
從 Google Fonts 載入。

## 備註與注意事項

- **圖片需要網路連線**——所有圖片皆從 `framerusercontent.com` 載入，因此頁面需連上網路
  才能完整呈現。
- **沒有真正的後端**——聯絡表單、社群連結與模式切換鈕都只是呈現用途，沒有實際功能。
- 內容（「Duncan Robert」、電話／Email、客戶評價）皆為範本的示範／占位資料。
- 本專案為非官方的學習／參考用重製版；原始範本的著作權歸屬於 Framer Marketplace 上的
  原作者。
