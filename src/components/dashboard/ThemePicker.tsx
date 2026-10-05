"use client";

import { THEMES, THEME_IDS, type ThemeId } from "@/lib/themes";

interface ThemePickerProps {
  name?: string;
  defaultValue?: ThemeId;
}

/**
 * Swatches come straight from the palette object the page renders
 * with, so a swatch can never drift from the real theme.
 */
export default function ThemePicker({
  name = "theme",
  defaultValue = "royal",
}: ThemePickerProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-[11px] font-bold tracking-wide text-accent-soft/80 uppercase">
        Theme · الثيم
      </legend>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {THEME_IDS.map((id) => {
          const theme = THEMES[id];
          return (
            <label key={id} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={id}
                defaultChecked={defaultValue === id}
                className="peer sr-only"
              />
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-soft">
                <div className="flex h-8 overflow-hidden rounded-md">
                  {theme.preview.map((c) => (
                    <span
                      key={c}
                      className="flex-1"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-[11px] leading-tight font-semibold text-paper/85">
                  {theme.label}
                </span>
                <span
                  className="text-[10px] leading-tight text-paper/45"
                  dir="rtl"
                >
                  {theme.labelAr}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}