"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { mapsUrl, submitRSVP } from "@/lib/invitation";
import { useInvitation } from "./InvitationProvider";

/* Code-split: the QR encoder stays out of the first-paint bundle
   and is only fetched once the card is fully revealed. */
const GuestPassQR = dynamic(() => import("./GuestPassQR"), {
  ssr: false,
  loading: () => (
    <div className="h-[152px] w-full animate-pulse rounded-2xl bg-white/[0.04]" />
  ),
});

type Response = "accepted" | "declined" | null;

export default function ActionPanel() {
  const { pass, location } = useInvitation();
  const [response, setResponse] = useState<Response>(null);

  /* Scoped per invitation, so answering on one card never leaks
     into another client's card on the same device. */
  const storageKey = `momocards:rsvp:${pass.code}`;

  /* Restore a previous answer on reload */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "accepted" || stored === "declined") setResponse(stored);
    } catch {
      /* private mode — ignore */
    }
  }, [storageKey]);

  const choose = useCallback(
    async (next: Exclude<Response, null>) => {
      setResponse(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
      await submitRSVP({
        passCode: pass.code,
        response: next,
        at: new Date().toISOString(),
      });
    },
    [storageKey, pass.code],
  );

  return (
    <section
      className="mt-7 flex w-full max-w-[380px] flex-col items-center gap-4"
      aria-label="Invitation actions"
    >
      {/* ── ① RSVP ─────────────────────────────────────── */}
      <div className="mo-item flex w-full flex-col gap-2.5">
        <p className="text-center font-amiri text-[13px] font-bold text-accent-soft/85">
          هل ستحضر؟{" "}
          <span className="font-cairo text-[11px] tracking-wide">
            Will you attend?
          </span>
        </p>
<div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => choose("accepted")}
            aria-pressed={response === "accepted"}
            className={[
              "relative min-h-[48px] overflow-hidden rounded-2xl px-3 text-[13px] font-bold",
              "transition-[transform,filter] duration-200 active:scale-[0.97]",
              "focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep focus-visible:outline-none",
              response === "accepted"
                ? "bg-gradient-to-b from-emerald-lux-light to-emerald-lux text-white shadow-[0_8px_22px_-8px_rgba(53,185,140,0.85)]"
                : "bg-gradient-to-b from-accent-soft to-accent text-accent-ink shadow-[0_8px_22px_-8px_rgba(201,162,39,0.8)] hover:brightness-110",
            ].join(" ")}
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {response === "accepted" ? "✓ تم التأكيد" : "حضرت العرض"}
              <span aria-hidden="true">✨</span>
            </span>
            <span
              className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() => choose("declined")}
            aria-pressed={response === "declined"}
            className={[
              "min-h-[48px] rounded-2xl px-3 text-[13px] font-semibold",
              "transition-[transform,background-color,color,border-color] duration-200 active:scale-[0.97]",
              "focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep focus-visible:outline-none",
              response === "declined"
                ? "border border-white/25 bg-white/10 text-paper"
                : "border border-white/12 bg-white/[0.04] text-paper/60 hover:bg-white/[0.08] hover:text-paper/85",
            ].join(" ")}
          >
            {response === "declined" ? "تم الاعتذار" : "Decline"}
          </button>
        </div>

        {response && (
          <p
            role="status"
            className="mo-fade text-center font-cairo text-[10.5px] text-accent/80"
          >
            {response === "accepted"
              ? "سعدنا بوجودك معنا · Your seat is reserved"
              : "نأسف لغيابك · We'll miss you"}
          </p>
        )}
      </div>

      {/* ── ② QR entrance pass ─────────────────────────── */}
      <div className="mo-item w-full">
        <GuestPassQR />
      </div>

      {/* ── ③ Venue ────────────────────────────────────── */}
      <div className="mo-item w-full">
        <a
          href={mapsUrl(location.lat, location.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl border border-accent/30 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-4 text-[13px] font-semibold text-accent-soft transition-[transform,border-color,background-color] duration-200 active:scale-[0.98] hover:border-accent/55 focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep focus-visible:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px] shrink-0"
            fill="currentColor"
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          <span className="font-amiri">عرض الموقع على خرائط جوجل</span>
          <span className="font-cairo text-[10px] tracking-wide text-accent/70">
            View on Maps
          </span>
        </a>
      </div>
    </section>
  );
}