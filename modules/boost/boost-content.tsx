"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, BarChart3, Plus, Rocket, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/ui/table";
import { createBoostSchema, type CreateBoostSchema } from "@/schemas/boost-schemas";
import { useBoostList, useCreateBoost } from "@/modules/boost/queries";
import { useListings } from "@/modules/listings/queries";
import { useDashboardMetrics } from "@/modules/dashboard/queries";
import { toErrorMessage } from "@/lib/http-errors";
import { formatCompactNumber, formatCurrency, formatDateTime } from "@/lib/utils";

type BoostStatusFilter = "ALL" | "PENDING" | "PAID" | "ACTIVE" | "EXPIRED" | "CANCELED";
type SortMode = "NEWEST" | "AMOUNT_DESC" | "EFFICIENCY" | "ENDS_SOON";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const REFERENCE_NOW_MS = Date.now();

function toneByStatus(status: BoostStatusFilter): "default" | "success" | "warning" | "danger" | "accent" {
  if (status === "ACTIVE") {
    return "success";
  }

  if (status === "PENDING" || status === "PAID") {
    return "warning";
  }

  if (status === "EXPIRED" || status === "CANCELED") {
    return "danger";
  }

  return "default";
}

function labelByBoostStatus(status: BoostStatusFilter): string {
  if (status === "ACTIVE") return "Ativo";
  if (status === "PENDING") return "Pendente";
  if (status === "PAID") return "Pago";
  if (status === "EXPIRED") return "Expirado";
  if (status === "CANCELED") return "Cancelado";
  return "Todos";
}

export function BoostContent() {
  const [statusFilter, setStatusFilter] = useState<BoostStatusFilter>("ALL");
  const [sortMode, setSortMode] = useState<SortMode>("EFFICIENCY");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const boostListQuery = useBoostList();
  const listingsQuery = useListings();
  const dashboardQuery = useDashboardMetrics();
  const createBoostMutation = useCreateBoost();

  const form = useForm<CreateBoostSchema>({
    resolver: zodResolver(createBoostSchema),
    defaultValues: {
      listingId: "",
      amount: 0,
      days: 7,
      paymentConfirmed: true
    }
  });

  const listingMap = useMemo(
    () => new Map((listingsQuery.data ?? []).map((listing) => [listing.id, listing])),
    [listingsQuery.data]
  );

  const activeListings = useMemo(
    () => (listingsQuery.data ?? []).filter((listing) => listing.status === "ACTIVE"),
    [listingsQuery.data]
  );

  useEffect(() => {
    const currentListingId = form.getValues("listingId");
    if (!currentListingId && activeListings.length > 0) {
      form.setValue("listingId", activeListings[0].id, { shouldValidate: true });
    }
  }, [activeListings, form]);

  const enrichedBoosts = useMemo(() => {
    const rawBoosts = boostListQuery.data ?? [];

    return rawBoosts.map((boost) => {
      const listing = listingMap.get(boost.listingId);
      const startsAtMs = new Date(boost.startsAt).getTime();
      const endsAtMs = new Date(boost.endsAt).getTime();
      const durationDays = Math.max(1, Math.ceil((endsAtMs - startsAtMs) / DAY_IN_MS));
      const remainingDays = Math.ceil((endsAtMs - REFERENCE_NOW_MS) / DAY_IN_MS);
      const dailyBudget = boost.amount / durationDays;
      const isEndingSoon = boost.status === "ACTIVE" && remainingDays <= 3;

      return {
        ...boost,
        listingTitle: listing?.title ?? `Anuncio ${boost.listingId.slice(0, 8)}`,
        listingRisk: listing?.riskLevel,
        durationDays,
        remainingDays,
        dailyBudget,
        isEndingSoon
      };
    });
  }, [boostListQuery.data, listingMap]);

  const visibleBoosts = useMemo(() => {
    const base =
      statusFilter === "ALL"
        ? enrichedBoosts
        : enrichedBoosts.filter((boost) => boost.status === statusFilter);

    return [...base].sort((left, right) => {
      if (sortMode === "AMOUNT_DESC") return right.amount - left.amount;
      if (sortMode === "NEWEST") return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      if (sortMode === "ENDS_SOON") return left.remainingDays - right.remainingDays;
      return right.dailyBudget - left.dailyBudget;
    });
  }, [enrichedBoosts, sortMode, statusFilter]);

  const summary = useMemo(() => {
    const totalAmount = enrichedBoosts.reduce((total, boost) => total + boost.amount, 0);
    const activeCount = enrichedBoosts.filter((boost) => boost.status === "ACTIVE").length;
    const endingSoonCount = enrichedBoosts.filter((boost) => boost.isEndingSoon).length;
    const expiredCount = enrichedBoosts.filter((boost) => boost.status === "EXPIRED").length;
    const averageDuration =
      enrichedBoosts.length === 0
        ? 0
        : enrichedBoosts.reduce((total, boost) => total + boost.durationDays, 0) / enrichedBoosts.length;
    const projectedMonthlyBudget = enrichedBoosts
      .filter((boost) => boost.status === "ACTIVE")
      .reduce((total, boost) => total + boost.dailyBudget * 30, 0);
    const boostedListings = new Set(enrichedBoosts.map((boost) => boost.listingId)).size;

    return {
      totalAmount,
      activeCount,
      endingSoonCount,
      expiredCount,
      averageDuration,
      projectedMonthlyBudget,
      boostedListings
    };
  }, [enrichedBoosts]);

  const topCampaign = useMemo(
    () => [...enrichedBoosts].sort((left, right) => right.amount - left.amount)[0] ?? null,
    [enrichedBoosts]
  );

  const onSubmit = form.handleSubmit(async (values) => {
    await createBoostMutation.mutateAsync(values);
    form.reset({
      listingId: activeListings[0]?.id ?? "",
      amount: 0,
      days: 7,
      paymentConfirmed: true
    });
    setIsCreateModalOpen(false);
  });

  if (boostListQuery.isLoading || listingsQuery.isLoading || dashboardQuery.isLoading) {
    return <LoadingState label="Carregando campanhas de impulsionamento..." />;
  }

  if (boostListQuery.isError) {
    return <ErrorState message={toErrorMessage(boostListQuery.error)} />;
  }

  const listingsTotal = listingsQuery.data?.length ?? 0;
  const coverageRate = listingsTotal === 0 ? 0 : (summary.boostedListings / listingsTotal) * 100;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-shell-foreground-dim">Investimento total</p>
          <p className="mt-2 text-4xl font-bold">{formatCompactNumber(summary.totalAmount)}</p>
          <p className="mt-2 text-sm text-shell-foreground-dim">
            {summary.boostedListings} anuncios impulsionados ate agora.
          </p>
        </Card>
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-shell-foreground-dim">Campanhas ativas</p>
          <p className="mt-2 text-4xl font-bold text-success">{summary.activeCount}</p>
          <p className="mt-2 text-sm text-shell-foreground-dim">
            {dashboardQuery.data?.activeBoosts ?? summary.activeCount} ativo(s) reportado(s) pela API de metricas.
          </p>
        </Card>
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-shell-foreground-dim">Renovacao urgente</p>
          <p className="mt-2 text-4xl font-bold text-warning">{summary.endingSoonCount}</p>
          <p className="mt-2 text-sm text-shell-foreground-dim">Campanhas ativas que encerram em ate 3 dias.</p>
        </Card>
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-shell-foreground-dim">
            Orcamento mensal projetado
          </p>
          <p className="mt-2 text-4xl font-bold text-accent">{formatCompactNumber(summary.projectedMonthlyBudget)}</p>
          <p className="mt-2 text-sm text-shell-foreground-dim">Baseado no custo diario atual das campanhas ativas.</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Campanhas de Inventario</h2>
              <p className="text-sm text-shell-foreground-dim">Monitoramento em tempo real de boosts criados no backend.</p>
            </div>
            <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar Impulsionamento
            </Button>
          </div>

          <div className="mb-3 grid gap-2 md:grid-cols-2">
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as BoostStatusFilter)}>
              <option value="ALL">Situacao: Todos</option>
              <option value="ACTIVE">Ativo</option>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="EXPIRED">Expirado</option>
              <option value="CANCELED">Cancelado</option>
            </Select>
            <Select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
              <option value="EFFICIENCY">Ordenar: Eficiencia</option>
              <option value="AMOUNT_DESC">Ordenar: Maior investimento</option>
              <option value="ENDS_SOON">Ordenar: Encerra primeiro</option>
              <option value="NEWEST">Ordenar: Mais recente</option>
            </Select>
          </div>

          {visibleBoosts.length === 0 ? (
            <EmptyState
              title="Sem campanhas para este filtro"
              description="Ajuste os filtros ou crie um novo impulsionamento para comecar."
            />
          ) : (
            <DataTable columns={["Anuncio", "Situacao", "Investimento", "Periodo", "Eficiencia", "Risco"]} className="overflow-x-auto">
              {visibleBoosts.map((boost) => (
                <tr key={boost.id} className="border-t border-border-subtle bg-shell-elevated/45">
                  <td className="px-4 py-3 align-top">
                    <p className="font-semibold">{boost.listingTitle}</p>
                    <p className="font-mono text-xs text-shell-foreground-dim">{boost.listingId}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Badge label={labelByBoostStatus(boost.status)} tone={toneByStatus(boost.status)} />
                    {boost.isEndingSoon && <Badge label="ENCERRA EM BREVE" tone="warning" className="ml-2" />}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-semibold">{formatCurrency(boost.amount)}</p>
                    <p className="text-xs text-shell-foreground-dim">{formatCurrency(boost.dailyBudget)}/dia</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm">{formatDateTime(boost.startsAt)}</p>
                    <p className="text-sm text-shell-foreground-dim">ate {formatDateTime(boost.endsAt)}</p>
                    <p className="mt-1 text-xs text-shell-foreground-dim">
                      {boost.remainingDays >= 0 ? `${boost.remainingDays} dia(s) restante(s)` : "Encerrado"}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-semibold">{boost.durationDays} dias</p>
                    <p className="text-xs text-shell-foreground-dim">Ciclo medio: {summary.averageDuration.toFixed(1)} dias</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {boost.listingRisk ? (
                      <Badge
                        label={boost.listingRisk}
                        tone={boost.listingRisk === "HIGH" || boost.listingRisk === "CRITICAL" ? "danger" : "default"}
                      />
                    ) : (
                      <span className="text-xs text-shell-foreground-dim">Sem sinalizacao</span>
                    )}
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <h3 className="text-xl font-semibold">Resumo de Performance</h3>
            </div>
            <p className="text-sm text-shell-foreground-dim">
              Cobertura atual de campanhas: {coverageRate.toFixed(1)}% dos anuncios cadastrados.
            </p>
            <div className="mt-3 h-2 rounded-full bg-shell-muted">
              <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${Math.max(4, Math.min(coverageRate, 100))}%` }} />
            </div>
            <p className="mt-2 text-xs text-shell-foreground-dim">
              {summary.boostedListings} de {listingsTotal} anuncios com impulsionamento.
            </p>
          </Card>

          <Card>
            <div className="mb-2 flex items-center gap-2">
              <Rocket className="h-4 w-4 text-accent" />
              <h3 className="text-xl font-semibold">Campanha de Maior Investimento</h3>
            </div>
            {topCampaign ? (
              <div className="space-y-1">
                <p className="font-semibold">{topCampaign.listingTitle}</p>
                <p className="text-sm text-shell-foreground-dim">{formatCurrency(topCampaign.amount)} investido</p>
                <p className="text-sm text-shell-foreground-dim">
                  Situacao atual: <span className="font-semibold text-shell-foreground">{labelByBoostStatus(topCampaign.status)}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-shell-foreground-dim">Nenhuma campanha criada ate o momento.</p>
            )}
          </Card>

          <Card>
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="text-xl font-semibold">Pressao de Renovacao</h3>
            </div>
            <p className="text-sm text-shell-foreground-dim">
              {summary.endingSoonCount} campanha(s) proxima(s) do encerramento e {summary.expiredCount} expirada(s).
            </p>
          </Card>

          <Card>
            <div className="mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-shell-foreground-dim" />
              <h3 className="text-xl font-semibold">Impacto em Comissoes</h3>
            </div>
            <p className="text-sm text-shell-foreground-dim">Receita de comissao no backend:</p>
            <p className="mt-1 text-2xl font-bold text-accent">{formatCurrency(dashboardQuery.data?.totalCommissionRevenue ?? 0)}</p>
          </Card>
        </div>
      </section>

      <Modal title="Criar Impulsionamento" open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-shell-foreground-dim">Anuncio</label>
            <Input placeholder="ID do anuncio" list="listing-options" {...form.register("listingId")} />
            <datalist id="listing-options">
              {activeListings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.title}
                </option>
              ))}
            </datalist>
            {form.formState.errors.listingId && <p className="mt-1 text-xs text-danger">{form.formState.errors.listingId.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-shell-foreground-dim">Investimento (R$)</label>
              <Input type="number" step="0.01" {...form.register("amount", { valueAsNumber: true })} />
              {form.formState.errors.amount && <p className="mt-1 text-xs text-danger">{form.formState.errors.amount.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-shell-foreground-dim">Dias de duracao</label>
              <Input type="number" {...form.register("days", { valueAsNumber: true })} />
              {form.formState.errors.days && <p className="mt-1 text-xs text-danger">{form.formState.errors.days.message}</p>}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-shell-foreground-dim">
            <input type="checkbox" {...form.register("paymentConfirmed")} className="h-4 w-4 rounded border-border-subtle" />
            Pagamento confirmado
          </label>
          <div className="flex justify-end">
            <Button type="submit" loading={createBoostMutation.isPending}>
              Criar impulsionamento
            </Button>
          </div>
          {createBoostMutation.isError && <ErrorState message={toErrorMessage(createBoostMutation.error)} />}
        </form>
      </Modal>
    </div>
  );
}
