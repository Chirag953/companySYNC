"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, Clock, Coffee, Download, UserCheck, UserX, Users } from "lucide-react";
import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAttendanceRecords } from "@/lib/mock-data/attendance";
import { mockDepartments } from "@/lib/mock-data/departments";
import { getUserById } from "@/lib/mock-data/users";
import type { AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  averageWorkingMinutes,
  buildEmployeeAttendanceCsv,
  dayNameForDate,
  downloadCsvString,
  formatTimeFromIso,
  formatWorkingMinutesDisplay,
  getAttendanceDateBounds,
  getDepartmentName,
  isDateWithinRange,
  normalizeDateRange,
  slugifyFilenamePart,
} from "@/lib/attendance-utils";
import { toast } from "sonner";

const EMPLOYEE_DETAIL_PAGE_SIZE = 15;

const STATUS_OPTIONS: Array<AttendanceStatus | "all"> = [
  "all",
  "present",
  "absent",
  "half_day",
  "late",
  "on_time",
];

function statusLabel(s: AttendanceStatus | "all") {
  if (s === "all") return "All statuses";
  if (s === "half_day") return "Half day";
  if (s === "on_time") return "On time";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function AttendanceEmployeeDetail() {
  const params = useParams<{ id: string }>();
  const user = getUserById(params.id);

  const allForUser = useMemo(() => {
    if (!user) return [];
    return mockAttendanceRecords
      .filter((a) => a.userId === user.id)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [user]);

  const bounds = useMemo(() => getAttendanceDateBounds(allForUser), [allForUser]);

  const [fromDate, setFromDate] = useState(() => bounds.min);
  const [toDate, setToDate] = useState(() => bounds.max);
  const [status, setStatus] = useState<AttendanceStatus | "all">("all");
  const [page, setPage] = useState(1);

  const range = useMemo(() => normalizeDateRange(fromDate, toDate), [fromDate, toDate]);

  const filteredRows = useMemo(() => {
    return allForUser.filter((row) => {
      if (!isDateWithinRange(row.date, range.from, range.to)) return false;
      if (status !== "all" && row.status !== status) return false;
      return true;
    });
  }, [allForUser, range.from, range.to, status]);

  const stats = useMemo(() => {
    const total = filteredRows.length;
    const present = filteredRows.filter((r) => r.status === "present" || r.status === "on_time").length;
    const absent = filteredRows.filter((r) => r.status === "absent").length;
    const late = filteredRows.filter((r) => r.status === "late").length;
    const halfDay = filteredRows.filter((r) => r.status === "half_day").length;
    const avg = averageWorkingMinutes(filteredRows);
    return { total, present, absent, late, halfDay, avg };
  }, [filteredRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / EMPLOYEE_DETAIL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * EMPLOYEE_DETAIL_PAGE_SIZE;
  const paginatedRows = filteredRows.slice(pageStart, pageStart + EMPLOYEE_DETAIL_PAGE_SIZE);
  const pageEnd = pageStart + paginatedRows.length;

  function downloadEmployeeCsv() {
    if (!filteredRows.length) {
      toast.message("Nothing to export", { description: "Adjust filters to include at least one record." });
      return;
    }
    const csv = buildEmployeeAttendanceCsv(filteredRows);
    const slug = user ? slugifyFilenamePart(`${user.firstName}-${user.lastName}`) : "employee";
    downloadCsvString(`${slug}-attendance-${format(new Date(), "yyyy-MM-dd")}.csv`, csv);
    toast.success("Download started", { description: `${filteredRows.length} row(s) exported.` });
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader title="Employee attendance" description="This employee could not be found." fallbackHref="/attendance" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-sm text-muted-foreground">Check the link or return to attendance.</p>
            <Link
              href="/attendance"
              className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex items-center justify-center")}
            >
              Back to attendance
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const deptName = getDepartmentName(user.departmentId, mockDepartments);

  return (
    <>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description="Daily attendance history (mock data)."
        fallbackHref="/attendance"
        action={
          <Button type="button" className="min-h-11" disabled={!filteredRows.length} onClick={downloadEmployeeCsv}>
            <Download className="size-4" />
            Download CSV
          </Button>
        }
      />

      <Card className="mb-6">
        <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0">
          <UserAvatar firstName={user.firstName} lastName={user.lastName} size="lg" />
          <div className="min-w-0 flex-1">
            <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
              {user.firstName} {user.lastName}
              <Badge className="capitalize">{user.role}</Badge>
              {!user.isActive ? (
                <Badge variant="outline" className="text-muted-foreground">
                  Inactive
                </Badge>
              ) : null}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Department:</span> {deptName}
              </p>
              <p>
                <span className="text-muted-foreground">Designation:</span> {user.designation ?? "—"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="panel-glass mb-6 rounded-xl p-4">
        <div className="mb-3 text-sm text-muted-foreground">
          {filteredRows.length
            ? `Rows ${pageStart + 1}–${pageEnd} of ${filteredRows.length} · ${EMPLOYEE_DETAIL_PAGE_SIZE} per page`
            : "No rows match the current filters."}
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">From</span>
            <Input
              aria-label="Filter from date"
              type="date"
              className="min-h-11"
              value={fromDate}
              min={bounds.min}
              max={bounds.max}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">To</span>
            <Input
              aria-label="Filter to date"
              type="date"
              className="min-h-11"
              value={toDate}
              min={bounds.min}
              max={bounds.max}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus((v ?? "all") as AttendanceStatus | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="min-h-11 w-full min-w-0" aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full"
              onClick={() => {
                setFromDate(bounds.min);
                setToDate(bounds.max);
                setStatus("all");
                setPage(1);
              }}
            >
              Reset filters
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Days (filtered)" value={stats.total} icon={CalendarDays} />
        <StatCard label="Present" value={stats.present} icon={UserCheck} />
        <StatCard label="Absent" value={stats.absent} icon={UserX} />
        <StatCard label="Late" value={stats.late} icon={Clock} />
        <StatCard label="Half day" value={stats.halfDay} icon={Coffee} />
        <StatCard
          label="Avg. working hours"
          value={stats.avg == null ? "—" : formatWorkingMinutesDisplay(stats.avg)}
          icon={Users}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance by day</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="panel-glass rounded-none border-t border-border/60 sm:rounded-b-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Working hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length ? (
                  paginatedRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="whitespace-nowrap tabular-nums font-medium">{row.date}</TableCell>
                      <TableCell className="text-muted-foreground">{dayNameForDate(row.date)}</TableCell>
                      <TableCell className="tabular-nums">{formatTimeFromIso(row.checkIn)}</TableCell>
                      <TableCell className="tabular-nums">{formatTimeFromIso(row.checkOut)}</TableCell>
                      <TableCell className="tabular-nums">{formatWorkingMinutesDisplay(row.workingMinutes)}</TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center text-sm text-muted-foreground">
                      No attendance records match these filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {filteredRows.length > 0 ? (
              <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Page {safePage} of {totalPages} · {EMPLOYEE_DETAIL_PAGE_SIZE} rows per page
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-9"
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={safePage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-9"
                    onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function AttendanceEmployeePage() {
  return (
    <RequireRole allow="admin">
      <AttendanceEmployeeDetail />
    </RequireRole>
  );
}
