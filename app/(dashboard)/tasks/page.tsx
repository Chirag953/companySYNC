"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TaskForm, type TaskFormValues } from "@/components/forms/TaskForm";
import { mockTasks } from "@/lib/mock-data/tasks";
import { getUserById } from "@/lib/mock-data/users";
import { useAuth } from "@/lib/auth-context";
import type { Task, TaskStatus } from "@/lib/types";
import { toast } from "sonner";

export default function TasksPage() {
  const { user, role } = useAuth();
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [priority, setPriority] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  const scoped = useMemo(() => {
    if (role === "admin") return mockTasks;
    if (role === "manager") return mockTasks;
    return mockTasks.filter((t) => t.assigneeId === user?.id);
  }, [role, user?.id]);

  const filtered = useMemo(() => {
    return scoped.filter((t) => (priority === "all" ? true : t.priority === priority));
  }, [scoped, priority]);

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
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
          const u = getUserById(id);
          return u ? `${u.firstName} ${u.lastName}` : id;
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
    ],
    [],
  );

  const canCreate = role === "manager" || role === "employee";

  const columnsByStatus = (status: TaskStatus) =>
    filtered.filter((t) => t.status === status);

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
            <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "table")}>
              <TabsList>
                <TabsTrigger value="kanban" className="min-h-11">
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="table" className="min-h-11">
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {canCreate ? (
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger className={cn(buttonVariants(), "min-h-11")}>Create task</SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>New task</SheetTitle>
                  </SheetHeader>
                  <TaskForm
                    onCancel={() => setSheetOpen(false)}
                    onSubmit={(v: TaskFormValues) => {
                      toast.success(`Mock: created “${v.title}”`);
                      setSheetOpen(false);
                    }}
                  />
                </SheetContent>
              </Sheet>
            ) : null}
          </div>
        }
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={priority} onValueChange={(v) => setPriority(v ?? "all")}>
          <SelectTrigger className="w-44 min-h-11">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {view === "table" ? (
        <DataTable columns={columns} data={filtered} searchPlaceholder="Search tasks…" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {(["todo", "in_progress", "completed"] as TaskStatus[]).map((status) => (
            <div key={status} className="space-y-3">
              <h3 className="text-sm font-semibold capitalize">{status.replace("_", " ")}</h3>
              <div className="space-y-3">
                {columnsByStatus(status).map((task) => (
                  <Card key={task.id} className="shadow-sm">
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
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
