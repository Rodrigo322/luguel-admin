interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="glass rounded p-8 text-center">
      <h3 className="text-lg font-semibold text-shell-foreground">{title}</h3>
      <p className="mt-2 text-sm text-shell-foreground-dim">{description}</p>
    </div>
  );
}
