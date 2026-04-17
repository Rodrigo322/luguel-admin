import { BoostContent } from "@/modules/boost/boost-content";

export default function BoostPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Boost & Ad Management</h1>
        <p className="text-shell-foreground-dim">Controle impulsionamentos pagos e distribuicao de campanhas.</p>
      </div>
      <BoostContent />
    </div>
  );
}
