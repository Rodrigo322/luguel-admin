import { DashboardContent } from "@/modules/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Painel</h1>
        <p className="text-shell-foreground-dim">Visao geral da plataforma, risco e moderacao.</p>
      </div>
      <DashboardContent />
    </div>
  );
}
