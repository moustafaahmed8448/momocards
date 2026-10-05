import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InvitationExperience from "@/components/InvitationExperience";
import { getRepo } from "@/lib/repo";

/* Guests get a freshly-rendered page so an edit is live immediately.
   One small store read per hit — cheaper than a stale link sent to
   200 people on WhatsApp. */
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const client = await getRepo().getBySlug(slug);

  if (!client) return { title: "Invitation" };

  const title = `${client.hosts.en} · ${client.event.en}`;
  const description = `${client.date.en} · ${client.time.en} · ${client.venue.en}`;

  return {
    title,
    description,
    // Guests arrive from WhatsApp — the preview card is the first
    // thing they see, so it is indexed and rendered per client.
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "MomoCards",
      locale: "en_US",
      alternateLocale: ["ar_EG"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    appleWebApp: {
      capable: true,
      title: client.hosts.en,
      statusBarStyle: "black-translucent",
    },
  };
}

export default async function InvitationPage({ params }: RouteProps) {
  const { slug } = await params;
  const client = await getRepo().getBySlug(slug);

  if (!client) notFound();

  return <InvitationExperience content={client} theme={client.theme} />;
}