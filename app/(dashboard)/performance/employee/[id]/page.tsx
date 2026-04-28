"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { RequireRole } from "@/components/role-gates";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { managerVisibleUserIds } from "@/lib/audit-log-scope";
import { mockTasks } from "@/lib/mock-data/tasks";
import { mockDepartments } from "@/lib/mock-data/departments";
import { getUserById, mockUsers } from "@/lib/mock-data/users";
import { useAuth } from "@/lib/auth-context";
import type { TaskStatus } from "@/lib/types";

function escapeCsvValue(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function assignedByLabel(createdById: string) {
  const u = getUserById(createdById);
  return u ? `${u.firstName} ${u.lastName}` : createdById;
}

type TaskViewTab = "all" | "active" | "completed";

const TASK_VIEW_ITEMS: { value: TaskViewTab; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "Open" },
  { value: "completed", label: "Completed" },
];

function canViewEmployeePerformance(
  viewerRole: string,
  viewerId: string | undefined,
  employeeId: string,
): boolean {
  if (!viewerId) return false;
  if (viewerRole === "admin") return true;
  if (viewerRole === "manager") return managerVisibleUserIds(viewerId).has(employeeId);
  return false;
}

export default function EmployeePerformanceDetailPage() {
  return (
    <RequireRole allow={["admin", "manager"]}>
      <EmployeePerformanceDetailInner />
    </RequireRole>
  );
}

function EmployeePerformanceDetailInner() {
  const params = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const [taskView, setTaskView] = useState<TaskViewTab>("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const employeeId = params.id;
  const employee = employeeId ? getUserById(employeeId) : undefined;

  const allowed =
    Boolean(employee && user && employeeId && canViewEmployeePerformance(role ?? "", user.id, employeeId));

  const employeeIndex = useMemo(() => {
    const list = mockUsers.filter((u) => u.role === "employee").sort((a, b) => a.id.localeCompare(b.id));
    return list.findIndex((u) => u.id === employeeId);
  }, [employeeId]);

  const leaderboardMetrics = useMemo(() => {
    if (employeeIndex < 0) return { tasksScore: 0, attendance: 0, onTime: 0 };
    return {
      tasksScore: 20 + (employeeIndex % 7) * 3,
      attendance: 88 + (employeeIndex % 5),
      onTime: 72 + (employeeIndex % 8),
    };
  }, [employeeIndex]);

  const assignedTasks = useMemo(() => {
    if (!employeeId) return [];
    return mockTasks.filter((t) => t.assigneeId === employeeId);
  }, [employeeId]);

  const filteredTasks = useMemo(() => {
    if (taskView === "all") return assignedTasks;
    if (taskView === "active") return assignedTasks.filter((t) => t.status !== "completed");
    return assignedTasks.filter((t) => t.status === "completed");
  }, [assignedTasks, taskView]);

  const stats = useMemo(() => {
    const total = assignedTasks.length;
    const completed = assignedTasks.filter((t) => t.status === "completed").length;
    const active = assignedTasks.filter((t) => t.status !== "completed").length;
    const todo = assignedTasks.filter((t) => t.status === "todo").length;
    const inProgress = assignedTasks.filter((t) => t.status === "in_progress").length;
    const rate = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, todo, inProgress, rate };
  }, [assignedTasks]);

  const displayTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filteredTasks;
    return filteredTasks.filter((t) => {
      const by = assignedByLabel(t.createdById).toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q) ||
        by.includes(q)
      );
    });
  }, [filteredTasks, search]);

  const selectedRows = displayTasks.filter((t) => selectedIds.has(t.id));
  const allVisibleSelected = displayTasks.length > 0 && displayTasks.every((t) => selectedIds.has(t.id));

  function toggleRow(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllVisible(checked: boolean) {
    setSelectedIds((current) => {
      if (checked) {
        return new Set([...current, ...displayTasks.map((t) => t.id)]);
      }
      const visible = new Set(displayTasks.map((t) => t.id));
      return new Set([...current].filter((id) => !visible.has(id)));
    });
  }

  function exportTasksCsv() {
    const toExport = selectedRows.length > 0 ? selectedRows : displayTasks;
    if (!toExport.length) return;

    const emp = employeeId ? getUserById(employeeId) : undefined;
    const assigneeName = emp ? `${emp.firstName} ${emp.lastName}` : "Assignee";

    const header = [
      "Task ID",
      "Title",
      "Status",
      "Priority",
      "Due (UTC)",
      "Assigned by",
      "Assigned on (UTC)",
      "Last updated (UTC)",
      "Assignee",
    ];

    const lines = toExport.map((t) =>
      [
        t.id,
        t.title,
        t.status,
        t.priority,
        t.dueDate ? format(new Date(t.dueDate), "yyyy-MM-dd HH:mm") : "",
        assignedByLabel(t.createdById),
        format(new Date(t.createdAt), "yyyy-MM-dd HH:mm"),
        format(new Date(t.updatedAt), "yyyy-MM-dd HH:mm"),
        assigneeName,
      ].map(escapeCsvValue).join(","),
    );

    const csv = [header.map(escapeCsvValue).join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safe = assigneeName.replace(/\s+/g, "-").toLowerCase();
    link.download = `performance-tasks-${safe}-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!employeeId) {
    return null;
  }

  if (!employee || employee.role !== "employee") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Employee not found.</p>
        <Link href="/performance" className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex")}>
          Back to performance
        </Link>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">You do not have access to this profile.</p>
        <Link href="/performance" className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex")}>
          Back to performance
        </Link>
      </div>
    );
  }

  const departmentName =
    mockDepartments.find((d) => d.id === employee.departmentId)?.name ?? "Unassigned";

  return (
    <>
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        description={`${departmentName} · ${employee.designation ?? "Employee"} · Task history and mock HR scores.`}
        fallbackHref="/performance"
      />

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/15 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        <UserAvatar firstName={employee.firstName} lastName={employee.lastName} size="lg" className="shrink-0" />
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{employee.email}</p>
          <p className="text-xs text-muted-foreground">
            Mock leaderboard column matches the table index; task rows below come from{" "}
            <span className="font-mono text-[11px]">mockTasks</span> assigned to this person.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Assigned tasks</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums">{stats.total}</CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Open (to do + in progress)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums">{stats.active}</CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Completion rate</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums">{stats.rate}%</CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Tasks completed (table mock)</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold tabular-nums">{leaderboardMetrics.tasksScore}</CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Attendance % (mock)</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold tabular-nums">{leaderboardMetrics.attendance}%</CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">On-time % (mock)</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold tabular-nums">{leaderboardMetrics.onTime}%</CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Task assignments</h2>
          <p className="text-sm text-muted-foreground">
            To do: {stats.todo} · In progress: {stats.inProgress} · Completed: {stats.completed}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:max-w-2xl sm:shrink-0 sm:items-end">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <SegmentedControl
              value={taskView}
              onValueChange={(v) => {
                setTaskView(v as TaskViewTab);
                setSelectedIds(new Set());
              }}
              items={TASK_VIEW_ITEMS}
              ariaLabel="Filter tasks by status"
              className="w-full sm:w-auto"
            />
            <Button
              type="button"
              className="min-h-11 w-full gap-2 sm:w-auto"
              onClick={exportTasksCsv}
              disabled={!displayTasks.length}
            >
              <Download className="size-4" aria-hidden />
              {selectedRows.length > 0
                ? `Export selected (${selectedRows.length})`
                : "Export CSV"}
            </Button>
          </div>
          <p className="text-right text-xs text-muted-foreground sm:max-w-sm">
            Select rows to download a subset, or export the current filtered list (all visible rows when nothing is
            selected).
          </p>
        </div>
      </div>

      <div className="mb-3">
        <Input
          aria-label="Search tasks in this view"
          placeholder="Search by title, id, status, assigner…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 max-w-md"
        />
      </div>

      <div className="panel-glass rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  aria-label="Select all visible tasks"
                  checked={allVisibleSelected}
                  onCheckedChange={(checked) => toggleAllVisible(Boolean(checked))}
                />
              </TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Assigned by</TableHead>
              <TableHead>Assigned on</TableHead>
              <TableHead>Last updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTasks.length ? (
              displayTasks.map((t) => {
                const selected = selectedIds.has(t.id);
                return (
                  <TableRow key={t.id} data-state={selected ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        aria-label={`Select task ${t.title}`}
                        checked={selected}
                        onCheckedChange={(checked) => toggleRow(t.id, Boolean(checked))}
                      />
                    </TableCell>
                    <TableCell className="max-w-[min(28rem,40vw)]">
                      <Link href={`/tasks/${t.id}`} className="font-medium text-primary hover:underline">
                        {t.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status as TaskStatus} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={t.priority} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {t.dueDate ? format(new Date(t.dueDate), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{assignedByLabel(t.createdById)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(t.createdAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(t.updatedAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-1 py-6">
                    <p className="font-medium text-foreground">No tasks in this view</p>
                    <p className="text-sm text-muted-foreground">Try another filter, search, or check mockTasks.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
