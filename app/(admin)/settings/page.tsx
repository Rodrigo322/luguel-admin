import { SettingsContent } from "@/modules/settings/settings-content";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-shell-foreground-dim">Preferências visuais e operacionais globais do painel administrativo.</p>
      </div>
      <SettingsContent />
    </div>
  );
}
