"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useApproveListing, useListings, useSuspendListing } from "@/modules/listings/queries";
import { useCriticalReports, usePunishUser, useReviewReport, useTakeDownContent } from "@/modules/reports/queries";
import { formatRiskLevel } from "@/modules/shared/labels";
import { useUsers } from "@/modules/users/queries";
import { toErrorMessage } from "@/lib/http-errors";

export function ModerationContent() {
  const pendingListingsQuery = useListings("PENDING_VALIDATION");
  const criticalReportsQuery = useCriticalReports();
  const usersQuery = useUsers();
  const approveMutation = useApproveListing();
  const suspendMutation = useSuspendListing();
  const reviewMutation = useReviewReport();
  const takeDownMutation = useTakeDownContent();
  const punishMutation = usePunishUser();
  const pendingListings = pendingListingsQuery.data ?? [];
  const criticalReports = criticalReportsQuery.data ?? [];

  const usersById = useMemo(() => {
    return new Map((usersQuery.data ?? []).map((user) => [user.id, user]));
  }, [usersQuery.data]);

  const suspiciousUsers = useMemo(() => {
    const reportCountByUser = new Map<string, number>();

    for (const report of criticalReportsQuery.data ?? []) {
      if (!report.subjectUserId) {
        continue;
      }

      reportCountByUser.set(report.subjectUserId, (reportCountByUser.get(report.subjectUserId) ?? 0) + 1);
    }

    return Array.from(reportCountByUser.entries())
      .map(([userId, reportCount]) => ({
        userId,
        reportCount,
        user: usersById.get(userId)
      }))
      .sort((left, right) => right.reportCount - left.reportCount);
  }, [criticalReportsQuery.data, usersById]);

  if (pendingListingsQuery.isLoading || criticalReportsQuery.isLoading) {
    return <LoadingState label="Montando fila de moderacao..." />;
  }

  if (pendingListingsQuery.isError || criticalReportsQuery.isError) {
    return <ErrorState message="Nao foi possivel carregar fila de moderacao." />;
  }

  if (pendingListings.length === 0 && criticalReports.length === 0) {
    return (
      <EmptyState
        title="Fila de moderacao vazia"
        description="Nenhum anuncio suspeito ou denuncia critica pendente no momento."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Anuncios Suspeitos</h2>
          <Badge label={`${pendingListings.length} pendentes`} tone="warning" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {pendingListings.map((listing) => (
            <div key={listing.id} className="rounded bg-danger-muted/75 p-4">
              <p className="font-semibold">{listing.title}</p>
              <p className="line-clamp-2 text-sm text-shell-foreground-dim">{listing.description}</p>
              <p className="mt-2 text-xs text-shell-foreground-dim">Risco: {formatRiskLevel(listing.riskLevel)}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="primary"
                  loading={approveMutation.isPending}
                  onClick={() => approveMutation.mutate(listing.id)}
                >
                  Aprovar anuncio
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    reviewMutation.mutate({
                      reportId: criticalReports.find((report) => report.listingId === listing.id)?.id ?? "",
                      status: "TRIAGED",
                      reason: "Revisao inicial de risco"
                    });
                  }}
                  disabled={!criticalReports.some((report) => report.listingId === listing.id)}
                >
                  Aprovar triagem
                </Button>
                <Button
                  variant="danger"
                  loading={suspendMutation.isPending}
                  onClick={() => suspendMutation.mutate({ listingId: listing.id, reason: "Risco elevado detectado." })}
                >
                  Bloquear anuncio
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Denuncias Criticas</h2>
          <Badge label={`${criticalReports.length} criticas`} tone="danger" />
        </div>
        <div className="space-y-3">
          {criticalReports.map((report) => (
            <div key={report.id} className="rounded bg-shell-muted p-4">
              <p className="font-semibold">{report.reason}</p>
              <p className="text-sm text-shell-foreground-dim">{report.details ?? "Sem detalhes adicionais."}</p>
              <p className="mt-2 text-xs text-shell-foreground-dim">
                Alvo: {report.subjectUserId ?? "nao identificado"} | Risco: {formatRiskLevel(report.riskLevel)}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  loading={reviewMutation.isPending}
                  onClick={() => reviewMutation.mutate({ reportId: report.id, status: "TRIAGED", reason: "Ignorado" })}
                >
                  Aprovar
                </Button>
                <Button
                  variant="danger"
                  loading={takeDownMutation.isPending}
                  disabled={!report.listingId && !report.rentalId}
                  onClick={() => {
                    if (!report.listingId && !report.rentalId) {
                      return;
                    }

                    takeDownMutation.mutate({
                      reportId: report.id,
                      reason: "Conteudo bloqueado pela moderacao."
                    });
                  }}
                >
                  Bloquear
                </Button>
                <Button
                  variant="danger"
                  loading={punishMutation.isPending}
                  disabled={!report.subjectUserId}
                  onClick={() => {
                    if (!report.subjectUserId) {
                      return;
                    }

                    punishMutation.mutate({
                      userId: report.subjectUserId,
                      reason: "Usuario banido por risco critico recorrente."
                    });
                  }}
                >
                  Banir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Usuarios Suspeitos</h2>
          <Badge label={`${suspiciousUsers.length} monitorados`} tone="warning" />
        </div>
        {suspiciousUsers.length === 0 ? (
          <p className="text-sm text-shell-foreground-dim">Nenhum usuario suspeito identificado em denuncias criticas.</p>
        ) : (
          <div className="space-y-3">
            {suspiciousUsers.map((entry) => (
              <div key={entry.userId} className="rounded bg-shell-muted p-4">
                <p className="font-semibold">{entry.user?.name ?? entry.userId}</p>
                <p className="text-sm text-shell-foreground-dim">{entry.user?.email ?? "Email nao disponivel"}</p>
                <p className="mt-2 text-xs text-shell-foreground-dim">{entry.reportCount} denuncia(s) critica(s)</p>
                <div className="mt-3">
                  <Button
                    variant="danger"
                    loading={punishMutation.isPending}
                    onClick={() =>
                      punishMutation.mutate({
                        userId: entry.userId,
                        reason: "Usuario banido por padrao de risco critico."
                      })
                    }
                  >
                    Banir usuario
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {(approveMutation.isError ||
        suspendMutation.isError ||
        reviewMutation.isError ||
        takeDownMutation.isError ||
        punishMutation.isError) && (
        <ErrorState
          message={toErrorMessage(
            approveMutation.error ??
              suspendMutation.error ??
              reviewMutation.error ??
              takeDownMutation.error ??
              punishMutation.error
          )}
        />
      )}
    </div>
  );
}
