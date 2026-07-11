import {
  Contact,
  Footer,
  Header,
  HeroCardJourney,
  Projects,
  Sketches,
} from "./components/sections";
import { AmbientAudioToggle, BackToTop } from "./components/ui";
import { useAnchorScroll, useLenis } from "./hooks";

export default function App() {
  // Lenis owns window scroll on desktop (skipped under reduced-motion and on
  // touch devices); anchor scrolls route through it when it exists and fall
  // back to ScrollToPlugin otherwise.
  useLenis();
  useAnchorScroll();

  return (
    <div className="app">
      <Header />
      <main>
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
      <AmbientAudioToggle />
    </div>
  );
}
