import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  columns: string[];
  children: ReactNode;
  className?: string;
}

export function DataTable({ columns, children, className }: DataTableProps) {
  return (
    <div className={cn("overflow-hidden rounded bg-shell-elevated p-1", className)}>
      <table className="min-w-full border-collapse">
        <thead className="bg-shell-muted">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-2 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-shell-foreground-dim"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
