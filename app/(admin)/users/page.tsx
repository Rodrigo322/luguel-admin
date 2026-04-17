import { UsersContent } from "@/modules/users/users-content";

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">User Management</h1>
        <p className="text-shell-foreground-dim">Gerencie usuarios, roles, reputacao e medidas disciplinares.</p>
      </div>
      <UsersContent />
    </div>
  );
}
