import {
  Contact,
  Footer,
  Header,
  HeroCardJourney,
  Projects,
} from "./components/sections";

export default function App() {
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
