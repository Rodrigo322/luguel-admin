import { ReportsContent } from "@/modules/reports/reports-content";

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold text-danger">Inteligencia de Denuncias</h1>
        <p className="text-shell-foreground-dim">
          Gerencie toda a fila de denuncias com filtros, paginacao e moderacao.
        </p>
      </div>
      <ReportsContent />
    </div>
  );
}
