"use client";

import { useMemo } from "react";
import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { mockLeaveRequests } from "@/lib/mock-data/leaves";
import { getUserById } from "@/lib/mock-data/users";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import type { LeaveStatus } from "@/lib/types";

export default function LeaveRequestsPage() {
  const pending = mockLeaveRequests.filter((l) => l.status === "pending");
  const history = mockLeaveRequests.filter((l) => l.status !== "pending");

  const columns = useMemo<ColumnDef<(typeof mockLeaveRequests)[number]>[]>(
    () => [
      {
        id: "employee",
        header: "Employee",
        cell: ({ row }) => {
          const u = getUserById(row.original.userId);
          return u ? (
            <div className="flex items-center gap-2">
              <UserAvatar firstName={u.firstName} lastName={u.lastName} size="sm" />
              <span className="text-sm">
                {u.firstName} {u.lastName}
              </span>
            </div>
          ) : (
            row.original.userId
          );
        },
      },
      { accessorKey: "startDate", header: "From" },
      { accessorKey: "endDate", header: "To" },
      { accessorKey: "daysCount", header: "Days" },
      { accessorKey: "reason", header: "Reason" },
    ],
    [],
  );

  return (
    <RequireRole allow="manager">
      <PageHeader title="Leave requests" description="Approve or reject team leave." />
      <div className="mb-8 space-y-5">
        <h3 className="text-sm font-semibold">Pending</h3>
        {pending.map((l) => {
          const u = getUserById(l.userId);
          return (
            <div
              key={l.id}
              className="panel-glass flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-3">
                {u ? <UserAvatar firstName={u.firstName} lastName={u.lastName} size="md" /> : null}
                <div>
                  <p className="font-medium">
                    {u ? `${u.firstName} ${u.lastName}` : l.userId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {l.startDate} → {l.endDate} · {l.daysCount} day(s)
                  </p>
                  <p className="text-sm">{l.reason ?? "—"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="min-h-11 bg-emerald-600 hover:bg-emerald-600/90"
                  onClick={() => toast.success("Mock: approved")}
                >
                  Approve
                </Button>
                <Button variant="destructive" className="min-h-11" onClick={() => toast.message("Mock: rejected")}>
                  Reject
                </Button>
              </div>
            </div>
          );
        })}
        {!pending.length ? (
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        ) : null}
      </div>
      <h3 className="mb-2 text-sm font-semibold">History</h3>
      <DataTable
        columns={[
          ...columns,
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => <StatusBadge status={getValue() as LeaveStatus} />,
          },
        ]}
        data={history}
      />
    </RequireRole>
  );
}
