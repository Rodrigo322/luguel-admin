import { api } from "@/services/http";

export interface DashboardMetrics {
  totalUsers: number;
  totalListings: number;
  totalRentals: number;
  totalReports: number;
  criticalReports: number;
  highRiskListings: number;
  pendingListings: number;
  activeBoosts: number;
  bannedUsers: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await api.get<DashboardMetrics>("/admin/metrics");
  return response.data;
}
