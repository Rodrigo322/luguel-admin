"use client";

import { Moon, Palette, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const COLOR_TOKENS = [
  { label: "Base", variable: "--shell" },
  { label: "Elevado", variable: "--shell-elevated" },
  { label: "Suave", variable: "--shell-muted" },
  { label: "Destaque", variable: "--accent" },
  { label: "Destaque Forte", variable: "--accent-strong" },
  { label: "Sucesso", variable: "--success" },
  { label: "Aviso", variable: "--warning" },
  { label: "Perigo", variable: "--danger" }
] as const;

export function SettingsContent() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-semibold">Aparencia e Tema</h2>
            </div>
            <p className="text-sm text-shell-foreground-dim">
              Controle global de tema do painel administrativo com persistencia local.
            </p>
          </div>
          <Badge label={theme === "dark" ? "Modo Escuro" : "Modo Claro"} tone="accent" />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Button
            variant={theme === "dark" ? "primary" : "secondary"}
            onClick={() => setTheme("dark")}
            className="gap-2"
          >
            <Moon className="h-4 w-4" />
            Escuro
          </Button>
          <Button
            variant={theme === "light" ? "primary" : "secondary"}
            onClick={() => setTheme("light")}
            className="gap-2"
          >
            <Sun className="h-4 w-4" />
            Claro
          </Button>
          <Button variant="ghost" onClick={toggleTheme}>
            Alternar
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold">Paleta Global</h3>
        <p className="mb-4 mt-1 text-sm text-shell-foreground-dim">
          Tokens globais usados no dashboard para manter consistencia entre modo claro e escuro.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {COLOR_TOKENS.map((token) => (
            <div key={token.variable} className="rounded-xl border border-border-subtle bg-shell-muted/55 p-3">
              <div
                className={cn("mb-2 h-10 w-full rounded-md border border-border-subtle")}
                style={{ backgroundColor: `var(${token.variable})` }}
              />
              <p className="text-sm font-semibold text-shell-foreground">{token.label}</p>
              <p className="text-xs text-shell-foreground-dim">{token.variable}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
