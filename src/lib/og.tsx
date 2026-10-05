import { ImageResponse } from "next/og";
import type { InvitationContent } from "./types";
import { getTheme, type ThemeId } from "./themes";

/**
 * WhatsApp / SMS link preview.
 *
 * Satori does NOT support CSS custom properties, so this reads the
 * palette object directly rather than the `--m-*` variables the
 * browser page uses. Same source of truth, different renderer.
 *
 * Latin text only — the built-in font has no Arabic glyph coverage.
 */
export function invitationOg(
  content: InvitationContent,
  theme: ThemeId,
): ImageResponse {
  const p = getTheme(theme).palette;
  const { hosts, event, date, time, venue, brand } = content;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: p.bgDeep,
          backgroundImage: `radial-gradient(60% 50% at 50% 30%, ${p.glowA} 0%, rgba(0,0,0,0) 70%)`,
          padding: 64,
        }}
      >
        {/* Envelope mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 150,
            height: 150,
            borderRadius: 999,
            backgroundColor: p.seal,
            border: `3px solid ${p.accent}`,
            fontSize: 68,
            color: p.paper,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          {hosts.monogram}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: p.accent,
            marginBottom: 18,
          }}
        >
          You are invited
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: p.accentHi,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {hosts.en}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: p.accent,
            marginBottom: 40,
            letterSpacing: 2,
          }}
        >
          {event.en}
        </div>

        <div
          style={{ display: "flex", fontSize: 28, color: p.paper, marginBottom: 10 }}
        >
          {date.en} · {time.en}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: p.onPaperSoft }}>
          {venue.en}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 46,
            fontSize: 22,
            color: p.accent,
            letterSpacing: 3,
          }}
        >
          {brand.en}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}