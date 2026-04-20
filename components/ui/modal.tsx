"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ title, open, onClose, children, className }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className={cn("glass w-full max-w-lg rounded p-6", className)}>
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-shell-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm px-2 py-1 text-sm text-shell-foreground-dim hover:bg-shell-muted"
          >
            Fechar
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
