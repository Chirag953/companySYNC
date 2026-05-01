"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addDays, format, isBefore, isWithinInterval, parseISO, startOfDay } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, CheckCircle2, CircleDashed, ListTodo, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockTasks } from "@/lib/mock-data/tasks";
import { getUserById } from "@/lib/mock-data/users";
import { mockDepartments } from "@/lib/mock-data/departments";
import { useAuth } from "@/lib/auth-context";
import type { Task, TaskStatus } from "@/lib/types";

const taskCardBg: Record<TaskStatus, string> = {
  todo: "bg-red-50 dark:bg-red-950/30",
  in_progress: "bg-yellow-50 dark:bg-yellow-950/30",
  completed: "bg-green-50 dark:bg-green-950/30",
};

const viewOptions = [
  { value: "kanban", label: "Kanban" },
  { value: "table", label: "Table" },
] as const;

const statusOptions = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
] as const;

function fullName(userId: string): string {
  const u = getUserById(userId);
  return u ? `${u.firstName} ${u.lastName}` : userId;
}

function departmentNameForUser(userId: string): string {
  const u = getUserById(userId);
  if (!u?.departmentId) return "—";
  return mockDepartments.find((d) => d.id === u.departmentId)?.name ?? "—";
}

function designationOrRole(userId: string): string {
  const u = getUserById(userId);
  if (!u) return "—";
  return u.designation ?? u.role;
}

function subtaskProgress(task: Task): string {
  const total = task.subtasks.length;
  if (total === 0) return "—";
  const done = task.subtasks.filter((s) => s.isCompleted).length;
  return `${done}/${total}`;
}

function isDueSoonOrOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "completed") return false;
  try {
    const due = startOfDay(parseISO(task.dueDate));
    const today = startOfDay(new Date());
    const soonEnd = startOfDay(addDays(today, 7));
    if (isBefore(due, today)) return true;
    return isWithinInterval(due, { start: today, end: soonEnd });
  } catch {
    return false;
  }
}

function AdminTaskCard({ task }: { task: Task }) {
  return (
    <Card className={cn("shadow-sm", taskCardBg[task.status])}>
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-base leading-snug">
          <Link href={`/tasks/${task.id}`} className="hover:underline">
            {task.title}
          </Link>
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Assignee</p>
            <p className="mt-0.5 font-medium text-foreground">{fullName(task.assigneeId)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Department</p>
            <p className="mt-0.5 text-foreground">{departmentNameForUser(task.assigneeId)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</p>
            <p className="mt-0.5 capitalize text-foreground">{designationOrRole(task.assigneeId)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Created by</p>
            <p className="mt-0.5 font-medium text-foreground">{fullName(task.createdById)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Due</p>
            <p className="mt-0.5 tabular-nums text-foreground">{task.dueDate?.slice(0, 10) ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Progress</p>
            <p className="mt-0.5 tabular-nums text-foreground">{subtaskProgress(task)} subtasks</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Updated</p>
            <p className="mt-0.5 tabular-nums text-foreground">{task.updatedAt.slice(0, 10)}</p>
          </div>
        </div>
        <Link
          href={`/tasks/${task.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "min-h-9 w-fit")}
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
}

export default function TasksPage() {
  const { user, role } = useAuth();
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [priority, setPriority] = useState<string>("all");
  const [statusTab, setStatusTab] = useState<TaskStatus>("todo");

  const [filterStatus, setFilterStatus] = useState<"all" | TaskStatus>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterCreator, setFilterCreator] = useState<string>("all");

  useEffect(() => {
    if (role === "admin") {
      setView("table");
    }
  }, [role]);

  const scoped = useMemo(() => {
    if (role === "admin") return mockTasks;
    if (role === "manager") return mockTasks;
    return mockTasks.filter((t) => t.assigneeId === user?.id);
  }, [role, user?.id]);

  const assigneeOptions = useMemo(() => {
    const ids = [...new Set(scoped.map((t) => t.assigneeId))].sort();
    return ids.map((id) => ({ id, label: fullName(id) }));
  }, [scoped]);

  const creatorOptions = useMemo(() => {
    const ids = [...new Set(scoped.map((t) => t.createdById))].sort();
    return ids.map((id) => ({ id, label: fullName(id) }));
  }, [scoped]);

  const filtered = useMemo(() => {
    return scoped.filter((t) => {
      if (priority !== "all" && t.priority !== priority) return false;
      if (role !== "admin") return true;
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterDepartment !== "all") {
        const assignee = getUserById(t.assigneeId);
        if (assignee?.departmentId !== filterDepartment) return false;
      }
      if (filterAssignee !== "all" && t.assigneeId !== filterAssignee) return false;
      if (filterCreator !== "all" && t.createdById !== filterCreator) return false;
      return true;
    });
  }, [
    scoped,
    priority,
    role,
    filterStatus,
    filterDepartment,
    filterAssignee,
    filterCreator,
  ]);

  const adminStats = useMemo(() => {
    if (role !== "admin") return null;
    const total = filtered.length;
    const todo = filtered.filter((t) => t.status === "todo").length;
    const inProgress = filtered.filter((t) => t.status === "in_progress").length;
    const completed = filtered.filter((t) => t.status === "completed").length;
    const dueRisk = filtered.filter((t) => isDueSoonOrOverdue(t)).length;
    return { total, todo, inProgress, completed, dueRisk };
  }, [filtered, role]);

  const columns = useMemo<ColumnDef<Task>[]>(() => {
    if (role === "admin") {
      return [
        {
          accessorKey: "title",
          header: "Task",
          cell: ({ row }) => (
            <Link href={`/tasks/${row.original.id}`} className="font-medium hover:underline">
              {row.original.title}
            </Link>
          ),
        },
        {
          id: "assignee",
          accessorFn: (row) => fullName(row.assigneeId),
          header: "Assignee",
          cell: ({ row }) => (
            <div>
              <p className="font-medium">{fullName(row.original.assigneeId)}</p>
              <p className="text-xs capitalize text-muted-foreground">{designationOrRole(row.original.assigneeId)}</p>
            </div>
          ),
        },
        {
          id: "department",
          accessorFn: (row) => departmentNameForUser(row.assigneeId),
          header: "Department",
          cell: ({ row }) => (
            <span className="text-muted-foreground">{departmentNameForUser(row.original.assigneeId)}</span>
          ),
        },
        {
          id: "createdBy",
          accessorFn: (row) => fullName(row.createdById),
          header: "Created by",
          cell: ({ row }) => <span className="font-medium">{fullName(row.original.createdById)}</span>,
        },
        {
          accessorKey: "priority",
          header: "Priority",
          cell: ({ getValue }) => <PriorityBadge priority={getValue() as Task["priority"]} />,
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ getValue }) => <StatusBadge status={getValue() as Task["status"]} />,
        },
        {
          accessorKey: "dueDate",
          header: "Due",
          cell: ({ getValue }) => (getValue() ? String(getValue()).slice(0, 10) : "—"),
        },
        {
          id: "progress",
          accessorFn: (row) => subtaskProgress(row),
          header: "Progress",
          cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{subtaskProgress(row.original)}</span>,
        },
        {
          accessorKey: "updatedAt",
          header: "Updated",
          cell: ({ getValue }) => <span className="tabular-nums">{String(getValue()).slice(0, 10)}</span>,
        },
      ];
    }
    return [
      {
        accessorKey: "title",
        header: "Task",
        cell: ({ row }) => (
          <Link href={`/tasks/${row.original.id}`} className="font-medium hover:underline">
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: "assigneeId",
        header: "Assignee",
        cell: ({ getValue }) => {
          const id = getValue() as string;
          return fullName(id);
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ getValue }) => <PriorityBadge priority={getValue() as Task["priority"]} />,
      },
      {
        accessorKey: "dueDate",
        header: "Due",
        cell: ({ getValue }) => (getValue() ? String(getValue()).slice(0, 10) : "—"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as Task["status"]} />,
      },
    ];
  }, [role]);

  const canCreate = role === "manager" || role === "employee";

  const columnsByStatus = (status: TaskStatus) => filtered.filter((t) => t.status === status);

  const isAdmin = role === "admin";

  return (
    <>
      <PageHeader
        title="Tasks"
        description={
          role === "admin"
            ? "Company-wide tasks (read-only in Phase 1 mock)."
            : role === "manager"
              ? "Create, assign, and track team work."
              : "Your assigned tasks and personal tasks."
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              value={view}
              onValueChange={setView}
              items={viewOptions}
              ariaLabel="Task view"
              className="w-fit"
            />
            {canCreate ? (
              <Link href="/tasks/new" className={cn(buttonVariants(), "min-h-11 inline-flex items-center justify-center")}>
                Create task
              </Link>
            ) : null}
          </div>
        }
      />

      {isAdmin && adminStats ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total tasks" value={adminStats.total} icon={ListTodo} />
          <StatCard label="Todo" value={adminStats.todo} icon={CircleDashed} />
          <StatCard label="In progress" value={adminStats.inProgress} icon={Users} />
          <StatCard label="Completed" value={adminStats.completed} icon={CheckCircle2} />
          <StatCard label="Due soon / overdue" value={adminStats.dueRisk} icon={AlertTriangle} />
        </div>
      ) : null}

      <div className={cn("mb-4", isAdmin && "panel-glass space-y-4 rounded-xl p-4")}>
        {isAdmin ? (
          <div className="space-y-1">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Filters</h2>
            <p className="text-xs text-muted-foreground">
              Narrow company-wide tasks by priority, workflow status, department, assignee, and who created the task.
            </p>
          </div>
        ) : null}

        <div
          className={cn(
            "gap-3",
            isAdmin ? "grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" : "flex flex-wrap items-end",
          )}
        >
          <div className="space-y-1.5">
            <label htmlFor="tasks-filter-priority" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Priority
            </label>
            <Select value={priority} onValueChange={(v) => setPriority(v ?? "all")}>
              <SelectTrigger
                id="tasks-filter-priority"
                className={cn("min-h-11 w-full", !isAdmin && "w-44")}
                aria-label="Filter by priority"
              >
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isAdmin ? (
            <>
              <div className="space-y-1.5">
                <label htmlFor="tasks-filter-status" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </label>
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus((v ?? "all") as "all" | TaskStatus)}>
                  <SelectTrigger id="tasks-filter-status" className="min-h-11 w-full min-w-0" aria-label="Filter by status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="tasks-filter-department" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Department
                </label>
                <Select value={filterDepartment} onValueChange={(v) => setFilterDepartment(v ?? "all")}>
                  <SelectTrigger id="tasks-filter-department" className="min-h-11 w-full min-w-0" aria-label="Filter by department">
                    <SelectValue placeholder="All departments" />
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
                <label htmlFor="tasks-filter-assignee" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Assignee
                </label>
                <Select value={filterAssignee} onValueChange={(v) => setFilterAssignee(v ?? "all")}>
                  <SelectTrigger id="tasks-filter-assignee" className="min-h-11 w-full min-w-0" aria-label="Filter by assignee">
                    <SelectValue placeholder="All assignees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All assignees</SelectItem>
                    {assigneeOptions.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="tasks-filter-creator" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Created by
                </label>
                <Select value={filterCreator} onValueChange={(v) => setFilterCreator(v ?? "all")}>
                  <SelectTrigger id="tasks-filter-creator" className="min-h-11 w-full min-w-0" aria-label="Filter by creator">
                    <SelectValue placeholder="All creators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All creators</SelectItem>
                    {creatorOptions.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col justify-end space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</span>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 w-full sm:w-auto"
                  onClick={() => {
                    setPriority("all");
                    setFilterStatus("all");
                    setFilterDepartment("all");
                    setFilterAssignee("all");
                    setFilterCreator("all");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {isAdmin ? (
        <p className="mb-4 text-xs text-muted-foreground">
          Showing {filtered.length} task{filtered.length === 1 ? "" : "s"} for the current filters · snapshot as of{" "}
          <span className="tabular-nums">{format(new Date(), "MMM d, yyyy")}</span>
        </p>
      ) : null}

      {view === "table" ? (
        <DataTable columns={columns} data={filtered} pageSize={15} searchPlaceholder="Search tasks…" />
      ) : (
        <div className="space-y-5">
          <SegmentedControl
            value={statusTab}
            onValueChange={setStatusTab}
            items={statusOptions}
            ariaLabel="Task status filter"
            triggerClassName="flex-1"
          />
          <div className="space-y-5">
            {columnsByStatus(statusTab).length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                No tasks match this status and priority filter.
              </p>
            ) : (
              columnsByStatus(statusTab).map((task) =>
                isAdmin ? (
                  <AdminTaskCard key={task.id} task={task} />
                ) : (
                  <Card key={task.id} className={cn("shadow-sm", taskCardBg[task.status])}>
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-base leading-snug">
                        <Link href={`/tasks/${task.id}`} className="hover:underline">
                          {task.title}
                        </Link>
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Due: {task.dueDate?.slice(0, 10) ?? "—"}
                    </CardContent>
                  </Card>
                ),
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
