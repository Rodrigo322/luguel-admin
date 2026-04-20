import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "field-control h-11 w-full rounded-sm border border-[color:var(--outline-variant)] bg-shell-muted px-3 text-sm text-shell-foreground",
        "placeholder:text-shell-foreground-dim focus:border-accent focus:bg-shell-elevated focus:outline-none focus:ring-0",
        className
      )}
      {...props}
    />
  );
}
