import { getSanityClient } from "./sanityClient";
import { PricettoPuzzle } from "./config";

const puzzleFields = `
  date,
  groups[]{
    category,
    items[]{
      name,
      "image": image.asset->url,
      link
    }
  }
`;

export async function fetchDailyPuzzle(dateString: string): Promise<PricettoPuzzle | null> {
  const query = `*[_type == "dailyPuzzle" && date == "${dateString}"][0]{${puzzleFields}}`;
  return getSanityClient().fetch<PricettoPuzzle | null>(query);
}

export async function getLatestPuzzle(): Promise<PricettoPuzzle | null> {
  const query = `*[_type == "dailyPuzzle"] | order(date desc)[0]{${puzzleFields}}`;
  return getSanityClient().fetch<PricettoPuzzle | null>(query);
}


