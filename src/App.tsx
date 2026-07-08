import {
  Contact,
  Footer,
  Header,
  HeroCardJourney,
  Projects,
  Sketches,
} from "./components/sections";
import { AmbientAudioToggle, BackToTop } from "./components/ui";
import { useAnchorScroll } from "./hooks";

export default function App() {
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
