/**
 * ------------------------------------------------------------
 *  MOMOCARDS · THEME PALETTES — single source of truth
 *
 *  Consumed by THREE places, which is why it lives in TS and not
 *  in globals.css:
 *    1. `themeCss()`      → injected as `[data-theme]` CSS blocks
 *    2. the dashboard     → renders the picker's swatches
 *    3. opengraph-image   → Satori needs literal hex; CSS vars
 *                           are NOT supported there
 *
 *  Adding a token here automatically flows to all three.
 * ─────────────────────────────────────────────────────────────
 */

export const THEME_IDS = ["royal", "eucalyptus", "rose", "sapphire"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemePalette {
  /* backdrop */
  bgDeep: string;
  bgInk: string;
  bgRaised: string;
  bgLine: string;
  /* ambient glows */
  glowA: string;
  glowB: string;
  /* accent — the metallic / brand colour */
  accentHi: string;
  accentSoft: string;
  accent: string;
  accentDeep: string;
  /** text rendered ON an accent-filled surface */
  accentInk: string;
  /* wax seal */
  sealHi: string;
  seal: string;
  sealDeep: string;
  /* paper stock */
  paperHi: string;
  paper: string;
  paperShade: string;
  paperDeep: string;
  /* text on paper */
  onPaper: string;
  onPaperSoft: string;
  /* fine details */
  crease: string;
  hairline: string;
  lining: string;
  qrFg: string;
}

export interface Theme {
  id: ThemeId;
  label: string;
  labelAr: string;
  /** shown in the dashboard picker */
  preview: [string, string, string];
  palette: ThemePalette;
}

export const THEMES: Record<ThemeId, Theme> = {
  royal: {
    id: "royal",
    label: "Royal Gold",
    labelAr: "ذهبي ملكي",
    preview: ["#0f0f12", "#d4af37", "#9b1b30"],
    palette: {
      bgDeep: "#0f0f12", bgInk: "#08080a", bgRaised: "#17171c", bgLine: "#26262e",
      glowA: "rgba(201,162,39,0.13)", glowB: "rgba(155,27,48,0.10)",
      accentHi: "#fbf3d8", accentSoft: "#f4e5b0", accent: "#d4af37",
      accentDeep: "#a8841b", accentInk: "#1a1408",
      sealHi: "#d1475c", seal: "#b8263c", sealDeep: "#6d0f1f",
      paperHi: "#fffdf7", paper: "#fbf7ec", paperShade: "#f1e8d5", paperDeep: "#ded0b4",
      onPaper: "#3b3227", onPaperSoft: "#6e6150",
      crease: "rgba(110,90,55,0.16)", hairline: "rgba(168,132,27,0.42)",
      lining: "#4a0914", qrFg: "#0f0f12",
    },
  },
  eucalyptus: {
    id: "eucalyptus",
    label: "Eucalyptus",
    labelAr: "أوكالبتوس",
    preview: ["#0b1210", "#8fb89a", "#2f5d50"],
    palette: {
      bgDeep: "#0b1210", bgInk: "#050a08", bgRaised: "#131c18", bgLine: "#22302a",
      glowA: "rgba(143,184,154,0.13)", glowB: "rgba(47,93,80,0.12)",
      accentHi: "#e8f2e4", accentSoft: "#cfe3c6", accent: "#8fb89a",
      accentDeep: "#5e8a6b", accentInk: "#0b1510",
      sealHi: "#7fae94", seal: "#2f5d50", sealDeep: "#1b3a31",
      paperHi: "#fbfdf9", paper: "#f2f5ee", paperShade: "#e6ece0", paperDeep: "#cfdac9",
      onPaper: "#2b3a30", onPaperSoft: "#5c6f61",
      crease: "rgba(70,100,80,0.16)", hairline: "rgba(143,184,154,0.42)",
      lining: "#14332a", qrFg: "#0b1210",
    },
  },
  rose: {
    id: "rose",
    label: "Rose Quartz",
    labelAr: "وردة الكوارتز",
    preview: ["#14090f", "#e0a3a0", "#a4515f"],
    palette: {
      bgDeep: "#14090f", bgInk: "#0a0407", bgRaised: "#1d1017", bgLine: "#2e1b24",
      glowA: "rgba(224,163,160,0.13)", glowB: "rgba(164,81,95,0.12)",
      accentHi: "#fbeaea", accentSoft: "#f0cfcc", accent: "#e0a3a0",
      accentDeep: "#b87a79", accentInk: "#2a0f14",
      sealHi: "#d9889a", seal: "#a4515f", sealDeep: "#6d2b38",
      paperHi: "#fffdfd", paper: "#fdf4f2", paperShade: "#f5e4e2", paperDeep: "#e6ccc9",
      onPaper: "#4a2b30", onPaperSoft: "#83605f",
      crease: "rgba(140,100,100,0.16)", hairline: "rgba(224,163,160,0.42)",
      lining: "#4a1622", qrFg: "#14090f",
    },
  },
  sapphire: {
    id: "sapphire",
    label: "Midnight Sapphire",
    labelAr: "أزرق ليلي",
    preview: ["#080c18", "#c8d2e0", "#2a3f6b"],
    palette: {
      bgDeep: "#080c18", bgInk: "#04060d", bgRaised: "#101724", bgLine: "#1e2a3d",
      glowA: "rgba(200,210,224,0.12)", glowB: "rgba(42,63,107,0.14)",
      accentHi: "#f2f6fb", accentSoft: "#dbe4f0", accent: "#c8d2e0",
      accentDeep: "#8fa0b8", accentInk: "#0a101c",
      sealHi: "#6d86b8", seal: "#2a3f6b", sealDeep: "#17243f",
      paperHi: "#ffffff", paper: "#f4f7fb", paperShade: "#e6ecf4", paperDeep: "#ced8e6",
      onPaper: "#1e2a3d", onPaperSoft: "#56637a",
      crease: "rgba(90,105,130,0.16)", hairline: "rgba(200,210,224,0.42)",
      lining: "#101c33", qrFg: "#080c18",
    },
  },
};

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && (THEME_IDS as readonly string[]).includes(v);
}

export function getTheme(id: ThemeId): Theme {
  return THEMES[id] ?? THEMES.royal;
}

/** `bgDeep` → `--m-bg-deep` */
function cssVar(key: string): string {
  return `--m-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
}

/**
 * Serialises every palette into `[data-theme="<id>"]{…}` blocks.
 * Injected once in the root layout — ~1.5 KB of HTML, no JS,
 * and the guest page paints correctly before hydration.
 */
export function themeCss(): string {
  return THEME_IDS.map((id) => {
    const entries = Object.entries(THEMES[id].palette)
      .map(([k, v]) => `${cssVar(k)}:${v}`)
      .join(";");
    return `[data-theme="${id}"]{${entries}}`;
  }).join("");
}
