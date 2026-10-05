import type { ThemeId } from "./themes";

/** Bilingual text pair. Arabic is primary — guests are Egyptian. */
export interface Bi {
  ar: string;
  en: string;
}

/**
 * Everything a single invitation renders. Shared shape between the
 * demo, the dashboard editor, and the persisted `ClientRecord`.
 */
export interface InvitationContent {
  /** max 2 chars — stamped on the wax seal and the flap lining */
  hosts: Bi & { monogram: string };
  event: Bi;
  body: Bi;
  date: Bi & { iso: string };
  time: Bi;
  venue: Bi;
  location: { lat: number; lng: number };
  pass: { code: string; url: string; hint: Bi };
  brand: Bi;
}

/** A client's persisted invitation. */
export interface ClientRecord extends InvitationContent {
  id: string;
  /** URL segment for /i/[slug] — unique, lowercase */
  slug: string;
  /** display name in the dashboard list */
  clientName: string;
  theme: ThemeId;
  createdAt: string;
  updatedAt: string;
}

export type RsvpResponse = "accepted" | "declined";

/** Only these fields are writable from the dashboard form. */
export type ClientDraft = Omit<
  ClientRecord,
  "id" | "createdAt" | "updatedAt"
>;
