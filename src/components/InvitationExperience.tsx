"use client";

import { useCallback, useEffect, useState } from "react";
import Envelope from "./Envelope";
import TapHint from "./TapHint";
import ActionPanel from "./ActionPanel";
import { InvitationProvider } from "./InvitationProvider";
import { OPEN_DELAY, OPEN_DELAY_REDUCED, type Stage } from "@/lib/stage";
import type { InvitationContent } from "@/lib/types";
import type { ThemeId } from "@/lib/themes";

interface InvitationExperienceProps {
  content: InvitationContent;
  theme: ThemeId;
}

/**
 * The entire animation is declarative: React owns one attribute,
 * `data-stage`, and `globals.css` reacts to it. Nothing here
 * measures time, touches transforms, or imports an animation lib.
 *
 * `data-theme` is set here too, so the whole tree — including the
 * ambient glows on `.theme-canvas` — re-colours from one attribute.
 */
export default function InvitationExperience({
  content,
  theme,
}: InvitationExperienceProps) {
  const [stage, setStage] = useState<Stage>("idle");

  /* One timeout promotes `opening` → `open`, which is what mounts
     the action panel. With reduced motion the CSS choreography is
     already ~0ms, so this collapses to the same tick. */
  useEffect(() => {
    if (stage !== "opening") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const delay = media.matches ? OPEN_DELAY_REDUCED : OPEN_DELAY;

    const id = window.setTimeout(() => setStage("open"), delay);
    return () => window.clearTimeout(id);
  }, [stage]);

  const open = useCallback(() => {
    setStage((s) => (s === "idle" ? "opening" : s));
  }, []);

  const { hosts, event, date } = content;

  return (
    <InvitationProvider content={content}>
      <div
        data-stage={stage}
        data-theme={theme}
        className="theme-canvas relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col items-center bg-bg-deep px-5 pt-[max(26px,env(safe-area-inset-top))] pb-[max(34px,env(safe-area-inset-bottom))] text-paper"
      >
        <main className="flex w-full flex-1 flex-col items-center">
          <h1 className="sr-only">
            {hosts.en} — {event.en}
          </h1>

          <TapHint stage={stage} />

          <Envelope stage={stage} onOpen={open} />

          {stage === "open" && <ActionPanel />}
        </main>

        {/* Screen-reader state announcements */}
        <p className="sr-only" role="status" aria-live="polite">
          {stage === "idle" && "Invitation sealed. Activate to open."}
          {stage === "opening" && "Opening your invitation…"}
          {stage === "open" && `Invitation opened. ${date.en}.`}
        </p>
      </div>
    </InvitationProvider>
  );
}