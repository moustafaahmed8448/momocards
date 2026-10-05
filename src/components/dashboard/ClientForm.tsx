"use client";

import { useActionState, useState } from "react";
import { saveClient, type FormState } from "@/app/actions";
import ThemePicker from "./ThemePicker";
import type { ClientRecord } from "@/lib/types";

/* ── Primitives ─────────────────────────────────────────── */

const inputCls =
  "w-full rounded-lg border border-white/12 bg-black/25 px-3 py-2 text-[13px] " +
  "text-paper outline-none transition-colors placeholder:text-paper/25 " +
  "focus:border-accent focus:ring-1 focus:ring-accent";

function TextField({
  label,
  name,
  defaultValue,
  value,
  onChange,
  placeholder,
  dir,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  type?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[10px] font-bold tracking-wide text-paper/50 uppercase">
        {label}
      </span>
      <input
        name={name}
        type={type}
        dir={dir}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        className={inputCls}
      />
    </label>
  );
}

function AreaField({
  label,
  name,
  defaultValue,
  dir,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[10px] font-bold tracking-wide text-paper/50 uppercase">
        {label}
      </span>
      <textarea
        name={name}
        dir={dir}
        rows={3}
        defaultValue={defaultValue}
        className={`${inputCls} resize-y leading-relaxed`}
      />
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <h3 className="text-[11px] font-bold tracking-widest text-accent uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

interface ClientFormProps {
  client?: ClientRecord;
}

export default function ClientForm({ client }: ClientFormProps) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveClient,
    {},
  );
  const [slug, setSlug] = useState(client?.slug ?? "");
  const [touchedSlug, setTouchedSlug] = useState(Boolean(client));

  /* Auto-fill the link name from the client name until the user
     edits it themselves — then we never stomp on their choice. */
  const autoSlug = (value: string) => {
    if (touchedSlug) return;
    setSlug(
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    );
  };

  return (
    <form action={action} className="flex flex-col gap-4">
      {client && <input type="hidden" name="id" value={client.id} />}

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-seal/50 bg-seal/15 px-4 py-3 text-[13px] text-seal-hi"
        >
          {state.error}
        </p>
      )}

      {/* ── Basics ── */}
      <Section title="Basics · الأساسيات">
        <TextField
          label="Client name (dashboard only)"
          name="clientName"
          defaultValue={client?.clientName}
          placeholder="Ahmed & Fatima"
          dir="ltr"
          onChange={autoSlug}
        />
        <TextField
          label="Guest link · /i/…"
          name="slug"
          value={slug}
          onChange={(v) => {
            setTouchedSlug(true);
            setSlug(v);
          }}
          placeholder="ahmed-fatima"
          dir="ltr"
        />
      </Section>

      {/* ── Theme ── */}
      <Section title="Appearance · المظهر">
        <ThemePicker defaultValue={client?.theme ?? "royal"} />
      </Section>

      {/* ── Hosts & event ── */}
      <Section title="Hosts & event · Hosts">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Hosts (AR)" name="hosts.ar" defaultValue={client?.hosts.ar} dir="rtl" />
          <TextField label="Hosts (EN)" name="hosts.en" defaultValue={client?.hosts.en} dir="ltr" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Seal monogram (1–2 chars)"
            name="hosts.monogram"
            defaultValue={client?.hosts.monogram}
            dir="ltr"
          />
          <TextField label="Event (AR)" name="event.ar" defaultValue={client?.event.ar} dir="rtl" />
        </div>
        <TextField label="Event (EN)" name="event.en" defaultValue={client?.event.en} dir="ltr" />
      </Section>
{/* ── Message ── */}
      <Section title="Message · نص الدعوة">
        <AreaField label="Body (AR)" name="body.ar" defaultValue={client?.body.ar} dir="rtl" />
        <AreaField label="Body (EN)" name="body.en" defaultValue={client?.body.en} dir="ltr" />
      </Section>

      {/* ── When ── */}
      <Section title="When · الموعد">
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField
            label="Date ISO"
            name="date.iso"
            defaultValue={client?.date.iso}
            placeholder="2026-12-18T20:00:00+02:00"
            dir="ltr"
          />
          <TextField label="Date (AR)" name="date.ar" defaultValue={client?.date.ar} dir="rtl" />
          <TextField label="Date (EN)" name="date.en" defaultValue={client?.date.en} dir="ltr" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Time (AR)" name="time.ar" defaultValue={client?.time.ar} dir="rtl" />
          <TextField label="Time (EN)" name="time.en" defaultValue={client?.time.en} dir="ltr" />
        </div>
      </Section>

      {/* ── Where ── */}
      <Section title="Where · المكان">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Venue (AR)" name="venue.ar" defaultValue={client?.venue.ar} dir="rtl" />
          <TextField label="Venue (EN)" name="venue.en" defaultValue={client?.venue.en} dir="ltr" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Latitude"
            name="location.lat"
            defaultValue={client ? String(client.location.lat) : ""}
            dir="ltr"
          />
          <TextField
            label="Longitude"
            name="location.lng"
            defaultValue={client ? String(client.location.lng) : ""}
            dir="ltr"
          />
        </div>
        <p className="text-[10.5px] leading-relaxed text-paper/35">
          Drives the “View on Google Maps” button — guests get directions from
          these two numbers.
        </p>
      </Section>

      {/* ── QR pass ── */}
      <Section title="QR pass · تذكرة الدخول">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Pass code"
            name="pass.code"
            defaultValue={client?.pass.code}
            dir="ltr"
          />
          <TextField
            label="QR payload URL"
            name="pass.url"
            defaultValue={client?.pass.url}
            dir="ltr"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Hint (AR)"
            name="pass.hint.ar"
            defaultValue={client?.pass.hint.ar}
            dir="rtl"
          />
          <TextField
            label="Hint (EN)"
            name="pass.hint.en"
            defaultValue={client?.pass.hint.en}
            dir="ltr"
          />
        </div>
      </Section>

      {/* ── Brand ── */}
      <Section title="Brand · العلامة">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Signature (AR)"
            name="brand.ar"
            defaultValue={client?.brand.ar}
            dir="rtl"
          />
          <TextField
            label="Signature (EN)"
            name="brand.en"
            defaultValue={client?.brand.en}
            dir="ltr"
          />
        </div>
      </Section>

      {/* ── Actions ── */}
      <div className="sticky bottom-0 -mx-5 flex items-center gap-3 border-t border-white/10 bg-bg-deep/95 px-5 py-3 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="min-h-[46px] flex-1 rounded-xl bg-gradient-to-b from-accent-soft to-accent-deep px-5 text-[14px] font-bold text-accent-ink transition-[transform,filter] active:scale-[0.98] hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Saving…" : client ? "Save changes" : "Create invitation"}
        </button>
        <a
          href="/"
          className="min-h-[46px] rounded-xl border border-white/15 px-5 py-3 text-[14px] font-semibold text-paper/70 transition-colors hover:bg-white/5"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
