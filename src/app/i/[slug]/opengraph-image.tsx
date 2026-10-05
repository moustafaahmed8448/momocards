import { invitationOg } from "@/lib/og";
import { getRepo } from "@/lib/repo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "Digital invitation";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getRepo().getBySlug(slug);
  if (!client) {
    /* Fall back to a branded card rather than a broken image. */
    return invitationOg(
      {
        hosts: { ar: "", en: "MomoCards", monogram: "M" },
        event: { ar: "", en: "Invitation" },
        body: { ar: "", en: "" },
        date: { ar: "", en: "", iso: "" },
        time: { ar: "", en: "" },
        venue: { ar: "", en: "" },
        location: { lat: 0, lng: 0 },
        pass: { code: "", url: "", hint: { ar: "", en: "" } },
        brand: { ar: "", en: "Designed by MomoCards" },
      },
      "royal",
    );
  }

  return invitationOg(client, client.theme);
}