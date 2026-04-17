import { api } from "@/services/http";
import type { ReportRecord, ReportStatus, RiskLevel } from "@/modules/shared/types";

export interface ReportListFilters {
  status?: ReportStatus;
  riskLevel?: RiskLevel;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ReportListResponse {
  reports: ReportRecord[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export async function listReports(filters?: ReportListFilters): Promise<ReportListResponse> {
  const response = await api.get<ReportListResponse>("/admin/reports", {
    params: filters
  });

  return response.data;
}

export async function listCriticalReports(): Promise<ReportRecord[]> {
  const response = await api.get<{ reports: ReportRecord[] }>("/admin/reports/critical");
  return response.data.reports;
}

export async function reviewReport(reportId: string, status: Exclude<ReportStatus, "OPEN">, reason?: string): Promise<ReportRecord> {
  const response = await api.patch<ReportRecord>(`/admin/reports/${reportId}/status`, { status, reason });
  return response.data;
}

export async function takeDownReport(reportId: string, reason: string): Promise<ReportRecord> {
  const response = await api.post<ReportRecord>(`/admin/reports/${reportId}/takedown`, { reason });
  return response.data;
}
