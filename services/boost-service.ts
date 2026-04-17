import { api } from "@/services/http";
import type { BoostRecord } from "@/modules/shared/types";

export interface CreateBoostPayload {
  listingId: string;
  amount: number;
  days: number;
  paymentConfirmed: boolean;
}

export async function createBoost(payload: CreateBoostPayload): Promise<BoostRecord> {
  const response = await api.post<BoostRecord>("/boosts", payload);
  return response.data;
}

export async function listBoosts(): Promise<BoostRecord[]> {
  const response = await api.get<{ boosts: BoostRecord[] }>("/boosts");
  return response.data.boosts;
}
