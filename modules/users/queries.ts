"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { banUser, getUserById, listUsers, updateUserRole } from "@/services/users-service";
import type { UserRole } from "@/modules/shared/types";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: listUsers
  });
}

export function useUserById(userId: string | null) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId ?? ""),
    enabled: Boolean(userId)
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => banUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Extract<UserRole, "LOCADOR" | "LOCATARIO"> }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
