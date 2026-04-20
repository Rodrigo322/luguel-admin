"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useBanUser, useUpdateUserRole, useUserById, useUsers } from "@/modules/users/queries";
import { toErrorMessage } from "@/lib/http-errors";
import type { UserRecord } from "@/modules/shared/types";
import { formatUserAccountStatus, formatUserRole } from "@/modules/shared/labels";
import { formatDateTime } from "@/lib/utils";

export function UsersContent() {
  const usersQuery = useUsers();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [banReason, setBanReason] = useState("Violacao critica de politica.");
  const [nextRole, setNextRole] = useState<"LOCADOR" | "LOCATARIO">("LOCADOR");
  const detailsQuery = useUserById(selectedUser?.id ?? null);
  const banMutation = useBanUser();
  const roleMutation = useUpdateUserRole();

  const filteredUsers = useMemo(() => {
    if (!usersQuery.data) {
      return [];
    }

    if (!search.trim()) {
      return usersQuery.data;
    }

    const needle = search.toLowerCase();
    return usersQuery.data.filter((user) => {
      return user.name.toLowerCase().includes(needle) || user.email.toLowerCase().includes(needle);
    });
  }, [search, usersQuery.data]);

  if (usersQuery.isLoading) {
    return <LoadingState label="Carregando usuarios..." />;
  }

  if (usersQuery.isError) {
    return <ErrorState message="Falha ao carregar usuarios administrativos." />;
  }

  return (
    <div className="space-y-5">
      <div className="glass flex flex-wrap items-center gap-3 rounded p-4">
        <div className="relative min-w-72 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-shell-foreground-dim" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar usuario por nome ou email"
            className="pl-9"
          />
        </div>
        <Badge label={`${filteredUsers.length} registros`} tone="accent" />
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState title="Sem usuarios encontrados" description="Ajuste o filtro para localizar usuarios." />
      ) : (
        <DataTable columns={["Usuario", "Perfil", "Situacao", "Reputacao", "Diretivas"]}>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="data-table-row">
              <td className="px-4 py-2">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-shell-foreground-dim">{user.email}</p>
              </td>
              <td className="px-4 py-2">
                <Badge label={formatUserRole(user.role)} tone={user.role === "ADMIN" ? "accent" : "default"} />
              </td>
              <td className="px-4 py-2">
                <Badge label={formatUserAccountStatus(user.isBanned)} tone={user.isBanned ? "danger" : "success"} />
              </td>
              <td className="px-4 py-2 text-sm font-semibold">{user.reputationScore}</td>
              <td className="px-4 py-2">
                <Button variant="secondary" onClick={() => setSelectedUser(user)}>
                  Ver detalhes
                </Button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <Modal title="Detalhes do usuario" open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
        {detailsQuery.isLoading && <LoadingState label="Carregando detalhes..." />}
        {detailsQuery.isError && <ErrorState message="Nao foi possivel carregar detalhes do usuario." />}
        {detailsQuery.data && (
          <div className="space-y-4">
            <div className="rounded-sm bg-shell-muted p-3">
              <p className="text-sm text-shell-foreground-dim">Nome</p>
              <p className="font-semibold">{detailsQuery.data.name}</p>
              <p className="mt-2 text-sm text-shell-foreground-dim">Criado em</p>
              <p>{detailsQuery.data.createdAt ? formatDateTime(detailsQuery.data.createdAt) : "Nao disponivel"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-shell-foreground-dim">Alterar perfil</label>
              <div className="flex gap-2">
                <Select value={nextRole} onChange={(event) => setNextRole(event.target.value as "LOCADOR" | "LOCATARIO")}>
                  <option value="LOCADOR">Locador</option>
                  <option value="LOCATARIO">Locatario</option>
                </Select>
                <Button
                  variant="secondary"
                  loading={roleMutation.isPending}
                  onClick={() => {
                    if (!selectedUser) {
                      return;
                    }

                    roleMutation.mutate({ userId: selectedUser.id, role: nextRole });
                  }}
                >
                  Salvar perfil
                </Button>
              </div>
              {roleMutation.isError && (
                <ErrorState message={toErrorMessage(roleMutation.error)} />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-shell-foreground-dim">Motivo do banimento</label>
              <Input value={banReason} onChange={(event) => setBanReason(event.target.value)} />
              <Button
                variant="danger"
                loading={banMutation.isPending}
                onClick={() => {
                  if (!selectedUser) {
                    return;
                  }

                  banMutation.mutate({
                    userId: selectedUser.id,
                    reason: banReason
                  });
                }}
              >
                Banir usuario
              </Button>
              {banMutation.isError && <ErrorState message={toErrorMessage(banMutation.error)} />}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
