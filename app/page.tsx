import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import AboutCard from "./components/AboutCard";
import CurrentlyCard from "./components/CurrentlyCard";
import SkillsCard from "./components/SkillsCard";
import RecentHighlightsCard from "./components/RecentHighlightsCard";
import QuickFactsCard from "./components/QuickFactsCard";
import ReadingPlayingCard from "./components/ReadingPlayingCard";
import ContactCard from "./components/ContactCard";
import { readReading, readPlaying } from "./lib/content";

export default async function Home() {
  const [books, games] = await Promise.all([readReading(), readPlaying()]);

  return (
    <>
      <header style={{ background: "#1a2235", position: "sticky", top: 0, zIndex: 50 }}>
        <Nav />
        <Hero />
      </header>

      <main>
        <div
          style={{ maxWidth: 1140, margin: "0 auto", padding: 16 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]"
        >
          <div className="flex flex-col gap-4">
            <AboutCard />
            <CurrentlyCard />
            <QuickFactsCard />
            {/* <WritingCard /> */}
            <ContactCard />
          </div>
          <div className="flex flex-col gap-4">
            <SkillsCard />
            <RecentHighlightsCard />
            <ReadingPlayingCard books={books} games={games} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
