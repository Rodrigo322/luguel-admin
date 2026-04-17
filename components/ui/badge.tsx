import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "accent";
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-shell-muted text-shell-foreground-dim border border-border-subtle",
  success: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30",
  warning: "bg-amber-500/15 text-amber-200 border border-amber-300/30",
  danger: "bg-danger-muted text-danger border border-danger/40",
  accent: "bg-accent/20 text-indigo-200 border border-indigo-300/30"
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
