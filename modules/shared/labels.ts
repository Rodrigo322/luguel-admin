import type {
  BoostRecord,
  ListingStatus,
  RentalStatus,
  ReportStatus,
  RiskLevel,
  UserRole
} from "@/modules/shared/types";

type BoostStatus = BoostRecord["status"] | "ALL";

export function formatUserRole(role: UserRole): string {
  if (role === "ADMIN") return "Administrador";
  if (role === "LOCADOR") return "Locador";
  return "Locatario";
}

export function formatUserAccountStatus(isBanned: boolean): string {
  return isBanned ? "Banido" : "Ativo";
}

export function formatRiskLevel(riskLevel: RiskLevel): string {
  if (riskLevel === "LOW") return "Baixo";
  if (riskLevel === "MEDIUM") return "Medio";
  if (riskLevel === "HIGH") return "Alto";
  return "Critico";
}

export function formatListingStatus(status: ListingStatus): string {
  if (status === "ACTIVE") return "Ativo";
  if (status === "PENDING_VALIDATION") return "Pendente";
  if (status === "SUSPENDED") return "Bloqueado";
  if (status === "ARCHIVED") return "Removido";
  return "Sinalizado";
}

export function formatRentalStatus(status: RentalStatus): string {
  if (status === "REQUESTED") return "Solicitado";
  if (status === "APPROVED") return "Aprovado";
  if (status === "ACTIVE") return "Ativo";
  if (status === "COMPLETED") return "Concluido";
  if (status === "CANCELED") return "Cancelado";
  return "Em disputa";
}

export function formatReportStatus(status: ReportStatus): string {
  if (status === "OPEN") return "Aberta";
  if (status === "TRIAGED") return "Triada";
  if (status === "RESOLVED") return "Resolvida";
  return "Rejeitada";
}

export function formatBoostStatus(status: BoostStatus): string {
  if (status === "ACTIVE") return "Ativo";
  if (status === "PENDING") return "Pendente";
  if (status === "PAID") return "Pago";
  if (status === "EXPIRED") return "Expirado";
  if (status === "CANCELED") return "Cancelado";
  return "Todos";
}
