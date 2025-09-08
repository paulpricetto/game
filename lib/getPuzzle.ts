import { getSanityClient } from "./sanityClient";
import { SANITY_CONFIG, PricettoPuzzle } from "./config";

export async function getPuzzle(dateString: string): Promise<PricettoPuzzle> {
  if (SANITY_CONFIG.useSanity && SANITY_CONFIG.projectId) {
    try {
      const url = `/api/puzzle/sanity?date=${encodeURIComponent(dateString)}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res.json();
    } catch (err) {
      console.warn("Sanity API route failed, falling back to CSV/static", err);
    }
  }
  // Try local CSV-backed endpoint first
  try {
    const resIdeas = await fetch("/api/puzzle/ideas", { cache: "no-store" });
    if (resIdeas.ok) return resIdeas.json();
  } catch {}
  // Fallback to static file
  const res = await fetch("/game-data.json", { cache: "no-store" });
  return res.json();
}