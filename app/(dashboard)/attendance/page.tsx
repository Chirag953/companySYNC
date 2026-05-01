"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, Clock, Coffee, Download, RotateCcw, UserX, Users } from "lucide-react";
import { AttendanceCalendar } from "@/components/shared/AttendanceCalendar";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DataTable } from "@/components/shared/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { mockAttendanceRecords, mockAttendanceRules } from "@/lib/mock-data/attendance";
import { segmentedTabsListClass, segmentedTabsTriggerClass } from "@/lib/segmented-tab-styles";
import { mockDepartments } from "@/lib/mock-data/departments";
import { getUserById } from "@/lib/mock-data/users";
import { useAuth } from "@/lib/auth-context";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import {
  buildCompanyAttendanceCsv,
  downloadCsvString,
  formatAttendanceStatusForCsv,
  formatTimeFromIso,
  formatWorkingMinutesDisplay,
  getAttendanceDateBounds,
  getDepartmentName,
  getEmployeeFullName,
  isDateWithinRange,
  normalizeDateRange,
  type EnrichedAttendanceRow,
} from "@/lib/attendance-utils";
import { toast } from "sonner";

const DATE_BOUNDS = getAttendanceDateBounds(mockAttendanceRecords);

const ADMIN_PAGE_SIZE = 20;

function AdminCompanyAttendance() {
  const [fromDate, setFromDate] = useState(DATE_BOUNDS.min);
  const [toDate, setToDate] = useState(DATE_BOUNDS.max);
  const [department, setDepartment] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState(1);

  const range = useMemo(() => normalizeDateRange(fromDate, toDate), [fromDate, toDate]);

  const enriched = useMemo<EnrichedAttendanceRow[]>(() => {
    return mockAttendanceRecords.map((record) => {
      const u = getUserById(record.userId);
      const departmentId = u?.departmentId;
      return {
        ...record,
        employeeName: getEmployeeFullName(u, record.userId),
        email: u?.email ?? "",
        departmentName: getDepartmentName(departmentId, mockDepartments),
        departmentId,
      };
    });
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched.filter((row) => {
      if (!isDateWithinRange(row.date, range.from, range.to)) return false;
      if (department !== "all" && row.departmentId !== department) return false;
      if (!q) return true;
      return (
        row.employeeName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.departmentName.toLowerCase().includes(q) ||
        row.date.includes(q) ||
        row.status.toLowerCase().includes(q) ||
        formatAttendanceStatusForCsv(row.status).toLowerCase().includes(q)
      );
    });
  }, [enriched, range.from, range.to, department, search]);

  const selectedRows = useMemo(
    () => filteredRows.filter((row) => selectedIds.has(row.id)),
    [filteredRows, selectedIds],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ADMIN_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * ADMIN_PAGE_SIZE;
  const paginatedRows = filteredRows.slice(pageStart, pageStart + ADMIN_PAGE_SIZE);
  const pageEnd = pageStart + paginatedRows.length;

  const allPageSelected =
    paginatedRows.length > 0 && paginatedRows.every((row) => selectedIds.has(row.id));

  const todayStats = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayRows = enriched.filter((row) => {
      if (row.date !== today) return false;
      if (department !== "all" && row.departmentId !== department) return false;
      return true;
    });
    const total = todayRows.length;
    const present = todayRows.filter((r) => r.status === "present" || r.status === "on_time").length;
    const absent = todayRows.filter((r) => r.status === "absent").length;
    const late = todayRows.filter((r) => r.status === "late").length;
    const halfDay = todayRows.filter((r) => r.status === "half_day").length;
    return { total, present, absent, late, halfDay };
  }, [department, enriched]);

  function toggleRow(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllOnPage(checked: boolean) {
    setSelectedIds((current) => {
      if (checked) {
        return new Set([...current, ...paginatedRows.map((row) => row.id)]);
      }
      const visible = new Set(paginatedRows.map((row) => row.id));
      return new Set([...current].filter((id) => !visible.has(id)));
    });
  }

  function clearFilters() {
    setFromDate(DATE_BOUNDS.min);
    setToDate(DATE_BOUNDS.max);
    setDepartment("all");
    setSearch("");
    setSelectedIds(new Set());
    setPage(1);
  }

  function downloadSelectedCsv() {
    if (!selectedRows.length) {
      toast.message("No rows selected", { description: "Select at least one row or use download all filtered." });
      return;
    }
    const csv = buildCompanyAttendanceCsv(selectedRows);
    downloadCsvString(`company-attendance-selected-${format(new Date(), "yyyy-MM-dd")}.csv`, csv);
    toast.success("Download started", { description: `${selectedRows.length} row(s) exported.` });
  }

  function downloadAllFilteredCsv() {
    if (!filteredRows.length) {
      toast.message("Nothing to export", { description: "Adjust filters to include at least one record." });
      return;
    }
    const csv = buildCompanyAttendanceCsv(filteredRows);
    downloadCsvString(`company-attendance-${format(new Date(), "yyyy-MM-dd")}.csv`, csv);
    toast.success("Download started", { description: `${filteredRows.length} row(s) exported.` });
  }

  return (
    <div className="space-y-4">
      <div className="panel-glass rounded-xl p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search</span>
            <Input
              aria-label="Search company attendance"
              placeholder="Name, email, department, date, status…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="min-h-11"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">From</span>
            <Input
              aria-label="Filter from date"
              type="date"
              className="min-h-11"
              value={fromDate}
              min={DATE_BOUNDS.min}
              max={DATE_BOUNDS.max}
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
              min={DATE_BOUNDS.min}
              max={DATE_BOUNDS.max}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department</p>
            <Select
              value={department}
              onValueChange={(v) => {
                setDepartment(v ?? "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="min-h-11 w-full min-w-0" aria-label="Filter by department">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {mockDepartments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-end gap-2 sm:flex-row sm:items-end">
            <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" onClick={clearFilters}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {filteredRows.length
              ? `Rows ${pageStart + 1}–${pageEnd} of ${filteredRows.length} · ${ADMIN_PAGE_SIZE} per page${
                  selectedRows.length > 0 ? ` · ${selectedRows.length} selected (any page)` : ""
                }`
              : "No rows match the current filters."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={!selectedRows.length}
              onClick={downloadSelectedCsv}
            >
              <Download className="size-4" />
              Download selected
            </Button>
            <Button type="button" className="min-h-11" disabled={!filteredRows.length} onClick={downloadAllFilteredCsv}>
              <Download className="size-4" />
              Download all filtered
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Today&apos;s attendance snapshot
          {department !== "all"
            ? ` · ${mockDepartments.find((d) => d.id === department)?.name ?? "Selected department"}`
            : ""}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Today records" value={todayStats.total} icon={CalendarDays} />
          <StatCard label="Present today" value={todayStats.present} icon={Users} />
          <StatCard label="Absent today" value={todayStats.absent} icon={UserX} />
          <StatCard label="Late today" value={todayStats.late} icon={Clock} />
          <StatCard label="Half day today" value={todayStats.halfDay} icon={Coffee} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company attendance</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="panel-glass rounded-none border-t border-border/60 sm:rounded-b-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      aria-label="Select all attendance rows on this page"
                      checked={allPageSelected}
                      onCheckedChange={(checked) => toggleAllOnPage(Boolean(checked))}
                    />
                  </TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length ? (
                  paginatedRows.map((row) => {
                    const selected = selectedIds.has(row.id);
                    return (
                      <TableRow key={row.id} data-state={selected ? "selected" : undefined}>
                        <TableCell>
                          <Checkbox
                            aria-label={`Select ${row.employeeName} on ${row.date}`}
                            checked={selected}
                            onCheckedChange={(checked) => toggleRow(row.id, Boolean(checked))}
                          />
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/attendance/employee/${row.userId}`}
                            className={cn(
                              buttonVariants({ variant: "link" }),
                              "h-auto min-h-0 p-0 font-medium text-primary underline-offset-4",
                            )}
                          >
                            {row.employeeName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{row.departmentName}</TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums">{row.date}</TableCell>
                        <TableCell className="tabular-nums">{formatTimeFromIso(row.checkIn)}</TableCell>
                        <TableCell className="tabular-nums">{formatTimeFromIso(row.checkOut)}</TableCell>
                        <TableCell className="tabular-nums">{formatWorkingMinutesDisplay(row.workingMinutes)}</TableCell>
                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center text-sm text-muted-foreground">
                      No attendance records match these filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {filteredRows.length > 0 ? (
              <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Page {safePage} of {totalPages} · {ADMIN_PAGE_SIZE} rows per page
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
    </div>
  );
}

export default function AttendancePage() {
  const { user, role } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const mine = useMemo(
    () => mockAttendanceRecords.filter((a) => a.userId === user?.id),
    [user?.id],
  );

  const teamToday = useMemo(
    () => mockAttendanceRecords.filter((a) => a.date === date),
    [date],
  );

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      { accessorKey: "date", header: "Date" },
      {
        accessorKey: "checkIn",
        header: "Check-in",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{formatTimeFromIso(getValue() as string | undefined)}</span>
        ),
      },
      {
        accessorKey: "checkOut",
        header: "Check-out",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{formatTimeFromIso(getValue() as string | undefined)}</span>
        ),
      },
      {
        accessorKey: "workingMinutes",
        header: "Hours",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{formatWorkingMinutesDisplay(getValue() as number | undefined)}</span>
        ),
      },
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
    return getDepartmentName(u?.departmentId, mockDepartments);
  };

  const managerCols = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      {
        id: "employeeName",
        accessorFn: (row) => {
          const u = getUserById(row.userId);
          return getEmployeeFullName(u, row.userId);
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
            <DataTable
              key={user?.id ?? "attendance-self"}
              columns={columns}
              data={mine}
              pageSize={15}
              searchPlaceholder="Search attendance…"
            />
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
            {role === "admin" ? "Company attendance" : "Today attendance"}
          </TabsTrigger>
          <TabsTrigger value="rules" className={segmentedTabsTriggerClass}>
            Attendance rules
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-6 space-y-4">
          {role === "admin" ? (
            <AdminCompanyAttendance />
          ) : (
            <>
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
                  <CardTitle className="text-base">Team today</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    key={date}
                    columns={managerCols}
                    data={teamToday}
                    pageSize={15}
                    searchPlaceholder="Search by employee, department, dates…"
                  />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        <TabsContent value="rules" className="mt-6">
          {rulesCard({ editable: role === "admin" })}
        </TabsContent>
      </Tabs>
    </>
  );
}
