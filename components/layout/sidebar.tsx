"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  BarChart3,
  Megaphone,
  Rocket,
  ShieldAlert,
  Star,
  UserCog,
  Users,
  Wrench,
  ScrollText
} from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<(typeof NAV_ITEMS)[number]["href"], ComponentType<{ className?: string }>> = {
  "/dashboard": BarChart3,
  "/users": Users,
  "/listings": Megaphone,
  "/rentals": ScrollText,
  "/reviews": Star,
  "/reports": ShieldAlert,
  "/moderation": UserCog,
  "/boost": Rocket,
  "/settings": Wrench
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-shell-bg hidden fixed inset-y-0 left-0 z-40 w-72 flex-col p-5 lg:flex">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px sidebar-shimmer" />
      <div className="mb-8 rounded bg-shell-muted p-4">
        <p className="text-2xl font-bold text-shell-foreground">{APP_NAME}</p>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-shell-foreground-dim">
          Painel Administrativo
        </p>
      </div>
      <nav className="flex-1 space-y-1 pr-1">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.href];
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold transition-all",
                active ? "bg-shell-high text-accent" : "text-shell-foreground-dim hover:bg-shell-muted hover:text-shell-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
