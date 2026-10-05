import { promises as fs } from "node:fs";
import path from "node:path";
import type { ClientDraft, ClientRecord } from "../types";
import {
  SlugTakenError,
  StorageUnavailableError,
  type ClientRepository,
} from "./repository";
import { newId, seedClients } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "clients.json");

/**
 * Serialises every read-modify-write behind a promise chain so two
 * concurrent dashboard submits can't clobber each other.
 */
let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function writeAll(clients: ClientRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Write to a sibling temp file, then rename — rename is atomic on
  // the same volume, so a crash mid-write can't truncate the store.
  const tmp = path.join(DATA_DIR, `.clients.${process.pid}.tmp`);
  await fs.writeFile(tmp, `${JSON.stringify(clients, null, 2)}\n`, "utf8");
  await fs.rename(tmp, FILE);
}

async function readAll(): Promise<ClientRecord[]> {
  let raw: string;
  try {
    raw = await fs.readFile(FILE, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    // First run — seed so the dashboard has something to show.
    const seeded = seedClients();
    await writeAll(seeded);
    return seeded;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ClientRecord[]) : [];
  } catch {
    throw new StorageUnavailableError(
      `data/clients.json is not valid JSON. Fix or delete it and restart — ` +
        `it was NOT overwritten automatically so you don't lose data.`,
    );
  }
}

export const jsonRepo: ClientRepository = {
  kind: "json",

  async list() {
    const all = await readAll();
    return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async getById(id) {
    return (await readAll()).find((c) => c.id === id) ?? null;
  },

  async getBySlug(slug) {
    return (await readAll()).find((c) => c.slug === slug) ?? null;
  },

  create(draft) {
    return serialise(async () => {
      const all = await readAll();
      if (all.some((c) => c.slug === draft.slug)) throw new SlugTakenError(draft.slug);
      const now = new Date().toISOString();
      const record: ClientRecord = { ...draft, id: newId(), createdAt: now, updatedAt: now };
      await writeAll([record, ...all]);
      return record;
    });
  },

  update(id, patch) {
    return serialise(async () => {
      const all = await readAll();
      const i = all.findIndex((c) => c.id === id);
      if (i === -1) return null;
      const nextSlug = patch.slug ?? all[i].slug;
      if (all.some((c, j) => j !== i && c.slug === nextSlug)) {
        throw new SlugTakenError(nextSlug);
      }
      const merged: ClientRecord = {
        ...all[i],
        ...patch,
        id: all[i].id,
        createdAt: all[i].createdAt,
        updatedAt: new Date().toISOString(),
      };
      all[i] = merged;
      await writeAll(all);
      return merged;
    });
  },

  remove(id) {
    return serialise(async () => {
      const all = await readAll();
      const next = all.filter((c) => c.id !== id);
      if (next.length === all.length) return false;
      await writeAll(next);
      return true;
    });
  },
};