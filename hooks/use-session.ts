"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession, refreshSession, signOut } from "@/services/auth-service";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession
  });
}

export function useRefreshSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshSession,
    onSuccess: (session) => {
      queryClient.setQueryData(["session"], session);
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(["session"], null);
      queryClient.clear();
    }
  });
}
