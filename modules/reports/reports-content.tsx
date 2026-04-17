"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  useReports,
  usePunishUser,
  useReviewReport,
  useTakeDownContent
} from "@/modules/reports/queries";
import type { ReportRecord, ReportStatus, RiskLevel } from "@/modules/shared/types";
import { formatDateTime } from "@/lib/utils";
import { toErrorMessage } from "@/lib/http-errors";

const PAGE_SIZE = 10;

export function ReportsContent() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [reason, setReason] = useState("Acao moderadora administrativa.");
  const reportsQuery = useReports({
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    riskLevel: riskFilter === "ALL" ? undefined : riskFilter,
    status: statusFilter === "ALL" ? undefined : statusFilter
  });
  const reviewMutation = useReviewReport();
  const takeDownMutation = useTakeDownContent();
  const punishMutation = usePunishUser();

  if (reportsQuery.isLoading) {
    return <LoadingState label="Carregando denuncias..." />;
  }

  if (reportsQuery.isError) {
    return <ErrorState message="Falha ao carregar denuncias." />;
  }

  const reports = reportsQuery.data?.reports ?? [];
  const pagination = reportsQuery.data?.pagination;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-border-subtle bg-shell-muted/50 p-4 lg:grid-cols-4">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar por texto ou ID"
        />
        <Select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as ReportStatus | "ALL");
            setPage(1);
          }}
        >
          <option value="ALL">Todos status</option>
          <option value="OPEN">OPEN</option>
          <option value="TRIAGED">TRIAGED</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="REJECTED">REJECTED</option>
        </Select>
        <Select
          value={riskFilter}
          onChange={(event) => {
            setRiskFilter(event.target.value as RiskLevel | "ALL");
            setPage(1);
          }}
        >
          <option value="ALL">Todos riscos</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </Select>
        <div className="flex items-center justify-end gap-2 text-sm text-shell-foreground-dim">
          <span>{pagination ? `${pagination.total} casos` : "0 casos"}</span>
        </div>
      </div>

      {reports.length === 0 ? (
        <EmptyState title="Nenhuma denuncia encontrada" description="Ajuste os filtros para localizar casos." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
          <div className="space-y-3">
            {reports.map((report) => (
              <Card key={report.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge label={report.riskLevel} tone={report.riskLevel === "CRITICAL" ? "danger" : "warning"} />
                  <span className="text-xs text-shell-foreground-dim">{formatDateTime(report.createdAt)}</span>
                </div>
                <h3 className="text-lg font-semibold">{report.reason}</h3>
                <p className="line-clamp-2 text-sm text-shell-foreground-dim">{report.details ?? "Sem detalhes adicionais."}</p>
                <Button variant="secondary" onClick={() => setSelectedReport(report)}>
                  Abrir caso
                </Button>
              </Card>
            ))}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-shell-muted/40 p-2">
                <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                  Anterior
                </Button>
                <span className="text-xs text-shell-foreground-dim">
                  Pagina {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Proxima
                </Button>
              </div>
            )}
          </div>
          <Card className="min-h-96">
            {!selectedReport && (
              <EmptyState
                title="Selecione uma denuncia"
                description="Clique em um caso na lista para abrir detalhes e acoes de moderacao."
              />
            )}
            {selectedReport && (
              <div className="space-y-4">
                <header>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-danger">Urgent case</p>
                  <h2 className="mt-1 text-3xl font-semibold">{selectedReport.reason}</h2>
                </header>
                <p className="text-shell-foreground-dim">{selectedReport.details ?? "Sem descricao adicional no reporte."}</p>
                <Input value={reason} onChange={(event) => setReason(event.target.value)} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="secondary"
                    loading={reviewMutation.isPending}
                    onClick={() => reviewMutation.mutate({ reportId: selectedReport.id, status: "TRIAGED", reason })}
                  >
                    Ignorar / Triar
                  </Button>
                  <Button
                    variant="danger"
                    loading={takeDownMutation.isPending}
                    disabled={!selectedReport.listingId && !selectedReport.rentalId}
                    onClick={() => {
                      if (!selectedReport.listingId && !selectedReport.rentalId) {
                        return;
                      }
                      takeDownMutation.mutate({ reportId: selectedReport.id, reason });
                    }}
                  >
                    Remover conteudo
                  </Button>
                  <Button
                    variant="danger"
                    loading={punishMutation.isPending}
                    disabled={!selectedReport.subjectUserId}
                    onClick={() => {
                      if (!selectedReport.subjectUserId) {
                        return;
                      }
                      punishMutation.mutate({ userId: selectedReport.subjectUserId, reason });
                    }}
                  >
                    Punir usuario
                  </Button>
                  <Button
                    variant="primary"
                    loading={reviewMutation.isPending}
                    onClick={() => reviewMutation.mutate({ reportId: selectedReport.id, status: "RESOLVED", reason })}
                  >
                    Resolver caso
                  </Button>
                </div>
                {(reviewMutation.isError || takeDownMutation.isError || punishMutation.isError) && (
                  <ErrorState
                    message={toErrorMessage(reviewMutation.error ?? takeDownMutation.error ?? punishMutation.error)}
                  />
                )}
                {!selectedReport.subjectUserId && (
                  <p className="text-xs text-shell-foreground-dim">
                    Nao foi possivel identificar automaticamente o usuario alvo deste reporte.
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
