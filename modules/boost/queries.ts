"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBoost, listBoosts, type CreateBoostPayload } from "@/services/boost-service";

export function useBoostList() {
  return useQuery({
    queryKey: ["boosts"],
    queryFn: listBoosts
  });
}

export function useCreateBoost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBoostPayload) => createBoost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boosts"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}
