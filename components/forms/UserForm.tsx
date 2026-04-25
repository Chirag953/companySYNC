"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockDepartments } from "@/lib/mock-data/departments";
import type { Role } from "@/lib/types";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email(),
  phone: z.string().optional(),
  designation: z.string().optional(),
  departmentId: z.string().optional(),
  role: z.enum(["admin", "manager", "employee"]),
});

export type UserFormValues = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function UserForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      designation: defaultValues?.designation ?? "",
      departmentId: defaultValues?.departmentId ?? "",
      role: (defaultValues?.role as Role | undefined) ?? "employee",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="uf-first">First name</Label>
        <Input id="uf-first" className="min-h-11" {...register("firstName")} />
        <FieldError message={errors.firstName?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uf-last">Last name</Label>
        <Input id="uf-last" className="min-h-11" {...register("lastName")} />
        <FieldError message={errors.lastName?.message} />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="uf-email">Email</Label>
        <Input id="uf-email" type="email" className="min-h-11" {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uf-phone">Phone</Label>
        <Input id="uf-phone" className="min-h-11" {...register("phone")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uf-title">Designation</Label>
        <Input id="uf-title" className="min-h-11" {...register("designation")} />
      </div>
      <div className="space-y-2">
        <Label>Department</Label>
        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="min-h-11 w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {mockDepartments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label>Role</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="min-h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.role?.message} />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" className="min-h-11">
          Save user
        </Button>
      </div>
    </form>
  );
}
