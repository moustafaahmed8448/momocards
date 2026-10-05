import { kv } from "@vercel/kv";
import type { ClientDraft, ClientRecord } from "../types";
import {
  SlugTakenError,
  type ClientRepository,
} from "./repository";
import { newId } from "./seed";

const CLIENT = (id: string) => `mc:client:${id}`;
const SLUG = (slug: string) => `mc:slug:${slug}`;
const INDEX = "mc:clients";

function parse(raw: unknown): ClientRecord | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    return JSON.parse(raw) as ClientRecord;
  } catch {
    return null;
  }
}

export const kvRepo: ClientRepository = {
  kind: "kv",

  async list() {
    const ids = await kv.smembers<string[]>(INDEX);
    if (!ids?.length) return [];
    const raws = await kv.mget<string[]>(ids.map(CLIENT));
    return raws
      .map(parse)
      .filter((c): c is ClientRecord => c !== null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async getById(id) {
    return parse(await kv.get(CLIENT(id)));
  },

  async getBySlug(slug) {
    const id = await kv.get<string>(SLUG(slug));
    return id ? parse(await kv.get(CLIENT(id))) : null;
  },

  async create(draft) {
    if (await kv.get(SLUG(draft.slug))) throw new SlugTakenError(draft.slug);
    const now = new Date().toISOString();
    const record: ClientRecord = { ...draft, id: newId(), createdAt: now, updatedAt: now };
    await kv.set(CLIENT(record.id), JSON.stringify(record));
    await kv.set(SLUG(record.slug), record.id);
    await kv.sadd(INDEX, record.id);
    return record;
  },

  async update(id, patch) {
    const existing = parse(await kv.get(CLIENT(id)));
    if (!existing) return null;

    const nextSlug = patch.slug ?? existing.slug;
    if (nextSlug !== existing.slug) {
      const owner = await kv.get<string>(SLUG(nextSlug));
      if (owner && owner !== id) throw new SlugTakenError(nextSlug);
      await kv.del(SLUG(existing.slug));
    }

    const merged: ClientRecord = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(CLIENT(id), JSON.stringify(merged));
    await kv.set(SLUG(merged.slug), id);
    await kv.sadd(INDEX, id);
    return merged;
  },

  async remove(id) {
    const existing = parse(await kv.get(CLIENT(id)));
    await kv.del(CLIENT(id));
    if (existing) await kv.del(SLUG(existing.slug));
    await kv.srem(INDEX, id);
    return existing !== null;
  },
};