import { Card, SectionLabel, AccentBar } from "./ui";
import { BookIcon, ControllerIcon } from "./icons";
import type { Book, Game } from "@/app/types";

interface Props {
  books: Book[];
  games: Game[];
}

export default function ReadingPlayingCard({ books, games }: Props) {
  return (
    <Card id="reading-playing">
      <SectionLabel>Currently Reading</SectionLabel>
      <AccentBar />
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 22 }}>
        {books.map((book, i) => (
          <div
            key={book.title}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "8px 0",
              borderBottom: i < books.length - 1 ? "1px solid #dde2ea" : "none",
            }}
          >
            <BookIcon />
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a2235", marginBottom: 1, lineHeight: 1.3 }}>
                {book.title}
              </div>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 10, color: "#7a90a8" }}>
                {book.author}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>Currently Playing</SectionLabel>
      <AccentBar />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {games.map((game, i) => (
          <div
            key={game.title}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "8px 0",
              borderBottom: i < games.length - 1 ? "1px solid #dde2ea" : "none",
            }}
          >
            <ControllerIcon />
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a2235", lineHeight: 1.3 }}>
              {game.title}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
