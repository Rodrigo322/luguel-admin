import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "accent";
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-shell-muted text-shell-foreground-dim border border-border-subtle",
  success: "bg-[var(--success-soft)] text-success border-[var(--success-border)] border",
  warning: "bg-[var(--warning-soft)] text-warning border-[var(--warning-border)] border",
  danger: "bg-[var(--danger-soft)] text-danger border-[var(--danger-border)] border",
  accent: "bg-accent/18 text-accent border border-accent/35"
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
