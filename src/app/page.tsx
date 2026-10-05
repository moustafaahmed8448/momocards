import Link from "next/link";
import AdminShell from "@/components/dashboard/AdminShell";
import ClientCard from "@/components/dashboard/ClientCard";
import { getRepo } from "@/lib/repo";
import { THEME_IDS, THEMES } from "@/lib/themes";

/* Always fresh — the dashboard must never show a stale client list
   after an edit. */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const repo = getRepo();
  const clients = await repo.list();

  return (
    <AdminShell
      title="Invitations"
      subtitle={`${clients.length} ${clients.length === 1 ? "client" : "clients"} · ${repo.kind === "kv" ? "Vercel KV" : "local JSON file"}`}
      action={
        <Link
          href="/clients/new"
          className="min-h-[42px] shrink-0 rounded-xl bg-gradient-to-b from-accent-soft to-accent-deep px-4 pt-2.5 text-[13px] font-bold text-accent-ink transition-[transform,filter] hover:brightness-110 active:scale-[0.97]"
        >
          + New
        </Link>
      }
    >
      {clients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
          <p className="text-[14px] font-semibold text-paper/70">
            No invitations yet
          </p>
          <p className="max-w-xs text-[12px] leading-relaxed text-paper/40">
            Create your first invitation, pick one of the {THEME_IDS.length}{" "}
            themes, then share the guest link on WhatsApp.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      {/* Theme legend — handy reference while editing */}
      <section className="mt-8 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
        <h2 className="mb-3 text-[11px] font-bold tracking-widest text-accent uppercase">
          Available themes
        </h2>
        <ul className="flex flex-col gap-2">
          {THEME_IDS.map((id) => {
            const t = THEMES[id];
            return (
              <li key={id} className="flex items-center gap-3">
                <span className="flex h-6 w-16 shrink-0 overflow-hidden rounded ring-1 ring-white/10">
                  {t.preview.map((c) => (
                    <span
                      key={c}
                      className="flex-1"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
                <span className="text-[12px] text-paper/60">
                  {t.label} · <span dir="rtl">{t.labelAr}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </AdminShell>
  );
}