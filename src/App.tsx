import {
  Contact,
  Footer,
  Header,
  HeroCardJourney,
  Projects,
} from "./components/sections";
import { AmbientAudioToggle } from "./components/ui";
import { useAnchorScroll } from "./hooks";

export default function App() {
  useAnchorScroll();

  return (
    <div className="app">
      <Header />
      <main>
        <HeroCardJourney />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <AmbientAudioToggle />
    </div>
  );
}
