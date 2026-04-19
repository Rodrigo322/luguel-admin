import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="admin-shell-bg min-h-screen">
      <Sidebar />
      <div className="admin-shell-bg min-h-screen lg:pl-72">
        <div className="w-full px-4 py-4 lg:px-8">
          <Header />
          <main className="pb-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
