import { client } from "./sanityClient";
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
      const result = await client.fetch<PricettoPuzzle | null>(query);
      if (result) return result;
    } catch (err) {
      console.warn("Sanity fetch failed, falling back to local JSON", err);
    }
  }
  const res = await fetch("/game-data.json", { cache: "no-store" });
  return res.json();
}