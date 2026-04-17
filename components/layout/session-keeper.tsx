"use client";

import { useEffect } from "react";
import { useRefreshSession } from "@/hooks/use-session";

export function SessionKeeper() {
  const refreshMutation = useRefreshSession();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMutation.mutate();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshMutation]);

  return null;
}
