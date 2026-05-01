"use client";

import { useEffect, useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Download, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RequireRole } from "@/components/role-gates";
import { useAuth } from "@/lib/auth-context";
import { mockDepartments } from "@/lib/mock-data/departments";
import { mockAuditLogs } from "@/lib/mock-data/audit-log";
import { mockUsers } from "@/lib/mock-data/users";
import type { AuditLogCategory, AuditLogEntry, Role, User } from "@/lib/types";
import {
  auditLogActorLabel,
  auditLogSubjectLabel,
  filterAuditLogsForCurrentUser,
} from "@/lib/audit-log-scope";

const categories: Array<AuditLogCategory | "all"> = [
  "all",
  "auth",
  "leave",
  "attendance",
  "task",
  "user",
  "document",
  "team",
  "settings",
];

const roleOptions: Array<Role | "all"> = ["all", "admin", "manager", "employee"];
const userById = new Map(mockUsers.map((u) => [u.id, u]));
const departmentById = new Map(mockDepartments.map((d) => [d.id, d.name]));
const PAGE_SIZE = 20;

function categoryVariant(c: AuditLogCategory): "default" | "secondary" | "outline" {
  if (c === "auth") return "secondary";
  if (c === "leave" || c === "attendance") return "default";
  return "outline";
}

function roleLabel(role: Role | "all") {
  return role === "all" ? "All roles" : role.charAt(0).toUpperCase() + role.slice(1);
}

function userDepartmentName(userId: string) {
  const departmentId = userById.get(userId)?.departmentId;
  return departmentId ? departmentById.get(departmentId) ?? "Unassigned" : "Unassigned";
}

function rowUsers(row: AuditLogEntry): User[] {
  return [userById.get(row.actorUserId), userById.get(row.subjectUserId)].filter(Boolean) as User[];
}

function escapeCsvValue(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export default function AuditLogPage() {
  return (
    <RequireRole allow={["admin", "manager"]}>
      <AuditLogPageInner />
    </RequireRole>
  );
}

function AuditLogPageInner() {
  const { user } = useAuth();
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState<Role | "all">("all");
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState(1);

  const filteredLogs = useMemo(() => {
    if (!user) return [];
    const rows = filterAuditLogsForCurrentUser(user, mockAuditLogs);
    const sorted = [...rows].sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );
    const query = search.trim().toLowerCase();

    return sorted.filter((row) => {
      const occurredAt = new Date(row.occurredAt);
      const rowDate = format(occurredAt, "yyyy-MM-dd");
      const rowTime = format(occurredAt, "HH:mm");
      const users = rowUsers(row);

      if (category !== "all" && row.category !== category) return false;
      if (department !== "all" && !users.some((u) => u.departmentId === department)) return false;
      if (role !== "all" && !users.some((u) => u.role === role)) return false;
      if (date && rowDate !== date) return false;
      if (fromTime && rowTime < fromTime) return false;
      if (toTime && rowTime > toTime) return false;

      if (!query) return true;

      return [
        auditLogActorLabel(row.actorUserId),
        auditLogSubjectLabel(row.subjectUserId),
        userDepartmentName(row.actorUserId),
        userDepartmentName(row.subjectUserId),
        row.title,
        row.description,
        row.action,
        row.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [category, date, department, fromTime, role, search, toTime, user]);

  useEffect(() => {
    setPage(1);
  }, [category, date, department, fromTime, role, search, toTime]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedLogs = filteredLogs.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = pageStart + paginatedLogs.length;

  const selectedRows = filteredLogs.filter((row) => selectedIds.has(row.id));
  const allVisibleSelected = paginatedLogs.length > 0 && paginatedLogs.every((row) => selectedIds.has(row.id));

  function toggleRow(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function toggleAllVisible(checked: boolean) {
    setSelectedIds((current) => {
      if (checked) {
        return new Set([...current, ...paginatedLogs.map((row) => row.id)]);
      }

      const visibleIds = new Set(paginatedLogs.map((row) => row.id));
      return new Set([...current].filter((id) => !visibleIds.has(id)));
    });
  }

  function clearFilters() {
    setCategory("all");
    setDepartment("all");
    setRole("all");
    setDate("");
    setFromTime("");
    setToTime("");
    setSearch("");
    setSelectedIds(new Set());
  }

  function exportCsv() {
    const rows = selectedRows.length > 0 ? selectedRows : filteredLogs;
    if (!rows.length) return;

    const header = [
      "Occurred at",
      "Actor",
      "Actor role",
      "Actor department",
      "Subject",
      "Subject role",
      "Subject department",
      "Category",
      "Action",
      "Title",
      "Description",
    ];
    const lines = rows.map((row) => {
      const actor = userById.get(row.actorUserId);
      const subject = userById.get(row.subjectUserId);
      return [
        format(new Date(row.occurredAt), "yyyy-MM-dd HH:mm"),
        auditLogActorLabel(row.actorUserId),
        actor?.role ?? "",
        userDepartmentName(row.actorUserId),
        auditLogSubjectLabel(row.subjectUserId),
        subject?.role ?? "",
        userDepartmentName(row.subjectUserId),
        row.category,
        row.action,
        row.title,
        row.description,
      ].map(escapeCsvValue).join(",");
    });
    const csv = [header.map(escapeCsvValue).join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const description =
    user?.role === "admin"
      ? "Company-wide important activities for admins, managers, and employees (mock data)."
      : "Your actions and your team employees’ activities (mock data).";

  if (!user) return null;

  return (
    <>
      <PageHeader
        title="Audit log"
        description={description}
        action={
          <Button type="button" className="min-h-11" onClick={exportCsv} disabled={!filteredLogs.length}>
            <Download className="size-4" />
            {selectedRows.length ? `Export selected (${selectedRows.length})` : "Export CSV"}
          </Button>
        }
      />
      <div className="space-y-4">
        <div className="panel-glass rounded-xl p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search</span>
              <Input
                aria-label="Search audit logs"
                placeholder="Search activity, actor, action..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-h-11"
              />
            </label>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
              <Select value={category} onValueChange={(v) => setCategory((v ?? "all") as (typeof categories)[number])}>
                <SelectTrigger className="min-h-11" aria-label="Filter by category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c === "all" ? "All categories" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Departments</p>
              <Select value={department} onValueChange={(v) => setDepartment(v ?? "all")}>
                <SelectTrigger className="min-h-11" aria-label="Filter by department">
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
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">User role</p>
              <Select value={role} onValueChange={(v) => setRole((v ?? "all") as Role | "all")}>
                <SelectTrigger className="min-h-11" aria-label="Filter by role">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {roleLabel(r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</span>
              <Input
                aria-label="Filter by date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="min-h-11"
              />
            </label>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  aria-label="Filter from time"
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="min-h-11"
                />
                <Input
                  aria-label="Filter to time"
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="min-h-11"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {paginatedLogs.length ? `${pageStart + 1}-${pageEnd}` : 0} of {filteredLogs.length} rows.
              Select rows to export a specific set, or export the current filtered view.
            </p>
            <Button type="button" variant="outline" size="sm" className="min-h-9 w-fit" onClick={clearFilters}>
              <RotateCcw className="size-4" />
              Reset filters
            </Button>
          </div>
        </div>

        <div className="panel-glass rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    aria-label="Select all visible audit logs"
                    checked={allVisibleSelected}
                    onCheckedChange={(checked) => toggleAllVisible(Boolean(checked))}
                  />
                </TableHead>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length ? (
                paginatedLogs.map((row) => {
                  const occurredAt = new Date(row.occurredAt);
                  const actor = userById.get(row.actorUserId);
                  const subject = userById.get(row.subjectUserId);
                  const selected = selectedIds.has(row.id);

                  return (
                    <TableRow key={row.id} data-state={selected && "selected"}>
                      <TableCell>
                        <Checkbox
                          aria-label={`Select audit log ${row.title}`}
                          checked={selected}
                          onCheckedChange={(checked) => toggleRow(row.id, Boolean(checked))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="whitespace-nowrap">
                          <div className="text-sm font-medium">{format(occurredAt, "MMM d, yyyy HH:mm")}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(occurredAt, { addSuffix: true })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-36">
                          <div className="font-medium">{auditLogActorLabel(row.actorUserId)}</div>
                          <div className="text-xs capitalize text-muted-foreground">
                            {actor?.role ?? "Unknown"} · {userDepartmentName(row.actorUserId)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-36">
                          <div className="font-medium">{auditLogSubjectLabel(row.subjectUserId)}</div>
                          <div className="text-xs capitalize text-muted-foreground">
                            {subject?.role ?? "Unknown"} · {userDepartmentName(row.subjectUserId)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-72 whitespace-normal">
                        <div className="font-medium">{row.title}</div>
                        <div className="text-xs text-muted-foreground">{row.description}</div>
                        <div className="mt-1 font-mono text-[10px] text-muted-foreground">{row.action}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={categoryVariant(row.category)} className="capitalize">
                          {row.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-1 py-6">
                      <p className="font-medium text-foreground">No audit logs found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting the filters or search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Page {currentPage} of {totalPages} · {PAGE_SIZE} rows per page
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-h-9"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-h-9"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
