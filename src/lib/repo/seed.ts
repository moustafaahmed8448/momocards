import { SAMPLE } from "../invitation";
import type { ThemeId } from "../themes";
import type { ClientRecord } from "../types";

export function newId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

/** Deterministic timestamp so seeding is obvious in git diffs. */
const EPOCH = "2026-01-01T00:00:00.000Z";

/** Nested groups are merged field-by-field, not replaced wholesale. */
type ClientOverrides = Partial<
  Omit<ClientRecord, "hosts" | "event" | "date" | "pass">
> & {
  hosts?: Partial<ClientRecord["hosts"]>;
  event?: Partial<ClientRecord["event"]>;
  date?: Partial<ClientRecord["date"]>;
  pass?: Partial<ClientRecord["pass"]>;
};

function client(
  slug: string,
  clientName: string,
  theme: ThemeId,
  overrides: ClientOverrides = {},
): ClientRecord {
  return {
    id: newId(),
    slug,
    clientName,
    theme,
    createdAt: EPOCH,
    updatedAt: EPOCH,
    ...SAMPLE,
    ...overrides,
    hosts: { ...SAMPLE.hosts, ...(overrides.hosts ?? {}) },
    event: { ...SAMPLE.event, ...(overrides.event ?? {}) },
    date: { ...SAMPLE.date, ...(overrides.date ?? {}) },
    pass: {
      ...SAMPLE.pass,
      ...(overrides.pass ?? {}),
      hint: { ...SAMPLE.pass.hint, ...(overrides.pass?.hint ?? {}) },
    },
  };
}

/** Written on first run so the dashboard is never empty. */
export function seedClients(): ClientRecord[] {
  return [
    client("ahmed-fatima", "Ahmed & Fatima", "royal"),
    client("nour-hassan", "Nour & Hassan", "eucalyptus", {
      hosts: { ar: "نور و حسن", en: "Nour & Hassan", monogram: "N" },
      event: { ar: "حفل زفاف", en: "Wedding" },
      date: {
        iso: "2027-03-11T19:30:00+02:00",
        ar: "الخميس ١١ مارس ٢٠٢٧",
        en: "Thursday, 11 March 2027",
      },
      venue: { ar: "قاعة الياسمين، التجمع الخامس", en: "Al Yasmin Hall, Fifth Settlement" },
      pass: { code: "MC-1B22-2027", url: "https://momocards.app/pass/MC-1B22-2027" },
    }),
    client("sara-omar", "Sara & Omar", "rose", {
      hosts: { ar: "سارة و عمر", en: "Sara & Omar", monogram: "S" },
      event: { ar: "خطوبة", en: "Engagement" },
      date: {
        iso: "2027-05-06T21:00:00+02:00",
        ar: "الخميس ٦ مايو ٢٠٢٧",
        en: "Thursday, 6 May 2027",
      },
      venue: { ar: "قاعة النخيل، الشيخ زايد", en: "Al Nakheel Hall, Sheikh Zayed" },
      location: { lat: 30.0444, lng: 30.9727 },
      pass: { code: "MC-9C04-2027", url: "https://momocards.app/pass/MC-9C04-2027" },
    }),
  ];
}