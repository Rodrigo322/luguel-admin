import { api } from "@/services/http";
import type { UserRecord, UserRole } from "@/modules/shared/types";

export async function listUsers(): Promise<UserRecord[]> {
  const response = await api.get<{ users: UserRecord[] }>("/users");
  return response.data.users;
}

export async function getUserById(userId: string): Promise<UserRecord> {
  const response = await api.get<UserRecord>(`/users/${userId}`);
  return response.data;
}

export async function banUser(userId: string, reason: string): Promise<UserRecord> {
  const response = await api.post<UserRecord>(`/admin/users/${userId}/ban`, { reason });
  return response.data;
}

export async function updateUserRole(userId: string, role: Extract<UserRole, "LOCADOR" | "LOCATARIO">): Promise<void> {
  // O backend atual nao expoe endpoint admin para alterar role de terceiros.
  // Mantemos a chamada para endpoint esperado para evolucao futura.
  await api.patch(`/admin/users/${userId}/role`, { role });
}
