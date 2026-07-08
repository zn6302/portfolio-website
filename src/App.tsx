import {
  Contact,
  Footer,
  Header,
  HeroCardJourney,
  Projects,
  Services,
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
        <HeroCardJourney />
        <Services />
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
