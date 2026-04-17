import { listListings } from "@/services/listings-service";
import { listRentals } from "@/services/rentals-service";
import { listReports } from "@/services/reports-service";
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
  const [users, listings, rentals, activeReports] = await Promise.all([
    listUsers(),
    listListings(),
    listRentals(),
    listReports({
      status: "OPEN",
      page: 1,
      pageSize: 1
    })
  ]);

  return {
    totalUsers: users.length,
    totalListings: listings.length,
    totalRentals: rentals.length,
    totalReports: activeReports.pagination.total,
    highRiskListings: listings.filter((listing) => listing.riskLevel === "HIGH" || listing.riskLevel === "CRITICAL").length,
    pendingListings: listings.filter((listing) => listing.status === "PENDING_VALIDATION").length
  };
}
