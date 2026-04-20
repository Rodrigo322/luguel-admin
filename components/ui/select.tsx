import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-sm border border-[color:var(--outline-variant)] bg-shell-muted px-3 text-sm text-shell-foreground",
        "focus:border-accent focus:bg-shell-elevated focus:outline-none focus:ring-0",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
