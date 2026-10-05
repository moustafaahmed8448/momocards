import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminShell from "@/components/dashboard/AdminShell";
import ClientForm from "@/components/dashboard/ClientForm";
import { getRepo } from "@/lib/repo";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { id } = await params;
  const client = await getRepo().getById(id);
  return { title: client ? `Edit ${client.clientName}` : "Edit invitation" };
}

export default async function EditClientPage({ params }: RouteProps) {
  const { id } = await params;
  const client = await getRepo().getById(id);

  if (!client) notFound();

  return (
    <AdminShell
      title={client.clientName}
      subtitle={`Guest link → /i/${client.slug}`}
    >
      <ClientForm client={client} />

      <section className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
        <h2 className="mb-2 text-[11px] font-bold tracking-widest text-accent uppercase">
          Live preview
        </h2>
        <iframe
          src={`/i/${client.slug}`}
          title={`Preview of ${client.clientName}`}
          className="h-[560px] w-full rounded-xl border border-white/10 bg-black"
        />
        <p className="mt-2 text-[11px] leading-relaxed text-paper/35">
          Shows the saved version. Reopen after saving to see your edits.
        </p>
      </section>
    </AdminShell>
  );
}