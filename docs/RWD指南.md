# RWD 指南 — zini-portfolio

> 2026/7/7 建立。起因：1081–1240px（小筆電）與 761–1240px 多個帶狀破版（About 卡被切、Hi 圖示被切、Projects 箭頭失效）。本文件是**響應式設計的唯一準則**，與 CLAUDE.md 並行；動效與色彩規範仍以 CLAUDE.md 為準。
>
> 驗證工具：`scripts/rwd-scan.mjs`（用法見 §6）。

---

## 一、斷點系統（唯一真相來源）

| 帶 | 範圍 | 版型 | 備註 |
|---|---|---|---|
| 桌機（安全） | ≥ 1281px | 雙欄格線 + journey 卡動畫 | 1120px 版心完整 + 兩側 ≥ 80px 邊距 |
| 桌機（窄帶）⚠️ | 1081–1280px | 同上 | **危險帶**：版心被壓縮（vw−40 < 1160 時固定軌道放不下）。任何固定 px 軌道的格線在此帶都要能收縮，見 §3-1 |
| 平板 | 761–1080px | 單欄；journey 改為「手機縮小進場」；Projects 改箭頭導覽 | JS 斷點 1080 必須與 CSS 同步，見 §4 |
| 手機 | ≤ 760px | 單欄置中；隱藏 site-nav 改 drawer；Services/About 卡隱藏 | |
| 超窄 | ≤ 380px | 字級再降 | 支援下限 320px（`body min-width: 320px`）|

**新增斷點前先問**：能不能用 `clamp()`/`minmax()` 讓現有帶自己適應？斷點越多，帶狀破版的組合越多。

## 二、版心公式（所有 section 佈局推導的起點）

```css
width: min(1120px, calc(100vw - 40px));
```

- 版心 = 1120px，頁邊距每側 20px。
- **臨界寬 1160px**：`1120 + 40 = 1160`。視口 < 1160px 時版心開始縮水——這就是「桌機窄帶」危險的根源：桌機版型從 1081px 就啟用，但固定軌道要 1160px 才放得下，**1081–1159px 之間少了最多 79px**。
- 任何加總 = 1120px 的固定軌道（如舊的 `600px + 130px gap + 390px`）在窄帶必然溢出。

## 三、鐵則（每條都是本站實際踩過的坑）

### 3-1. 固定軌道格線必須有「收縮件」

格線裡至少一個軌道或 gap 要能吸收窄帶的 79px 差額。本站 pattern（About 區實例）：

```css
/* 固定軌道總和 990px，讓 gap 吸收 1081–1160 的差額：
   gap = 100vw − 1030px，恰好使「軌道 + gap = 100vw − 40px（版心）」 */
.about-grid {
  grid-template-columns: minmax(0, 600px) 390px;
  gap: clamp(51px, calc(100vw - 1030px), 130px);
}
```

通式：`gap = clamp(最小gap, calc(100vw − (軌道總和 + 頁邊距40px)), 設計gap)`。
在 ≥1160px 時 gap 停在設計值（**寬螢幕視覺零變動**），窄帶時 gap 先縮，軌道用 `minmax(0, X)` 做最後保險。

### 3-2. 固定寬度一律寫 `min(設計值, 100%)`

`width: 320px` 在 320–359px 裝置就是切版（hero CTA 曾因此被切）。

```css
width: min(320px, 100%);   /* ✅ */
width: 320px;              /* ❌ named-device 假設 */
```

### 3-3. 裝飾性懸掛元素：突出量 ≤ 該帶可用邊距

Hi 圓圖示 `left: -62px` 掛在人像卡外——但 1240px 以下頁面能給它的左側空間 < 62px，就被視口切掉。規則：

- 先算該帶的最小可用邊距（頁邊距 20px + 格線置中餘量）。
- 突出量超過就在該帶縮小 offset（本站：`@media (max-width:1240px) { .hi-bubble.small { left: -26px } }`），或把宿主置中（平板帶 `.contact-portrait { justify-self: center }`）。

### 3-4. `transform: rotate()` 會膨脹視覺邊界（bbox）

旋轉不改變佈局尺寸，但視覺邊界外擴，**而且會計入 scrollWidth**：

| 元素 | 尺寸 | 角度 | bbox 每側外擴 |
|---|---|---|---|
| `.about-image` | 390×500 | 6° | ≈ 25px |
| `.services-image` | 340×476 | 8° | ≈ 32px |

通式：外擴 ≈ `(W·cosθ + H·sinθ − W) / 2`。旋轉卡靠版心邊緣擺放時要預留這個量（`.services-image` 的 `margin-right: 18px` 就是在做這件事）。

### 3-5. `visibility: hidden` 不是 `display: none`

隱藏的元素**仍佔佈局、仍貢獻 scrollWidth**。桌機上被 journey 卡取代的旋轉佔位卡曾造成 45–84px 的幻影溢出。已定案 pattern：

```css
@media (min-width: 1081px) {
  .hero-card-journey .services-image,
  .hero-card-journey .about-image {
    visibility: hidden;
    transform: none; /* 隱藏時就不要旋轉，消除幻影 bbox */
  }
}
```

### 3-6. `overflow-x: hidden` 是保險絲，不是修復

`body { overflow-x: hidden }` 只是把水平捲軸藏起來；**超出的內容仍然被切掉**。任何「加了 overflow hidden 就沒事了」的修法都是掩蓋。用 `scripts/rwd-scan.mjs` 量真實的 scrollWidth。

### 3-7. JS 降級不可降掉「功能」

Projects 在 ≤1080px 關掉滾動 pin 是合理降級，但曾連帶讓箭頭失效——2~4 件作品完全無法到達。規則：**關掉一種互動方式時，必須確認同一內容仍有另一條可達路徑**（現在：箭頭改為點擊驅動，沿用同一套滑動轉場語言）。

### 3-8. 每個斷點「兩側」都要驗

破版最常出現在斷點邊緣：1080 vs 1081、760 vs 761、380 vs 381。掃描器已內建這些邊緣值。

## 四、JS ↔ CSS 斷點同步表

JS 的 `matchMedia` 沒有辦法引用 CSS 變數，**改斷點時以下位置必須一起改**：

| 位置 | 值 | 作用 |
|---|---|---|
| `styles.css` 各 `@media` | 1080 / 760 / 380（+ hi-bubble 的 1240） | 版型切換 |
| `HeroCardJourney.tsx` | `(max-width: 1080px)` | 桌機 journey ↔ 手機縮小進場 |
| `Projects.tsx` | `(max-width: 1080px)` | 滾動 pin ↔ 箭頭導覽 |

三處的 1080 是**同一個斷點**，不同步就會出現「CSS 已切手機版但 JS 還在跑桌機動畫」的疊加破版。

## 五、QA 尺寸（取代舊的三尺寸清單）

每次 UI 修改後檢查：

| 寬度 | 代表 | 特別看什麼 |
|---|---|---|
| 1440 | 主流桌機（設計基準） | 視覺回歸 |
| **1120** | 小筆電/窄帶 ⚠️ | 固定軌道溢出、journey 卡落點 |
| 768 | 平板直向 | 單欄置中、懸掛圖示、Projects 箭頭 |
| 390 | 主流手機 | 縮小進場動畫、drawer |
| **320** | 支援下限 | 固定寬度溢出 |

加上 `prefers-reduced-motion` 開啟跑一遍（hero 有獨立的 `.hero-static` 靜態版型）。

## 六、自動掃描器

```bash
npm run build && npm run preview        # 終端 A
npm i -D puppeteer-core                 # 首次（用系統 Chrome，不下載瀏覽器）
node scripts/rwd-scan.mjs               # 終端 B：掃 24 個寬度
node scripts/rwd-scan.mjs 1120,1081     # 只掃指定寬度
```

> 註（2026/7/7）：本專案目前 `npm install` 會因 node_modules 缺 lockfile 而報
> arborist 錯誤（`Cannot read properties of null (reading 'matches')`）。修好
> lockfile 前的替代做法：在任意資料夾 `npm i puppeteer-core`，然後
> `ln -s <該資料夾>/node_modules/puppeteer-core node_modules/puppeteer-core`。

全部 `clean` 才算過；有溢出會列出肇事元素與其左右座標，exit code 1。

## 七、歷史紀錄

**2026/7/7 系統性修正**（本指南建立當次，細節見 git log）：

1. About 格線固定軌道 1120px → gap-clamp 流動式（§3-1）
2. Contact Hi 圖示 761–1240px 被左緣切掉 → 帶狀 offset + 平板置中（§3-3）
3. Projects ≤1080px 箭頭失效、僅第一件作品可見 → 點擊驅動導覽（§3-7）
4. hero 文字 `width: 320px` 在 320–359px 溢出 → `min(320px, 100%)`（§3-2）
5. 桌機隱藏佔位卡幻影溢出 → 隱藏時 `transform: none`（§3-5）

**已知未修（非破版，列入待辦）**：
- `styles.css` 有大量未掛載元件的樣式（`.hero`、`.journey-panel`、`.flip-section`、`.testimonial-*`、`.blog-*`、`.faq-*`），其中 `.hero` 的 `390px 340px 390px` 固定軌道同樣是窄帶地雷——若日後復用這些元件，先按 §3-1 改造。
- ≤760px 時 `.services-image`/`.about-image` 整個隱藏是刻意設計（版面節奏），不是 bug。
