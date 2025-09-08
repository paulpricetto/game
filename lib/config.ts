const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-09-01";
const token = process.env.SANITY_API_READ_TOKEN || "";
// Backward-compatible toggle: if NEXT_PUBLIC_USE_SANITY is set, respect it; otherwise auto-enable when projectId exists
const useSanityEnv = process.env.NEXT_PUBLIC_USE_SANITY;
const useSanity = typeof useSanityEnv === "string" ? useSanityEnv === "1" : projectId.length > 0;

export const SANITY_CONFIG = {
  projectId,
  dataset,
  apiVersion,
  token,
  useSanity,
} as const;

export type PricettoPuzzle = {
  date: string;
  groups: Array<{
    category: string;
    items: Array<{
      name: string;
      image: string;
      link?: string;
    }>;
  }>;
};

