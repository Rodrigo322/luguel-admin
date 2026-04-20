export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="glass flex min-h-32 items-center justify-center rounded">
      <div className="flex items-center gap-3 text-shell-foreground-dim">
        <span className="h-2.5 w-2.5 rounded-full bg-accent pulse-dot" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
