"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRentalById, listRentals, updateRentalStatus } from "@/services/rentals-service";
import type { RentalStatus } from "@/modules/shared/types";

export function useRentals() {
  return useQuery({
    queryKey: ["rentals"],
    queryFn: listRentals
  });
}

export function useRentalById(rentalId: string | null) {
  return useQuery({
    queryKey: ["rentals", rentalId],
    queryFn: () => getRentalById(rentalId ?? ""),
    enabled: Boolean(rentalId)
  });
}

export function useUpdateRentalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rentalId,
      status
    }: {
      rentalId: string;
      status: Extract<RentalStatus, "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELED">;
    }) => updateRentalStatus(rentalId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    }
  });
}
