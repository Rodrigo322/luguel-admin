import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { RiskNotificationsListener } from "@/components/layout/risk-notifications-listener";
import { SessionKeeper } from "@/components/layout/session-keeper";
import { getServerSession } from "@/lib/server-session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/login?error=admin-only");
  }

  return (
    <AdminShell>
      <RiskNotificationsListener />
      <SessionKeeper />
      {children}
    </AdminShell>
  );
}
