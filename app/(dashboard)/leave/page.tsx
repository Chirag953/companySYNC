"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/shared/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { LeaveForm, type LeaveFormValues } from "@/components/forms/LeaveForm";
import { mockLeaveBalances, mockLeaveRequests, mockLeaveTypes, mockHolidays } from "@/lib/mock-data/leaves";
import type { LeaveStatus } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";

export default function LeavePage() {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role === "manager") {
      router.replace("/leave/requests");
    }
  }, [role, router]);

  const myRequests = mockLeaveRequests.filter((l) => l.userId === user?.id);

  const columns = useMemo<ColumnDef<(typeof myRequests)[number]>[]>(
    () => [
      { accessorKey: "startDate", header: "From" },
      { accessorKey: "endDate", header: "To" },
      { accessorKey: "daysCount", header: "Days" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as LeaveStatus} />,
      },
      { accessorKey: "appliedAt", header: "Applied" },
    ],
    [],
  );

  if (role === "manager") {
    return (
      <p className="text-sm text-muted-foreground">
        Redirecting to <Link href="/leave/requests">leave requests</Link>…
      </p>
    );
  }

  if (role === "employee") {
    const balances = mockLeaveBalances.filter((b) => b.userId === user?.id);
    return (
      <>
        <PageHeader
          title="Leave"
          description="Balances, apply for leave, and track requests."
          action={
            <Dialog>
              <DialogTrigger className={cn(buttonVariants(), "min-h-11")}>Apply for leave</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for leave</DialogTitle>
                </DialogHeader>
                <LeaveForm
                  onSubmit={(v: LeaveFormValues) => {
                    toast.success(`Mock: submitted ${v.startDate} – ${v.endDate}`);
                  }}
                />
              </DialogContent>
            </Dialog>
          }
        />
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {mockLeaveTypes.map((lt) => {
            const b = balances.find((x) => x.leaveTypeId === lt.id);
            const remaining = b ? b.allocated - b.used : lt.daysAllowed;
            return (
              <Card key={lt.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{lt.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{remaining}</p>
                  <p className="text-xs text-muted-foreground">days remaining (mock)</p>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min(100, (remaining / lt.daysAllowed) * 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <DataTable columns={columns} data={myRequests} searchPlaceholder="Search leave history…" />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Leave administration" description="Policies, holidays, and all requests." />
      <Tabs defaultValue="policies">
        <TabsList>
          <TabsTrigger value="policies" className="min-h-11">
            Policies
          </TabsTrigger>
          <TabsTrigger value="holidays" className="min-h-11">
            Holiday calendar
          </TabsTrigger>
          <TabsTrigger value="requests" className="min-h-11">
            All requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="policies" className="mt-4 space-y-3">
          {mockLeaveTypes.map((lt) => (
            <Card key={lt.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{lt.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {lt.daysAllowed} days · {lt.isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="min-h-11" onClick={() => toast.message("Mock edit")}>
                  Edit
                </Button>
              </CardHeader>
            </Card>
          ))}
          <Button className="min-h-11" onClick={() => toast.message("Mock add leave type")}>
            Add leave type
          </Button>
        </TabsContent>
        <TabsContent value="holidays" className="mt-4 space-y-2">
          {mockHolidays.map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <span>{h.name}</span>
              <span className="text-muted-foreground">{h.date}</span>
            </div>
          ))}
          <Button className="min-h-11" variant="secondary" onClick={() => toast.message("Mock add holiday")}>
            Add holiday
          </Button>
        </TabsContent>
        <TabsContent value="requests" className="mt-4">
          <DataTable
            columns={columns}
            data={mockLeaveRequests}
            searchPlaceholder="Search requests…"
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
