"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Input } from "@/components/ui/input";
import {
  useCriticalReports,
  usePunishUser,
  useReviewReport,
  useTakeDownListing
} from "@/modules/reports/queries";
import type { ReportRecord } from "@/modules/shared/types";
import { formatDateTime } from "@/lib/utils";
import { toErrorMessage } from "@/lib/http-errors";

export function ReportsContent() {
  const reportsQuery = useCriticalReports();
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [reason, setReason] = useState("Acao moderadora administrativa.");
  const reviewMutation = useReviewReport();
  const takeDownMutation = useTakeDownListing();
  const punishMutation = usePunishUser();

  if (reportsQuery.isLoading) {
    return <LoadingState label="Carregando denuncias criticas..." />;
  }

  if (reportsQuery.isError) {
    return <ErrorState message="Falha ao carregar denuncias criticas." />;
  }

  const reports = reportsQuery.data ?? [];

  return (
    <div className="space-y-5">
      {reports.length === 0 ? (
        <EmptyState title="Nenhuma denuncia critica" description="Fila critica de reports esta vazia no momento." />
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
                  Revisar caso
                </Button>
              </Card>
            ))}
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
                    onClick={() => {
                      if (!selectedReport.listingId) {
                        return;
                      }
                      takeDownMutation.mutate({ listingId: selectedReport.listingId, reason });
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
