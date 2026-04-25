"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { mockAttendanceRecords, mockAttendanceRules } from "@/lib/mock-data/attendance";
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AttendancePage() {
  const { user, role } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const mine = useMemo(
    () => mockAttendanceRecords.filter((a) => a.userId === user?.id).slice(0, 35),
    [user?.id],
  );

  const teamToday = useMemo(
    () => mockAttendanceRecords.filter((a) => a.date === date).slice(0, 12),
    [date],
  );

  const columns = useMemo<ColumnDef<(typeof mockAttendanceRecords)[number]>[]>(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "checkIn", header: "Check-in" },
      { accessorKey: "checkOut", header: "Check-out" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as "present"} />,
      },
    ],
    [],
  );

  const managerCols = useMemo<ColumnDef<(typeof mockAttendanceRecords)[number]>[]>(
    () => [
      {
        accessorKey: "userId",
        header: "Employee",
        cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue()).slice(-6)}</span>,
      },
      ...columns,
    ],
    [columns],
  );

  if (role === "employee") {
    return (
      <>
        <PageHeader title="Attendance" description="Check in/out and review your history." />
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Today</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-semibold">{checkedIn ? "Checked in" : "Not checked in"}</p>
            </div>
            <Button
              size="lg"
              className="min-h-12 min-w-[10rem]"
              variant={checkedIn ? "secondary" : "default"}
              onClick={() => setCheckedIn((c) => !c)}
            >
              {checkedIn ? "Check out" : "Check in"}
            </Button>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Monthly heatmap (sample)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-[10px]">
              {mine.slice(0, 28).map((a) => (
                <div
                  key={a.id}
                  title={`${a.date} ${a.status}`}
                  className={`aspect-square rounded-sm ${
                    a.status === "present" || a.status === "on_time"
                      ? "bg-emerald-500/80"
                      : a.status === "late"
                        ? "bg-amber-500/80"
                        : a.status === "half_day"
                          ? "bg-sky-500/80"
                          : "bg-rose-500/70"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <DataTable columns={columns} data={mine} searchPlaceholder="Search attendance…" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Attendance"
        description={role === "admin" ? "Company attendance and rules." : "Team attendance overview."}
      />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="att-date">Date</Label>
          <Input
            id="att-date"
            type="date"
            className="min-h-11 w-48"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Team today (sample)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={managerCols} data={teamToday} />
        </CardContent>
      </Card>
      {role === "admin" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance rules</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
            <p>Late mark after: {mockAttendanceRules.lateMarkAfterMinutes} min</p>
            <p>Half-day after: {mockAttendanceRules.halfDayAfterMinutes} min</p>
            <p>Overtime after: {mockAttendanceRules.overtimeAfterMinutes} min</p>
            <Button className="min-h-11 sm:col-span-3" variant="secondary" onClick={() => toast.message("Mock save rules")}>
              Save rules
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
