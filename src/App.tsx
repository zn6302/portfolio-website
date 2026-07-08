import {
  Contact,
  Footer,
  Header,
  HeroCardJourney,
  Projects,
} from "./components/sections";
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
    </div>
  );
}
