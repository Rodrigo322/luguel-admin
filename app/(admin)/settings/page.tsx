import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-shell-foreground-dim">Configuracoes operacionais do painel administrativo.</p>
      </div>
      <Card>
        <p className="text-sm text-shell-foreground-dim">
          Ajustes de politicas e preferencias de moderacao podem ser adicionados conforme evolucao de endpoints no backend.
        </p>
      </Card>
    </div>
  );
}
