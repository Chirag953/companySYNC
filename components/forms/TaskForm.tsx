"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
});

export type TaskFormValues = z.infer<typeof schema>;

export function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      assigneeId: defaultValues?.assigneeId ?? mockUsers[0]?.id ?? "",
      priority: (defaultValues?.priority as Priority | undefined) ?? "medium",
      dueDate: defaultValues?.dueDate ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="tf-title">Title</Label>
        <Input id="tf-title" className="min-h-11" {...register("title")} />
        {errors.title?.message ? (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="tf-desc">Description</Label>
        <Textarea id="tf-desc" rows={3} {...register("description")} />
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
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" className="min-h-11">
          Save task
        </Button>
      </div>
    </form>
  );
}
