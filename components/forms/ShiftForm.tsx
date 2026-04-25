"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const schema = z.object({
  name: z.string().min(1, "Name required"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  days: z.array(z.string()).min(1, "Pick at least one day"),
});

export type ShiftFormValues = z.infer<typeof schema>;

export function ShiftForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<ShiftFormValues>;
  onSubmit: (values: ShiftFormValues) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ShiftFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      startTime: defaultValues?.startTime ?? "09:00",
      endTime: defaultValues?.endTime ?? "17:00",
      days: defaultValues?.days ?? ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="sf-name">Shift name</Label>
        <Input id="sf-name" className="min-h-11" {...register("name")} />
        {errors.name?.message ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sf-start">Start time</Label>
          <Input id="sf-start" type="time" className="min-h-11" {...register("startTime")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sf-end">End time</Label>
          <Input id="sf-end" type="time" className="min-h-11" {...register("endTime")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Days</Label>
        <Controller
          name="days"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {days.map((d) => {
                const checked = field.value?.includes(d) ?? false;
                return (
                  <label key={d} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        const on = v === true;
                        const next = on
                          ? [...(field.value ?? []), d]
                          : (field.value ?? []).filter((x) => x !== d);
                        field.onChange(next);
                      }}
                    />
                    {d}
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.days?.message ? (
          <p className="text-sm text-destructive">{errors.days.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" className="min-h-11">
          Save shift
        </Button>
      </div>
    </form>
  );
}
