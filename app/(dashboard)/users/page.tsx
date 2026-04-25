"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserForm, type UserFormValues } from "@/components/forms/UserForm";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { mockUsers } from "@/lib/mock-data/users";
import { mockDepartments } from "@/lib/mock-data/departments";
import type { User } from "@/lib/types";
import { toast } from "sonner";

function deptName(id?: string) {
  return mockDepartments.find((d) => d.id === id)?.name ?? "—";
}

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const data = mockUsers;

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Name",
        cell: ({ row }) => (
          <Link href={`/users/${row.original.id}`} className="flex items-center gap-2 font-medium hover:underline">
            <UserAvatar firstName={row.original.firstName} lastName={row.original.lastName} size="sm" />
            {row.original.firstName} {row.original.lastName}
          </Link>
        ),
      },
      { accessorKey: "designation", header: "Designation" },
      {
        id: "department",
        header: "Department",
        accessorFn: (r) => deptName(r.departmentId),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => <Badge variant="secondary" className="capitalize">{getValue() as string}</Badge>,
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "default" : "outline"}>{getValue() ? "Active" : "Inactive"}</Badge>
        ),
      },
    ],
    [],
  );

  return (
    <RequireRole allow="admin">
      <PageHeader
        title="Users"
        description="Manage employees and managers."
        action={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={cn(buttonVariants(), "min-h-11")}>Add user</SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add user</SheetTitle>
              </SheetHeader>
              <UserForm
                onCancel={() => setOpen(false)}
                onSubmit={(v: UserFormValues) => {
                  toast.success(`Mock: would create ${v.email}`);
                  setOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>
        }
      />
      <DataTable columns={columns} data={data} searchPlaceholder="Search table…" />
    </RequireRole>
  );
}
