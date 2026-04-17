import { listListings } from "@/services/listings-service";
import { listRentals } from "@/services/rentals-service";
import { listCriticalReports } from "@/services/reports-service";
import { listUsers } from "@/services/users-service";

export interface DashboardMetrics {
  totalUsers: number;
  totalListings: number;
  totalRentals: number;
  totalReports: number;
  highRiskListings: number;
  pendingListings: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [users, listings, rentals, reports] = await Promise.all([
    listUsers(),
    listListings(),
    listRentals(),
    listCriticalReports()
  ]);

  return {
    totalUsers: users.length,
    totalListings: listings.length,
    totalRentals: rentals.length,
    totalReports: reports.length,
    highRiskListings: listings.filter((listing) => listing.riskLevel === "HIGH" || listing.riskLevel === "CRITICAL").length,
    pendingListings: listings.filter((listing) => listing.status === "PENDING_VALIDATION").length
  };
}
