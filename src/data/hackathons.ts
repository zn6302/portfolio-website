import type { Hackathon, Locale } from "../types";

// 唯一內容來源：黑客松作品（團隊作品，和 projects.ts 的個人精選作品分開放）。
const hackathonsZh: Hackathon[] = [
  {
    slug: "noxflow",
    title: "NOXFLOW",
    meta: "HACKATHON · 2026/09 · 5 人團隊",
    description:
      "把加密貨幣投資做成四人即時對戰：召喚貓咪就是買入，撤回結算就是賣出，錢就是血量。一局三分鐘，結束後把你剛才的操作對照成定期定額、質押、部位控管這些真實概念。",
    role: "我負責前端動畫與全端工程",
    points: [
      "已上線，按一下就能和真人配對；空位由 AI 交易員補上，斷線的玩家有 20 秒可以回來",
      "伺服器權威：一場對戰是一個 Colyseus room，60Hz 模擬、每秒 20 次狀態同步，金錢判斷不在玩家的瀏覽器做",
      "61 格等角六角地圖、貓咪與礦車全用 SVG 畫，桌機和手機都清楚",
    ],
    image: "/projects/noxflow.webp",
    alt: "NOXFLOW 對戰畫面：綠色等角六角地圖上有礦坑、森林和雪山，像素風貓咪在格子間移動，下方是現金、幣價走勢和召喚貓咪的按鈕列。",
    tech: ["React", "Vite", "Colyseus", "WebSocket", "SVG", "Docker", "Fly.io"],
    liveUrl: "https://noxcat-arena.fly.dev/",
    githubUrl: "https://github.com/zn6302/blockchain_game",
  },
];

// English text per slug; media, tech and links are inherited from the zh entry.
const hackathonCopyEn: Record<
  string,
  Pick<Hackathon, "meta" | "description" | "role" | "points" | "alt">
> = {
  noxflow: {
    meta: "HACKATHON · 2026/09 · TEAM OF 5",
    description:
      "Crypto investing as a four-player real-time battle: summoning a cat is a buy, settling it is a sell, and your cash is your health. A match lasts three minutes, then a debrief maps what you just did onto dollar-cost averaging, staking and position sizing.",
    role: "My part: frontend animation and full-stack engineering",
    points: [
      "Live: one click matches you with real players; AI traders fill empty seats, and a dropped player has 20 seconds to reconnect",
      "Server-authoritative: each match is one Colyseus room running a 60 Hz simulation with 20 state syncs a second, so no money decision happens in a player's browser",
      "The 61-hex isometric map, cats and ore carts are all drawn in SVG, crisp on desktop and phone",
    ],
    alt: "NOXFLOW match screen: a green isometric hex map with mines, forests and snowy peaks, pixel-art cats moving between tiles, and a bottom bar with cash, the coin price chart and cat summon buttons.",
  },
};

export const hackathons: Record<Locale, Hackathon[]> = {
  zh: hackathonsZh,
  en: hackathonsZh.map((item) => ({ ...item, ...hackathonCopyEn[item.slug] })),
};
