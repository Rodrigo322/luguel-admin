"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveListing,
  archiveListing,
  archiveListingByAdmin,
  listListings,
  rejectListing,
  suspendListing
} from "@/services/listings-service";
import type { ListingStatus } from "@/modules/shared/types";

export function useListings(status?: ListingStatus) {
  return useQuery({
    queryKey: ["listings", status ?? "ALL"],
    queryFn: () => listListings(status ? { status } : undefined)
  });
}

export function useArchiveListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}

export function useSuspendListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, reason }: { listingId: string; reason: string }) => suspendListing(listingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}

export function useArchiveListingByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, reason }: { listingId: string; reason: string }) =>
      archiveListingByAdmin(listingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}

export function useApproveListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}

export function useRejectListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, reason }: { listingId: string; reason: string }) => rejectListing(listingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}
