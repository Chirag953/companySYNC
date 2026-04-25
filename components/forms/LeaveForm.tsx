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
import { mockLeaveTypes } from "@/lib/mock-data/leaves";

const schema = z.object({
  leaveTypeId: z.string().min(1, "Select leave type"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  reason: z.string().optional(),
});

export type LeaveFormValues = z.infer<typeof schema>;

export function LeaveForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: LeaveFormValues) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      leaveTypeId: mockLeaveTypes[0]?.id ?? "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
      <div className="space-y-2">
        <Label>Leave type</Label>
        <Controller
          name="leaveTypeId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="min-h-11 w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {mockLeaveTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.leaveTypeId?.message ? (
          <p className="text-sm text-destructive">{errors.leaveTypeId.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lf-start">Start date</Label>
          <Input id="lf-start" type="date" className="min-h-11" {...register("startDate")} />
          {errors.startDate?.message ? (
            <p className="text-sm text-destructive">{errors.startDate.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lf-end">End date</Label>
          <Input id="lf-end" type="date" className="min-h-11" {...register("endDate")} />
          {errors.endDate?.message ? (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="lf-reason">Reason</Label>
        <Textarea id="lf-reason" rows={3} {...register("reason")} />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" className="min-h-11">
          Submit request
        </Button>
      </div>
    </form>
  );
}
