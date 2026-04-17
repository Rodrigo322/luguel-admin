import { api } from "@/services/http";
import type { ListingRecord, ListingStatus } from "@/modules/shared/types";

export async function listListings(filters?: { status?: ListingStatus }): Promise<ListingRecord[]> {
  const response = await api.get<{ listings: ListingRecord[] }>("/listings", {
    params: filters
  });

  return response.data.listings;
}

export async function getListingById(listingId: string): Promise<ListingRecord> {
  const response = await api.get<ListingRecord>(`/listings/${listingId}`);
  return response.data;
}

export async function archiveListing(listingId: string): Promise<ListingRecord> {
  const response = await api.delete<ListingRecord>(`/listings/${listingId}`);
  return response.data;
}

export async function suspendListing(listingId: string, reason: string): Promise<ListingRecord> {
  const response = await api.post<ListingRecord>(`/admin/listings/${listingId}/suspend`, { reason });
  return response.data;
}

export async function archiveListingByAdmin(listingId: string, reason: string): Promise<ListingRecord> {
  const response = await api.post<ListingRecord>(`/admin/listings/${listingId}/archive`, { reason });
  return response.data;
}

export async function approveListing(listingId: string): Promise<void> {
  // Endpoint esperado para evolucao de backend:
  await api.post(`/admin/listings/${listingId}/approve`);
}

export async function rejectListing(listingId: string, reason: string): Promise<void> {
  // Endpoint esperado para evolucao de backend:
  await api.post(`/admin/listings/${listingId}/reject`, { reason });
}
