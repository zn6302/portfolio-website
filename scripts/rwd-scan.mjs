/**
 * RWD 水平溢出掃描器 — 用法見 docs/RWD指南.md。
 *
 *   1. npm run build && npm run preview   （另開終端）
 *   2. npm i -D puppeteer-core            （首次；用系統 Chrome，不下載瀏覽器）
 *   3. node scripts/rwd-scan.mjs          （預設掃 24 個寬度）
 *      node scripts/rwd-scan.mjs 390,768  （只掃指定寬度）
 *
 * 每個寬度回報：document.scrollWidth 是否超過視口（水平溢出），以及
 * 超出視口左右邊界的元素清單。全部 "clean" 才算過。
 * 注意：body 的 overflow-x:hidden 會把溢出「藏起來」而不是修好——
 * 被藏掉的內容一樣是被切掉的，所以這裡直接量 scrollWidth 與元素矩形。
 */
import puppeteer from "puppeteer-core";

const CHROME_PATHS = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  linux: "/usr/bin/google-chrome",
};
const URL = process.env.SCAN_URL || "http://127.0.0.1:4173/";

// 裝置代表寬度 + 斷點邊緣（380/381、760/761、1080/1081）
const DEFAULT_WIDTHS = [
  320, 360, 375, 380, 381, 390, 414, 480, 600, 744, 760, 761, 768, 820, 860,
  912, 1024, 1080, 1081, 1120, 1280, 1440, 1728, 1920,
];
const WIDTHS = process.argv[2] ? process.argv[2].split(",").map(Number) : DEFAULT_WIDTHS;

const heightFor = (w) => (w < 500 ? 844 : w < 1000 ? 1024 : 900);

const browser = await puppeteer.launch({
  executablePath: CHROME_PATHS[process.platform],
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
let failed = false;

for (const w of WIDTHS) {
  await page.setViewport({ width: w, height: heightFor(w), deviceScaleFactor: 1, isMobile: w <= 1080, hasTouch: w <= 1080 });
  await page.goto(URL, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));

  const result = await page.evaluate(() => {
    const vw = window.innerWidth;
    const overflow = document.documentElement.scrollWidth - vw;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const style = getComputedStyle(el);
      // fixed 元素（浮動導覽）與 visibility:hidden 的佔位元素不算視覺破版
      if (style.position === "fixed" || style.visibility === "hidden") continue;
      if (r.right > vw + 1 || r.left < -1) {
        offenders.push(
          el.tagName.toLowerCase() +
            (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).join(".") : "") +
            ` [l:${Math.round(r.left)} r:${Math.round(r.right)}]`,
        );
      }
      if (offenders.length > 8) break;
    }
    return { overflow, offenders };
  });

  const ok = result.overflow <= 0 && result.offenders.length === 0;
  if (!ok) failed = true;
  console.log(
    String(w).padStart(4),
    ok ? "clean" : `overflow:${result.overflow}px  ${result.offenders.join(" | ")}`,
  );
}

await browser.close();
process.exit(failed ? 1 : 0);
