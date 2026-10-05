import type { Metadata } from "next";
import AdminShell from "@/components/dashboard/AdminShell";
import ClientForm from "@/components/dashboard/ClientForm";

export const metadata: Metadata = { title: "New invitation" };
export const dynamic = "force-dynamic";

export default function NewClientPage() {
  return (
    <AdminShell
      title="New invitation"
      subtitle="Fill in the details, pick a theme, then copy the guest link."
    >
      <ClientForm />
    </AdminShell>
  );
}