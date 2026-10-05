import type { ClientDraft, ClientRecord } from "../types";

/**
 * Storage contract. Swapping JSON ⇄ KV (or Postgres later) must not
 * touch a single page or component — see `getRepo()`.
 */
export interface ClientRepository {
  list(): Promise<ClientRecord[]>;
  getById(id: string): Promise<ClientRecord | null>;
  getBySlug(slug: string): Promise<ClientRecord | null>;
  create(draft: ClientDraft): Promise<ClientRecord>;
  update(id: string, patch: Partial<ClientDraft>): Promise<ClientRecord | null>;
  remove(id: string): Promise<boolean>;
  /** Human-readable backing store, surfaced in the dashboard footer. */
  readonly kind: "json" | "kv";
}

export class SlugTakenError extends Error {
  constructor(slug: string) {
    super(`The link name "${slug}" is already used by another invitation.`);
    this.name = "SlugTakenError";
  }
}

export class StorageUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageUnavailableError";
  }
}