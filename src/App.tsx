import {
  Contact,
  Footer,
  Header,
  HeroCardJourney,
  Projects,
  Sketches,
} from "./components/sections";
import { BackToTop } from "./components/ui";
import { useAnchorScroll, useLenis, useScrollReveal } from "./hooks";

export default function App() {
  // Lenis owns window scroll on desktop (skipped under reduced-motion and on
  // touch devices); anchor scrolls route through it when it exists and fall
  // back to ScrollToPlugin otherwise.
  useLenis();
  useAnchorScroll();
  useScrollReveal();

  return (
    <div className="app">
      <Header />
      <main>
        {/* 全站唯一的 <h1>，視覺上隱藏（`.sr-only`）。刻意放在 <main> 第一個子
            元素，而不是放進 hero 內部：`.hero-intro` 在 prefers-reduced-motion
            下會被 HeroCardJourney 設成 display:none，`.hero-intro` / `.hero-profile`
            兩者也會被 GSAP 的 autoAlpha 輪流隱藏——只要 h1 在那些容器裡，就一定
            有某個狀態會讓它整個離開渲染樹與無障礙樹（display:none 無法用子層
            的 visibility:visible 逃脫，實測確認）。放在這裡則不受任何動畫狀態
            影響，也同時是 DOM 中的第一個標題。 */}
        <h1 className="sr-only">葉子倪 YE Zi-Ni — HCI × Creative Coding 作品集</h1>
        {/* HeroCardJourney renders Hero + Services (Skills constellation,
            disableCardFlip) + About (disableCardFlip) as one scroll-jacked
            card animation — Skills already sits between Hero and Projects
            here, it isn't a separate sibling section. */}
        <HeroCardJourney />
        <Projects />
        <Sketches />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
