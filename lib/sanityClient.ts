import { createClient } from "@sanity/client";
import { SANITY_CONFIG } from "./config";

export function getSanityClient() {
  if (!SANITY_CONFIG.projectId || !SANITY_CONFIG.dataset) {
    throw new Error("Sanity not configured: missing projectId or dataset");
  }
  return createClient({
    projectId: SANITY_CONFIG.projectId,
    dataset: SANITY_CONFIG.dataset,
    apiVersion: SANITY_CONFIG.apiVersion,
    useCdn: true,
    token: SANITY_CONFIG.token,
  });
}