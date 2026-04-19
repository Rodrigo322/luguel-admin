import { BoostContent } from "@/modules/boost/boost-content";

export default function BoostPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Gestao de Impulsionamento</h1>
        <p className="text-shell-foreground-dim">
          Monitoramento e gestao de campanhas de impulsionamento com dados reais da API.
        </p>
      </div>
      <BoostContent />
    </div>
  );
}
