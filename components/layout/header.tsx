"use client";

import { useState } from "react";
import { Bell, LogOut, RefreshCw, Search, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogout, useRefreshSession, useSession } from "@/hooks/use-session";

export function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const sessionQuery = useSession();
  const refreshMutation = useRefreshSession();
  const logoutMutation = useLogout();

  const user = sessionQuery.data?.user;

  return (
    <header className="glass sticky top-0 z-30 mb-6 rounded-2xl border border-border-subtle px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-shell-foreground-dim" />
          <Input
            placeholder="Search system signals..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-10 px-3"
            onClick={() => refreshMutation.mutate()}
            loading={refreshMutation.isPending}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-10 px-3">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="rounded-xl border border-border-subtle bg-shell-muted/70 px-3 py-2">
            <p className="text-sm font-semibold text-shell-foreground">{user?.name ?? "Admin"}</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-shell-foreground-dim">
              {user?.role ?? "ADMIN"}
            </p>
          </div>
          <Button
            variant="secondary"
            className="h-10 gap-2"
            onClick={async () => {
              await logoutMutation.mutateAsync();
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
          <div className="hidden items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 md:flex">
            <Shield className="h-3.5 w-3.5" />
            LIVE
          </div>
        </div>
      </div>
    </header>
  );
}
