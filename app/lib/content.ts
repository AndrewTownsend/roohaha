import { createClient } from "@vercel/edge-config";
import { cacheTag } from "next/cache";
import type { Book, Game } from "@/app/types";

interface Content {
  reading: Book[];
  playing: Game[];
}

async function fetchContent(): Promise<Content> {
  "use cache";
  cacheTag("content");
  if (!process.env.EDGE_CONFIG) {
    throw new Error("EDGE_CONFIG is not set — run `vercel env pull .env.local` to configure it");
  }
  const client = createClient(process.env.EDGE_CONFIG);
  const all = await client.getAll<{ reading: Book[]; playing: Game[] }>([
    "reading",
    "playing",
  ]);
  return { reading: all?.reading ?? [], playing: all?.playing ?? [] };
}

export async function readReading(): Promise<Book[]> {
  return (await fetchContent()).reading;
}

export async function readPlaying(): Promise<Game[]> {
  return (await fetchContent()).playing;
}
