/**
 * ─────────────────────────────────────────────────────────────
 *  MOMOCARDS · SAMPLE CONTENT
 *  Seeded into the JSON store on first run so the dashboard is
 *  never empty. Per-client content lives in data/clients.json.
 * ─────────────────────────────────────────────────────────────
 */
import type { InvitationContent } from "./types";

export const SAMPLE: InvitationContent = {
  hosts: {
    ar: "أحمد و فاطمة",
    en: "Ahmed & Fatima",
    /** Shown on the wax-seal monogram (max 2 characters recommended) */
    monogram: "M",
  },

  event: {
    ar: "كتب كتاب",
    en: "Katb Ketab",
  },

  /** Invitation paragraph */
  body: {
    ar: "بكل فخر واحترام ندعوكم لحضور حفل زفافنا، ونتشرّف بوجودكم بين أحبابنا لتكتمل الفرحة. نحتفظ لكم بمقعدٍ مقدّم في القلب.",
    en: "With great joy and respect, we invite you to join us for our wedding celebration. It would be an honour to have you among us, seated closest to our hearts.",
  },

  date: {
    /** ISO — used for <time> and machine-readable metadata */
    iso: "2026-12-18T20:00:00+02:00",
    ar: "الجمعة ١٨ ديسمبر ٢٠٢٦",
    en: "Friday, 18 December 2026",
  },

  time: {
    ar: "الساعة الثامنة مساءً",
    en: "8:00 PM",
  },

  venue: {
    ar: "قاعة الياسمين، التجمع الخامس",
    en: "Al Yasmin Hall, Fifth Settlement",
  },

  /** Google Maps deep link source */
  location: {
    lat: 30.0566,
    lng: 31.2119,
  },

  /** Unique guest pass encoded into the QR code */
  pass: {
    code: "MC-7F3A-2026",
    /** Whatever your scanner backend expects (URL, string id, JWT, …) */
    url: "https://momocards.app/pass/MC-7F3A-2026",
    hint: {
      ar: "اعرض هذا الرمز عند باب الدخول",
      en: "Show this pass at the entrance gate",
    },
  },

  brand: {
    ar: "صُنع بعناية بواسطة MomoCards",
    en: "Designed by MomoCards",
  },
};

/** Lightweight Google Maps search URL — no API key required. */
export function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * URL-safe slug from an arbitrary name. Arabic input falls back to
 * a transliteration-free path, so we strip anything non-ASCII and
 * fall back to `invitation` if nothing survives.
 */
export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "invitation";
}

/**
 * ── RSVP transport ──────────────────────────────────────────
 * There is intentionally NO backend yet, so this is a no-op stub.
 * Point it at your API route / Supabase / Google Sheet to go live.
 *
 * @example
 *   const res = await fetch("/api/rsvp", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(payload),
 *   });
 */
export async function submitRSVP(payload: {
  passCode: string;
  response: "accepted" | "declined";
  at: string;
}): Promise<{ ok: boolean }> {
  // TODO: replace with a real endpoint.
  if (process.env.NEXT_PUBLIC_RSVP_ENDPOINT) {
    const res = await fetch(process.env.NEXT_PUBLIC_RSVP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  }
  return { ok: true };
}