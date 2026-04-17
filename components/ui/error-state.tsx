interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-danger/40 bg-danger-muted/70 p-4">
      <p className="text-sm font-medium text-danger">{message}</p>
    </div>
  );
}
