"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useListings, useSuspendListing } from "@/modules/listings/queries";
import { useCriticalReports, useReviewReport } from "@/modules/reports/queries";
import { toErrorMessage } from "@/lib/http-errors";

export function ModerationContent() {
  const pendingListingsQuery = useListings("PENDING_VALIDATION");
  const criticalReportsQuery = useCriticalReports();
  const suspendMutation = useSuspendListing();
  const reviewMutation = useReviewReport();

  if (pendingListingsQuery.isLoading || criticalReportsQuery.isLoading) {
    return <LoadingState label="Montando fila de moderacao..." />;
  }

  if (pendingListingsQuery.isError || criticalReportsQuery.isError) {
    return <ErrorState message="Nao foi possivel carregar fila de moderacao." />;
  }

  const pendingListings = pendingListingsQuery.data ?? [];
  const criticalReports = criticalReportsQuery.data ?? [];

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
          <h2 className="text-2xl font-semibold">Suspicious Listings</h2>
          <Badge label={`${pendingListings.length} pendentes`} tone="warning" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {pendingListings.map((listing) => (
            <div key={listing.id} className="rounded-xl border border-danger/35 bg-danger-muted/40 p-4">
              <p className="font-semibold">{listing.title}</p>
              <p className="line-clamp-2 text-sm text-shell-foreground-dim">{listing.description}</p>
              <div className="mt-3 flex gap-2">
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
          <h2 className="text-2xl font-semibold">Critical Reports</h2>
          <Badge label={`${criticalReports.length} criticas`} tone="danger" />
        </div>
        <div className="space-y-3">
          {criticalReports.map((report) => (
            <div key={report.id} className="rounded-xl border border-border-subtle bg-shell-muted/55 p-4">
              <p className="font-semibold">{report.reason}</p>
              <p className="text-sm text-shell-foreground-dim">{report.details ?? "Sem detalhes adicionais."}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => reviewMutation.mutate({ reportId: report.id, status: "TRIAGED", reason: "Ignorado" })}
                >
                  Aprovar
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    reviewMutation.mutate({ reportId: report.id, status: "REJECTED", reason: "Conteudo reprovado" })
                  }
                >
                  Bloquear
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {(suspendMutation.isError || reviewMutation.isError) && (
        <ErrorState message={toErrorMessage(suspendMutation.error ?? reviewMutation.error)} />
      )}
    </div>
  );
}
