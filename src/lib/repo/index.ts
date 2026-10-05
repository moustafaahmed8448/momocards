import { jsonRepo } from "./json";
import { kvRepo } from "./kv";
import type { ClientRepository } from "./repository";

let cached: ClientRepository | null = null;

/**
 * Adapter selection (memoised per process — the warning must fire
 * once, not on every request).
 *
 *   KV_REST_API_URL + KV_REST_API_TOKEN set  → Vercel KV (Upstash)
 *   otherwise                               → data/clients.json
 *
 * The JSON file only works where the filesystem is writable, which
 * rules out Vercel's serverless runtime. We warn loudly rather than
 * letting a write fail later with a confusing 500.
 */
export function getRepo(): ClientRepository {
  if (cached) return cached;

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    cached = kvRepo;
    return cached;
  }

  if (process.env.VERCEL) {
    console.warn(
      "[momocards] No KV_REST_API_URL / KV_REST_API_TOKEN found, so the " +
        "JSON fallback was selected — but Vercel's filesystem is read-only " +
        "and writes WILL fail. Connect a Vercel KV store to fix this.",
    );
  } else if (process.env.NODE_ENV === "production") {
    console.warn(
      "[momocards] Using the JSON store in production. That is fine for a " +
        "single long-running Node server, but it will not survive restarts " +
        "on most hosts.",
    );
  }

  cached = jsonRepo;
  return cached;
}

export { SlugTakenError, StorageUnavailableError } from "./repository";
export type { ClientRepository } from "./repository";