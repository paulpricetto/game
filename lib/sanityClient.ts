import sanityClient from "@sanity/client";
import { SANITY_CONFIG } from "./config";

export const client = sanityClient({
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  apiVersion: SANITY_CONFIG.apiVersion,
  useCdn: true,
  token: SANITY_CONFIG.token,
});