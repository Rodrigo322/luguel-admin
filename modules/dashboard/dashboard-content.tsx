"use client";

import { AlertTriangle, KeyRound, Users, Wallet } from "lucide-react";
import { GrowthChart } from "@/components/charts/growth-chart";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useDashboardMetrics } from "@/modules/dashboard/queries";
import { formatCompactNumber } from "@/lib/utils";

export function DashboardContent() {
  const metricsQuery = useDashboardMetrics();

  if (metricsQuery.isLoading) {
    return <LoadingState label="Carregando metricas do dashboard..." />;
  }

  if (metricsQuery.isError || !metricsQuery.data) {
    return <ErrorState message="Nao foi possivel carregar as metricas do dashboard." />;
  }

  const metrics = metricsQuery.data;

  const summary = [
    {
      icon: Users,
      label: "Total de usuarios",
      value: formatCompactNumber(metrics.totalUsers),
      tone: "text-shell-foreground"
    },
    {
      icon: KeyRound,
      label: "Total de anuncios",
      value: formatCompactNumber(metrics.totalListings),
      tone: "text-shell-foreground"
    },
    {
      icon: Wallet,
      label: "Total de locacoes",
      value: formatCompactNumber(metrics.totalRentals),
      tone: "text-shell-foreground"
    },
    {
      icon: AlertTriangle,
      label: "Denuncias ativas",
      value: formatCompactNumber(metrics.totalReports),
      tone: "text-danger"
    }
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label}>
            <div className="mb-4 flex items-start justify-between">
              <item.icon className="h-5 w-5 text-shell-foreground-dim" />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-shell-foreground-dim">{item.label}</p>
            <p className={`mt-2 text-4xl font-bold ${item.tone}`}>{item.value}</p>
          </Card>
        ))}
      </section>

      <Card>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Crescimento da Plataforma</h2>
          <p className="text-sm text-shell-foreground-dim">Metrica agregada por volume atual de usuarios e locacoes.</p>
        </div>
        <GrowthChart usersCount={metrics.totalUsers} rentalsCount={metrics.totalRentals} />
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold">Pilha de Moderacao</h3>
          <p className="mt-2 text-sm text-shell-foreground-dim">
            {metrics.pendingListings} anuncios pendentes de validacao e {metrics.highRiskListings} itens em risco elevado.
          </p>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold">Alertas de Risco</h3>
          <p className="mt-2 text-sm text-shell-foreground-dim">
            {metrics.totalReports} denuncias abertas no fluxo administrativo.
          </p>
        </Card>
      </section>
    </div>
  );
}
