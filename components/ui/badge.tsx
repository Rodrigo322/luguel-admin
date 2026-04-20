import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "accent";
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-shell-muted text-shell-foreground-dim",
  success: "bg-[var(--success-soft)] text-success",
  warning: "bg-[var(--warning-soft)] text-warning",
  danger: "bg-[var(--danger-soft)] text-danger",
  accent: "bg-accent/16 text-accent"
};

export function Badge({ label, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        toneStyles[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
