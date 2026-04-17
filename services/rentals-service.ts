import { api } from "@/services/http";
import type { RentalRecord, RentalStatus } from "@/modules/shared/types";

export async function listRentals(): Promise<RentalRecord[]> {
  const response = await api.get<{ rentals: RentalRecord[] }>("/rentals");
  return response.data.rentals;
}

export async function getRentalById(rentalId: string): Promise<RentalRecord> {
  const response = await api.get<RentalRecord>(`/rentals/${rentalId}`);
  return response.data;
}

export async function updateRentalStatus(rentalId: string, status: Extract<RentalStatus, "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELED">): Promise<RentalRecord> {
  const response = await api.patch<RentalRecord>(`/rentals/${rentalId}/status`, { status });
  return response.data;
}
