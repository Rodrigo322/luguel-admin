"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listCriticalReports, listReports, reviewReport, type ReportListFilters } from "@/services/reports-service";
import { archiveListingByAdmin } from "@/services/listings-service";
import { banUser } from "@/services/users-service";

export function useReports(filters: ReportListFilters) {
  return useQuery({
    queryKey: ["reports", "list", filters],
    queryFn: () => listReports(filters)
  });
}

export function useCriticalReports() {
  return useQuery({
    queryKey: ["reports", "critical"],
    queryFn: listCriticalReports
  });
}

export function useReviewReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      status,
      reason
    }: {
      reportId: string;
      status: "TRIAGED" | "RESOLVED" | "REJECTED";
      reason?: string;
    }) => reviewReport(reportId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
}

export function useTakeDownListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, reason }: { listingId: string; reason: string }) =>
      archiveListingByAdmin(listingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}

export function usePunishUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => banUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
