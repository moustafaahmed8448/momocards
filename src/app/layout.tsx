import type { Metadata, Viewport } from "next";
import { Amiri, Cairo, Italianno } from "next/font/google";
import { themeCss } from "@/lib/themes";
import "./globals.css";

/* Self-hosted at build time → zero requests to Google Fonts
   from guests on Egyptian 3G/4G. */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const italianno = Italianno({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f0f12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

/* Per-invitation metadata is generated in /i/[slug]; this is only
   the fallback for the dashboard and the demo. */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://momocards.app",
  ),
  title: {
    default: "MomoCards — Invitations",
    template: "%s · MomoCards",
  },
  description: "Premium digital invitation cards.",
  applicationName: "MomoCards",
  robots: { index: false, follow: false },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${cairo.variable} ${italianno.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Every palette as [data-theme] blocks. ~1.5 KB of HTML,
            no JS — the guest page paints correctly before hydration. */}
        <style
          id="momocards-themes"
          dangerouslySetInnerHTML={{ __html: themeCss() }}
        />
      </head>
      <body className="relative min-h-full overflow-x-hidden">{children}</body>
    </html>
  );
}
