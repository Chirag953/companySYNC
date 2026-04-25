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
import type { Priority } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  content: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
});

export type NoteFormValues = z.infer<typeof schema>;

export function NoteForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<NoteFormValues>;
  onSubmit: (values: NoteFormValues) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      priority: (defaultValues?.priority as Priority | undefined) ?? "medium",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="nf-title">Title</Label>
        <Input id="nf-title" className="min-h-11" {...register("title")} />
        {errors.title?.message ? (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="nf-body">Body</Label>
        <Textarea id="nf-body" rows={4} {...register("content")} />
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
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" className="min-h-11">
          Save note
        </Button>
      </div>
    </form>
  );
}
