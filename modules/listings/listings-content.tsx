"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import {
  useApproveListing,
  useArchiveListingByAdmin,
  useListings,
  useRejectListing,
  useSuspendListing
} from "@/modules/listings/queries";
import type { ListingRecord, ListingStatus } from "@/modules/shared/types";
import { formatListingStatus, formatRiskLevel } from "@/modules/shared/labels";
import { toErrorMessage } from "@/lib/http-errors";
import { formatCurrency } from "@/lib/utils";

function listingBadgeTone(status: ListingStatus): "default" | "success" | "warning" | "danger" | "accent" {
  if (status === "ACTIVE") {
    return "success";
  }

  if (status === "PENDING_VALIDATION") {
    return "warning";
  }

  if (status === "SUSPENDED" || status === "ARCHIVED") {
    return "danger";
  }

  return "accent";
}

export function ListingsContent() {
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "ALL">("ALL");
  const [selectedListing, setSelectedListing] = useState<ListingRecord | null>(null);
  const [reason, setReason] = useState("Moderacao administrativa.");
  const listingsQuery = useListings(statusFilter === "ALL" ? undefined : statusFilter);
  const suspendMutation = useSuspendListing();
  const archiveMutation = useArchiveListingByAdmin();
  const approveMutation = useApproveListing();
  const rejectMutation = useRejectListing();

  const listings = useMemo(() => listingsQuery.data ?? [], [listingsQuery.data]);

  if (listingsQuery.isLoading) {
    return <LoadingState label="Carregando anuncios..." />;
  }

  if (listingsQuery.isError) {
    return <ErrorState message="Falha ao carregar anuncios." />;
  }

  return (
    <div className="space-y-5">
      <div className="glass flex flex-wrap items-center gap-3 rounded p-4">
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as ListingStatus | "ALL")}
          className="max-w-xs"
        >
          <option value="ALL">Todos</option>
          <option value="ACTIVE">Ativo</option>
          <option value="PENDING_VALIDATION">Pendente</option>
          <option value="SUSPENDED">Bloqueado</option>
        </Select>
        <Badge label={`${listings.length} anuncios`} tone="accent" />
      </div>

      {listings.length === 0 ? (
        <EmptyState title="Sem anuncios" description="Nao ha anuncios para o filtro selecionado." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge label={formatListingStatus(listing.status)} tone={listingBadgeTone(listing.status)} />
                <Badge
                  label={`RISCO ${formatRiskLevel(listing.riskLevel)}`}
                  tone={listing.riskLevel === "CRITICAL" || listing.riskLevel === "HIGH" ? "danger" : "default"}
                />
              </div>
              <h3 className="text-xl font-semibold">{listing.title}</h3>
              <p className="line-clamp-3 text-sm text-shell-foreground-dim">{listing.description}</p>
              <p className="text-lg font-bold text-accent">{formatCurrency(listing.dailyPrice)}/dia</p>
              <Button variant="secondary" onClick={() => setSelectedListing(listing)}>
                Ver detalhes
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={selectedListing ? `Gestao de anuncio: ${selectedListing.title}` : "Gestao de anuncio"}
        open={Boolean(selectedListing)}
        onClose={() => setSelectedListing(null)}
      >
        {selectedListing && (
          <div className="space-y-4">
            <div className="rounded-sm bg-shell-muted p-3">
              <p className="text-sm text-shell-foreground-dim">Descricao completa</p>
              <p className="mt-2 text-sm">{selectedListing.description}</p>
            </div>
            <Input value={reason} onChange={(event) => setReason(event.target.value)} />
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                variant="primary"
                loading={approveMutation.isPending}
                onClick={() => {
                  approveMutation.mutate(selectedListing.id);
                }}
              >
                Aprovar
              </Button>
              <Button
                variant="secondary"
                loading={rejectMutation.isPending}
                onClick={() => {
                  rejectMutation.mutate({
                    listingId: selectedListing.id,
                    reason
                  });
                }}
              >
                Reprovar
              </Button>
              <Button
                variant="danger"
                loading={suspendMutation.isPending}
                onClick={() => {
                  suspendMutation.mutate({
                    listingId: selectedListing.id,
                    reason
                  });
                }}
              >
                Bloquear
              </Button>
              <Button
                variant="danger"
                loading={archiveMutation.isPending}
                onClick={() => {
                  archiveMutation.mutate({
                    listingId: selectedListing.id,
                    reason
                  });
                }}
              >
                Remover
              </Button>
            </div>
            {(approveMutation.isError || rejectMutation.isError) && (
              <ErrorState
                message={toErrorMessage(approveMutation.error ?? rejectMutation.error)}
              />
            )}
            {(suspendMutation.isError || archiveMutation.isError) && (
              <ErrorState message={toErrorMessage(suspendMutation.error ?? archiveMutation.error)} />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
