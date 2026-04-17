export type UserRole = "LOCADOR" | "LOCATARIO" | "ADMIN";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBanned: boolean;
  bannedAt?: string;
  reputationScore: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ListingStatus = "ACTIVE" | "PENDING_VALIDATION" | "FLAGGED" | "SUSPENDED" | "ARCHIVED";

export interface ListingRecord {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  dailyPrice: number;
  status: ListingStatus;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}

export type RentalStatus = "REQUESTED" | "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELED" | "DISPUTED";

export interface RentalRecord {
  id: string;
  listingId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReportStatus = "OPEN" | "TRIAGED" | "RESOLVED" | "REJECTED";

export interface ReportRecord {
  id: string;
  reporterId: string;
  listingId?: string;
  rentalId?: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface BoostRecord {
  id: string;
  listingId: string;
  amount: number;
  startsAt: string;
  endsAt: string;
  status: "PENDING" | "PAID" | "ACTIVE" | "EXPIRED" | "CANCELED";
  createdAt: string;
  updatedAt: string;
}
