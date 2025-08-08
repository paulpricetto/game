export const SANITY_CONFIG = {
  projectId: "", // e.g., "abcd1234"
  dataset: "production",
  apiVersion: "2025-08-07",
  token: "",
  useSanity: false,
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

