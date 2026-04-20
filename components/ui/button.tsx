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
    "bg-gradient-to-b from-accent to-accent-strong text-[var(--accent-contrast)] hover:brightness-105 disabled:opacity-70",
  secondary:
    "bg-shell-high text-shell-foreground hover:bg-shell-muted disabled:opacity-60",
  danger: "bg-danger text-white hover:bg-danger/80 disabled:opacity-70",
  ghost: "bg-transparent text-accent-strong hover:bg-shell-muted/70"
};

export function Button({ className, variant = "primary", loading, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded px-4 text-sm font-semibold transition-colors",
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
