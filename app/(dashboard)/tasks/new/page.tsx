"use client";

import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RequireRole } from "@/components/role-gates";
import { TaskForm, type TaskFormValues } from "@/components/forms/TaskForm";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function NewTaskPage() {
  return (
    <RequireRole allow={["manager", "employee"]}>
      <NewTaskPageInner />
    </RequireRole>
  );
}

function NewTaskPageInner() {
  const router = useRouter();
  const { role } = useAuth();

  const description =
    role === "manager"
      ? "Define scope for your team, attach references, and split work into subtasks before you assign it."
      : "Capture what needs doing, add context and attachments, then create the task.";

  return (
    <>
      <PageHeader title="Create task" description={description} icon={ClipboardList} fallbackHref="/tasks" />

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-emerald-500/[0.14] via-card to-cyan-500/[0.12] p-[1px] shadow-lg dark:from-emerald-500/10 dark:via-card dark:to-cyan-500/10">
          <div className="rounded-[15px] bg-card/90 px-5 py-6 backdrop-blur-sm sm:px-8 sm:py-8">
            <div className="mb-6 flex flex-col gap-2 border-b border-border/40 pb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New work item</p>
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Task details
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                All fields below match the previous create flow: core task info, documents, subtasks, and an optional opening comment. Saving is a mock in Phase 1.
              </p>
            </div>
            <TaskForm
              onCancel={() => router.push("/tasks")}
              onSubmit={(v: TaskFormValues) => {
                const bits: string[] = [`“${v.title}”`];
                if (v.subtasks.length) {
                  bits.push(`${v.subtasks.length} subtask${v.subtasks.length === 1 ? "" : "s"}`);
                }
                if (v.attachmentFileNames.length) {
                  bits.push(`${v.attachmentFileNames.length} file${v.attachmentFileNames.length === 1 ? "" : "s"}`);
                }
                if (v.initialComment) bits.push("comment");
                toast.success(`Mock: created ${bits.join(" · ")}`);
                router.push("/tasks");
              }}
            />
          </div>
        </div>

        <Card className="border-border/50 bg-muted/20">
          <CardContent className="py-4 text-center text-xs text-muted-foreground">
            Need to adjust something later? Task records are mock-only until the backend ships — you can always recreate from this flow.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
