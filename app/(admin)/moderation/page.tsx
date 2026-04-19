import { ModerationContent } from "@/modules/admin/moderation-content";

export default function ModerationPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Fila de Moderacao</h1>
        <p className="text-shell-foreground-dim">Fila central de risco e intervencoes administrativas.</p>
      </div>
      <ModerationContent />
    </div>
  );
}
