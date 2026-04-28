"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { FileUpload } from "@/components/shared/FileUpload";
import { getTaskById } from "@/lib/mock-data/tasks";
import { getUserById } from "@/lib/mock-data/users";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const task = getTaskById(params.id);
  const { role } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);
  const assignee = task ? getUserById(task.assigneeId) : undefined;

  if (!task) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Task not found.</p>
        <Link
          href="/tasks"
          className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex items-center justify-center")}
        >
          Back to tasks
        </Link>
      </div>
    );
  }

  const readOnlyAdmin = role === "admin";

  return (
    <>
      <PageHeader title={task.title} fallbackHref="/tasks" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
            <CardTitle className="text-xl">Description</CardTitle>
            <p className="text-sm text-muted-foreground">{task.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted-foreground">Assignee</span>
              {assignee ? (
                <div className="flex items-center gap-2">
                  <UserAvatar firstName={assignee.firstName} lastName={assignee.lastName} size="sm" />
                  {assignee.firstName} {assignee.lastName}
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">Due</span>
              <span className="text-sm font-medium">{task.dueDate?.slice(0, 10) ?? "—"}</span>
            </div>
            {!readOnlyAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Select defaultValue={task.status} disabled={readOnlyAdmin}>
                  <SelectTrigger className="w-44 min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FileUpload onFilesSelected={() => toast.message("Mock: file staged")} />
            <ul className="text-sm text-muted-foreground">
              {task.attachments.map((a) => (
                <li key={a.id}>{a.fileName}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subtasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {task.subtasks.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={s.isCompleted} disabled={readOnlyAdmin} />
                {s.title}
              </label>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {task.comments.map((c) => {
              const u = getUserById(c.userId);
              return (
                <div key={c.id} className="flex gap-3 text-sm">
                  {u ? <UserAvatar firstName={u.firstName} lastName={u.lastName} size="sm" /> : null}
                  <div>
                    <p className="font-medium">
                      {u ? `${u.firstName} ${u.lastName}` : "User"}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-muted-foreground">{c.content}</p>
                  </div>
                </div>
              );
            })}
            <Separator />
            <Button variant="secondary" className="min-h-11" disabled={readOnlyAdmin} onClick={() => toast.message("Mock comment")}>
              Add comment
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Task history</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11"
            type="button"
            onClick={() => setHistoryOpen((o) => !o)}
          >
            {historyOpen ? "Hide" : "Show"}
          </Button>
        </CardHeader>
        {historyOpen ? (
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {task.history.map((h) => (
                <li key={h.id}>
                  {h.fieldChanged}: {h.oldValue ?? "—"} → {h.newValue ?? "—"} at{" "}
                  {new Date(h.changedAt).toLocaleString()}
                </li>
              ))}
            </ul>
          </CardContent>
        ) : null}
      </Card>
    </>
  );
}
