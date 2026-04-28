"use client";

import { useMemo, useState } from "react";
import { AttendanceCalendar } from "@/components/shared/AttendanceCalendar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { mockAttendanceRecords, mockAttendanceRules } from "@/lib/mock-data/attendance";
import { segmentedTabsListClass, segmentedTabsTriggerClass } from "@/lib/segmented-tab-styles";
import { mockDepartments } from "@/lib/mock-data/departments";
import { getUserById } from "@/lib/mock-data/users";
import { useAuth } from "@/lib/auth-context";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AttendancePage() {
  const { user, role } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const mine = useMemo(
    () => mockAttendanceRecords.filter((a) => a.userId === user?.id),
    [user?.id],
  );

  const teamToday = useMemo(
    () => mockAttendanceRecords.filter((a) => a.date === date).slice(0, 12),
    [date],
  );

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "checkIn", header: "Check-in" },
      { accessorKey: "checkOut", header: "Check-out" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as AttendanceStatus} />,
      },
    ],
    [],
  );

  const departmentNameForUser = (userId: string) => {
    const u = getUserById(userId);
    if (!u?.departmentId) return "—";
    return mockDepartments.find((d) => d.id === u.departmentId)?.name ?? "—";
  };

  const managerCols = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      {
        id: "employeeName",
        accessorFn: (row) => {
          const u = getUserById(row.userId);
          return u ? `${u.firstName} ${u.lastName}` : row.userId;
        },
        header: "Employee",
        cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span>,
      },
      {
        id: "department",
        accessorFn: (row) => departmentNameForUser(row.userId),
        header: "Department",
      },
      ...columns,
    ],
    [columns],
  );

  const rulesCard = (options: { editable: boolean }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Attendance rules</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
        <p>Late mark after: {mockAttendanceRules.lateMarkAfterMinutes} min</p>
        <p>Half-day after: {mockAttendanceRules.halfDayAfterMinutes} min</p>
        <p>Overtime after: {mockAttendanceRules.overtimeAfterMinutes} min</p>
        {options.editable ? (
          <Button className="min-h-11 sm:col-span-3" variant="secondary" onClick={() => toast.message("Mock save rules")}>
            Save rules
          </Button>
        ) : (
          <p className="text-muted-foreground sm:col-span-3">
            Policy is managed by administrators. Contact HR if you need changes (mock).
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (role === "employee") {
    return (
      <>
        <PageHeader title="Attendance" description="Check in/out and review your history." />
        <Tabs defaultValue="today">
          <TabsList className={segmentedTabsListClass}>
            <TabsTrigger value="today" className={segmentedTabsTriggerClass}>
              Today attendance
            </TabsTrigger>
            <TabsTrigger value="rules" className={segmentedTabsTriggerClass}>
              Attendance rules
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-6 space-y-6">
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attendance calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceCalendar records={mine} />
              </CardContent>
            </Card>
            <DataTable columns={columns} data={mine} searchPlaceholder="Search attendance…" />
          </TabsContent>
          <TabsContent value="rules" className="mt-6">
            {rulesCard({ editable: false })}
          </TabsContent>
        </Tabs>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Attendance"
        description={role === "admin" ? "Company attendance and rules." : "Team attendance overview."}
      />
      <Tabs defaultValue="today">
        <TabsList className={segmentedTabsListClass}>
          <TabsTrigger value="today" className={segmentedTabsTriggerClass}>
            Today attendance
          </TabsTrigger>
          <TabsTrigger value="rules" className={segmentedTabsTriggerClass}>
            Attendance rules
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-6 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team today (sample)</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={managerCols}
                data={teamToday}
                searchPlaceholder="Search by employee, department, dates…"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rules" className="mt-6">
          {rulesCard({ editable: role === "admin" })}
        </TabsContent>
      </Tabs>
    </>
  );
}
