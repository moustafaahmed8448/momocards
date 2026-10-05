"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteClient, duplicateClient } from "@/app/actions";
import { getTheme } from "@/lib/themes";
import type { ClientRecord } from "@/lib/types";

const btn =
  "min-h-[38px] rounded-lg border border-white/12 px-3 text-[12px] font-semibold " +
  "transition-colors hover:bg-white/[0.06] focus-visible:ring-2 " +
  "focus-visible:ring-accent focus-visible:outline-none";

export default function ClientCard({ client }: { client: ClientRecord }) {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(client.theme);

  const path = `/i/${client.slug}`;
  const url =
    typeof window === "undefined"
      ? path
      : `${window.location.origin}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${path}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the link is on screen to copy by hand */
    }
  };

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-accent/30">
      <div className="flex items-start gap-3">
        {/* theme swatch — straight from the palette */}
        <div
          className="flex h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10"
          aria-hidden="true"
        >
          {theme.preview.map((c) => (
            <span key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold text-paper">
            {client.clientName}
          </h3>
          <p className="truncate text-[12px] text-paper/50" dir="ltr">
            {client.hosts.en} · {client.event.en}
          </p>
          <p className="mt-1 truncate text-[11px] text-paper/35" dir="rtl">
            {client.date.ar}
          </p>
        </div>
      </div>

      <div
        className="rounded-lg border border-white/8 bg-black/30 px-3 py-2 font-mono text-[11px] text-paper/60"
        dir="ltr"
      >
        {path}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copy} className={`${btn} flex-1`}>
          {copied ? "✓ Copied" : "Copy guest link"}
        </button>

        <Link
          href={`/clients/${client.id}`}
          className={`${btn} flex-1 text-center leading-[36px]`}
        >
          Edit
        </Link>

        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} flex-1 text-center leading-[36px]`}
        >
          Preview
        </a>
      </div>

      <div className="flex gap-2 border-t border-white/8 pt-3">
        <form action={duplicateClient} className="flex-1">
          <input type="hidden" name="id" value={client.id} />
          <button type="submit" className={`${btn} w-full`}>
            Duplicate
          </button>
        </form>

        <form action={deleteClient} className="flex-1">
          <input type="hidden" name="id" value={client.id} />
          <button
            type="submit"
            className={`${btn} w-full border-seal/40 text-seal-hi hover:bg-seal/15`}
          >
            Delete
          </button>
        </form>
      </div>

      <span className="sr-only">Theme: {theme.label}. Link: {url}</span>
    </article>
  );
}