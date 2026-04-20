"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useRentalById, useRentals, useUpdateRentalStatus } from "@/modules/rentals/queries";
import type { RentalRecord } from "@/modules/shared/types";
import { formatRentalStatus } from "@/modules/shared/labels";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toErrorMessage } from "@/lib/http-errors";

export function RentalsContent() {
  const rentalsQuery = useRentals();
  const [selectedRental, setSelectedRental] = useState<RentalRecord | null>(null);
  const [status, setStatus] = useState<"APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELED">("APPROVED");
  const detailsQuery = useRentalById(selectedRental?.id ?? null);
  const updateStatusMutation = useUpdateRentalStatus();

  const rentals = useMemo(() => rentalsQuery.data ?? [], [rentalsQuery.data]);

  if (rentalsQuery.isLoading) {
    return <LoadingState label="Carregando locacoes..." />;
  }

  if (rentalsQuery.isError) {
    return <ErrorState message="Falha ao carregar locacoes." />;
  }

  return (
    <div className="space-y-5">
      {rentals.length === 0 ? (
        <EmptyState title="Sem locacoes" description="Nao ha locacoes registradas para visualizacao administrativa." />
      ) : (
        <DataTable columns={["ID da Locacao", "Anuncio", "Periodo", "Situacao", "Total", "Acoes"]}>
          {rentals.map((rental) => (
            <tr key={rental.id} className="data-table-row">
              <td className="px-4 py-2 font-semibold">#{rental.id.slice(0, 8)}</td>
              <td className="px-4 py-2 font-mono text-xs text-shell-foreground-dim">{rental.listingId.slice(0, 12)}</td>
              <td className="px-4 py-2 text-sm">
                {formatDateTime(rental.startDate)} - {formatDateTime(rental.endDate)}
              </td>
              <td className="px-4 py-2">
                <Badge label={formatRentalStatus(rental.status)} tone={rental.status === "DISPUTED" ? "danger" : "default"} />
              </td>
              <td className="px-4 py-2">{formatCurrency(rental.totalPrice)}</td>
              <td className="px-4 py-2">
                <Button variant="secondary" onClick={() => setSelectedRental(rental)}>
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <Modal
        title={selectedRental ? `Locacao ${selectedRental.id.slice(0, 8)}` : "Detalhes da locacao"}
        open={Boolean(selectedRental)}
        onClose={() => setSelectedRental(null)}
      >
        {detailsQuery.isLoading && <LoadingState label="Carregando detalhes..." />}
        {detailsQuery.isError && <ErrorState message="Erro ao carregar detalhes da locacao." />}
        {detailsQuery.data && (
          <div className="space-y-4">
            <div className="rounded-sm bg-shell-muted p-3 text-sm">
              <p>Locatario: {detailsQuery.data.tenantId}</p>
              <p>Anuncio: {detailsQuery.data.listingId}</p>
              <p>Situacao atual: {formatRentalStatus(detailsQuery.data.status)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                <option value="APPROVED">Aprovado</option>
                <option value="ACTIVE">Ativo</option>
                <option value="COMPLETED">Concluido</option>
                <option value="CANCELED">Cancelado</option>
              </Select>
              <Button
                variant="primary"
                loading={updateStatusMutation.isPending}
                onClick={() => {
                  if (!selectedRental) {
                    return;
                  }
                  updateStatusMutation.mutate({ rentalId: selectedRental.id, status });
                }}
              >
                Atualizar status
              </Button>
            </div>
            {updateStatusMutation.isError && <ErrorState message={toErrorMessage(updateStatusMutation.error)} />}
          </div>
        )}
      </Modal>
    </div>
  );
}
