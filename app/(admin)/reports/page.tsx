import { ReportsContent } from "@/modules/reports/reports-content";

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold text-danger">Urgent Attention Required</h1>
        <p className="text-shell-foreground-dim">Gerencie denuncias criticas com resposta rapida de moderacao.</p>
      </div>
      <ReportsContent />
    </div>
  );
}
