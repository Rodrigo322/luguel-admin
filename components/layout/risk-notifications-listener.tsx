"use client";

import { useRiskNotifications } from "@/hooks/use-risk-notifications";

export function RiskNotificationsListener() {
  useRiskNotifications();
  return null;
}
