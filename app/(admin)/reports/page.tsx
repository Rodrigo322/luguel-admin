import { ReportsContent } from "@/modules/reports/reports-content";

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold text-danger">Reports Intelligence</h1>
        <p className="text-shell-foreground-dim">Gerencie toda a fila de denuncias com filtros, paginação e moderação.</p>
      </div>
      <ReportsContent />
    </div>
  );
}
