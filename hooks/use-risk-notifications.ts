"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { POLLING_INTERVAL_MS } from "@/lib/constants";
import { notifyBrowser, requestBrowserNotificationPermission } from "@/lib/browser-notifications";
import { getDashboardMetrics } from "@/services/dashboard-service";

interface RiskSnapshot {
  pendingListings: number;
  criticalReports: number;
}

async function readRiskSnapshot(): Promise<RiskSnapshot> {
  const metrics = await getDashboardMetrics();

  return {
    pendingListings: metrics.pendingListings,
    criticalReports: metrics.criticalReports
  };
}

export function useRiskNotifications() {
  const previousSnapshot = useRef<RiskSnapshot | null>(null);

  const query = useQuery({
    queryKey: ["risk-snapshot"],
    queryFn: readRiskSnapshot,
    refetchInterval: POLLING_INTERVAL_MS
  });

  useEffect(() => {
    void requestBrowserNotificationPermission();
  }, []);

  useEffect(() => {
    if (!query.data) {
      return;
    }

    const prev = previousSnapshot.current;
    const next = query.data;

    if (prev) {
      if (next.pendingListings > prev.pendingListings) {
        notifyBrowser(
          "Novos anuncios pendentes",
          `${next.pendingListings - prev.pendingListings} novo(s) anuncio(s) aguardando validacao.`
        );
      }

      if (next.criticalReports > prev.criticalReports) {
        notifyBrowser(
          "Novas denuncias criticas",
          `${next.criticalReports - prev.criticalReports} nova(s) denuncia(s) critica(s).`
        );
      }
    }

    previousSnapshot.current = next;
  }, [query.data]);
}
