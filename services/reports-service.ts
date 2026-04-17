import { api } from "@/services/http";
import type { ReportRecord, ReportStatus } from "@/modules/shared/types";

export async function listCriticalReports(): Promise<ReportRecord[]> {
  const response = await api.get<{ reports: ReportRecord[] }>("/admin/reports/critical");
  return response.data.reports;
}

export async function reviewReport(reportId: string, status: Exclude<ReportStatus, "OPEN">, reason?: string): Promise<ReportRecord> {
  const response = await api.patch<ReportRecord>(`/admin/reports/${reportId}/status`, { status, reason });
  return response.data;
}
