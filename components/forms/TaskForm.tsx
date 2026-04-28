"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, ListChecks, MessageSquarePlus, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { FileUpload } from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUsers } from "@/lib/mock-data/users";
import type { Priority } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  assigneeId: z.string().min(1, "Pick assignee"),
  priority: z.enum(["high", "medium", "low"]),
  dueDate: z.string().optional(),
  subtasks: z.array(z.object({ title: z.string() })),
  initialComment: z.string().optional(),
});

type SchemaValues = z.infer<typeof schema>;

export type TaskFormValues = SchemaValues & {
  attachmentFileNames: string[];
};

export function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<SchemaValues>;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
}) {
  const [attachmentNames, setAttachmentNames] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      assigneeId: defaultValues?.assigneeId ?? mockUsers[0]?.id ?? "",
      priority: (defaultValues?.priority as Priority | undefined) ?? "medium",
      dueDate: defaultValues?.dueDate ?? "",
      subtasks: defaultValues?.subtasks ?? [],
      initialComment: defaultValues?.initialComment ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  function mergeSubmit(values: SchemaValues) {
    const trimmedSubtasks = values.subtasks
      .map((s) => ({ title: s.title.trim() }))
      .filter((s) => s.title.length > 0);

    onSubmit({
      ...values,
      subtasks: trimmedSubtasks,
      initialComment: values.initialComment?.trim() ? values.initialComment.trim() : undefined,
      attachmentFileNames: attachmentNames,
    });
  }

  return (
    <form onSubmit={handleSubmit(mergeSubmit)} className="grid gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tf-title">Title</Label>
          <Input id="tf-title" className="min-h-11" {...register("title")} />
          {errors.title?.message ? (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tf-desc">Description</Label>
          <Textarea id="tf-desc" rows={3} className="min-h-[5.5rem] resize-y" {...register("description")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.firstName} {u.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigneeId?.message ? (
              <p className="text-sm text-destructive">{errors.assigneeId.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tf-due">Due date</Label>
          <Input id="tf-due" type="date" className="min-h-11" {...register("dueDate")} />
        </div>
      </div>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
            <Paperclip className="size-4 text-muted-foreground" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Documents</h3>
            <p className="text-xs text-muted-foreground">Attach briefs, specs, or reference files (mock upload).</p>
          </div>
        </div>
        <div className="panel-glass rounded-xl p-4">
          <FileUpload
            onFilesSelected={(files) => {
              setAttachmentNames((prev) => [...prev, ...files.map((f) => f.name)]);
            }}
          />
          {attachmentNames.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {attachmentNames.map((name, i) => (
                <li
                  key={`${name}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm"
                >
                  <span className="truncate font-medium">{name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${name}`}
                    onClick={() => setAttachmentNames((prev) => prev.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">No files staged yet.</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
              <ListChecks className="size-4 text-muted-foreground" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Subtasks</h3>
              <p className="text-xs text-muted-foreground">Break the work into checklist items.</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 shrink-0 gap-1"
            onClick={() => append({ title: "" })}
          >
            <Plus className="size-4" />
            Add subtask
          </Button>
        </div>
        <div className="space-y-2">
          {fields.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 px-3 py-4 text-center text-sm text-muted-foreground">
              No subtasks yet. Use “Add subtask” to split this task.
            </p>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input className="min-h-11 flex-1" placeholder={`Subtask ${index + 1}`} {...register(`subtasks.${index}.title` as const)} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  className="shrink-0"
                  aria-label={`Remove subtask ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
            <MessageSquarePlus className="size-4 text-muted-foreground" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Comments</h3>
            <p className="text-xs text-muted-foreground">Optional opening note visible on the task thread (Phase 1 mock).</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tf-comment">Initial comment</Label>
          <Textarea
            id="tf-comment"
            rows={3}
            placeholder="Context, acceptance criteria, or links for the assignee…"
            className="min-h-[5rem] resize-y"
            {...register("initialComment")}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 border-t border-border/50 pt-4 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" className="min-h-11">
          Create task
        </Button>
      </div>
    </form>
  );
}
