"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-slate-950 hover:bg-accent-strong disabled:bg-accent/60 disabled:text-slate-800",
  secondary:
    "bg-shell-muted text-shell-foreground hover:bg-shell-muted/80 border border-border-subtle disabled:opacity-60",
  danger: "bg-danger text-white hover:bg-danger/80 disabled:opacity-70",
  ghost: "bg-transparent text-shell-foreground-dim hover:bg-shell-muted/60"
};

export function Button({ className, variant = "primary", loading, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-4 font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {loading ? "Processando..." : children}
    </button>
  );
}
