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
import ContributionGraph from "./components/ContributionGraph";
import WritingCard from "./components/WritingCard";
import ProjectsCard from "./components/ProjectsCard";
import { readReading, readPlaying } from "./lib/content";
import { readFeatureGates } from "./lib/feature-gates";
import { readProjects } from "./lib/projects";

export default async function Home() {
  const [books, games, gates, projects] = await Promise.all([
    readReading(),
    readPlaying(),
    readFeatureGates(),
    readProjects(),
  ]);

  const showProjects = gates.projects && projects.length > 0;

  return (
    <>
      <header style={{ background: "#1a2235", position: "sticky", top: 0, zIndex: 50 }}>
        <Nav showProjects={showProjects} />
      </header>
      <div style={{ background: "#1a2235" }}>
        <Hero />
      </div>

      <main>
        <div
          style={{ maxWidth: 1140, margin: "0 auto", padding: 16 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]"
        >
          <div className="flex flex-col gap-4">
            <AboutCard />
            <div className="flex flex-col gap-4 md:hidden">
              <CurrentlyCard />
              <SkillsCard />
              <RecentHighlightsCard />
            </div>
            {gates.githubGraph && <ContributionGraph />}
            {gates.projects && projects.length > 0 && <ProjectsCard projects={projects} />}
            <QuickFactsCard />
            {gates.writing && <WritingCard />}
            <ContactCard />
            <div className="md:hidden">
              <ReadingPlayingCard books={books} games={games} />
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4">
            <CurrentlyCard />
            <SkillsCard />
            <RecentHighlightsCard />
            <ReadingPlayingCard books={books} games={games} id="reading-playing" />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
