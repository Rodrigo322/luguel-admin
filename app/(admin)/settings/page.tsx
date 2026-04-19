import { SettingsContent } from "@/modules/settings/settings-content";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Configuracoes</h1>
        <p className="text-shell-foreground-dim">
          Preferencias visuais e operacionais globais do painel administrativo.
        </p>
      </div>
      <SettingsContent />
    </div>
  );
}
