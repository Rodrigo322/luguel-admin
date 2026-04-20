interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded bg-danger-muted p-4">
      <p className="text-sm font-medium text-danger">{message}</p>
    </div>
  );
}
