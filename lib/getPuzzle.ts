import { getSanityClient } from "./sanityClient";
import { SANITY_CONFIG, PricettoPuzzle } from "./config";

export async function getPuzzle(dateString: string): Promise<PricettoPuzzle> {
  if (SANITY_CONFIG.useSanity && SANITY_CONFIG.projectId) {
    try {
      const query = `*[_type == "dailyPuzzle" && date == "${dateString}"][0]{
        date,
        groups[]{
          category,
          items[]{
            name,
            "image": image.asset->url,
            link
          }
        }
      }`;
      const result = await getSanityClient().fetch<PricettoPuzzle | null>(query);
      if (result) return result;
    } catch (err) {
      console.warn("Sanity fetch failed, falling back to local JSON", err);
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