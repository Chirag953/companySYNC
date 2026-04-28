"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { Shield, UserPlus, Users, UsersRound } from "lucide-react";
import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserForm, type UserFormValues } from "@/components/forms/UserForm";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { mockUsers } from "@/lib/mock-data/users";
import { mockDepartments } from "@/lib/mock-data/departments";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function deptName(id?: string) {
  return mockDepartments.find((d) => d.id === id)?.name ?? "—";
}

function UsersRoleCard({
  title,
  description,
  icon: Icon,
  users,
  columns,
  searchPlaceholder,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  users: User[];
  columns: ColumnDef<User>[];
  searchPlaceholder: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-4 border-b border-border/60 bg-muted/20 pb-4 dark:bg-muted/10">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-primary/10 text-primary shadow-sm dark:bg-primary/15"
          aria-hidden
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            <Badge variant="secondary" className="tabular-nums">
              {users.length}
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <DataTable columns={columns} data={users} searchPlaceholder={searchPlaceholder} />
      </CardContent>
    </Card>
  );
}

export default function UsersPage() {
  const [open, setOpen] = useState(false);

  const { admins, managers, employees } = useMemo(() => {
    const admins = mockUsers.filter((u) => u.role === "admin");
    const managers = mockUsers.filter((u) => u.role === "manager");
    const employees = mockUsers.filter((u) => u.role === "employee");
    return { admins, managers, employees };
  }, []);

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
        description="Directory grouped by role: admins, managers, then employees. Each list has its own search and pagination (mock)."
        action={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={cn(buttonVariants(), "min-h-11 gap-2 shadow-sm")}>
              <UserPlus className="size-4 shrink-0" aria-hidden />
              Add user
            </SheetTrigger>
            <SheetContent
              showCloseButton
              className={cn(
                "gap-0 overflow-hidden border-l border-border/70 bg-popover p-0 shadow-2xl",
                "supports-backdrop-filter:bg-popover/95 supports-backdrop-filter:backdrop-blur-xl",
                "dark:border-border sm:max-w-xl",
              )}
            >
              <div
                className="h-1 shrink-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500"
                aria-hidden
              />
              <SheetHeader className="space-y-0 border-b border-border/60 bg-muted/25 px-6 pb-5 pt-14 dark:bg-muted/15">
                <div className="flex gap-4">
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 text-primary shadow-sm dark:from-emerald-500/20 dark:to-cyan-500/15"
                    aria-hidden
                  >
                    <UserPlus className="size-6" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <SheetTitle className="font-display text-left text-xl font-semibold tracking-tight text-gradient">
                      Add user
                    </SheetTitle>
                    <SheetDescription className="text-left text-[13px] leading-relaxed text-muted-foreground">
                      Enter profile and access details for a new account. Role and department determine navigation and
                      approvals in this workspace (demo data only).
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
                <div className="panel-glass rounded-xl border-border/60 p-5 sm:p-6">
                  <p className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Profile & access
                  </p>
                  <UserForm
                    onCancel={() => setOpen(false)}
                    onSubmit={(v: UserFormValues) => {
                      toast.success(`Mock: would create ${v.email}`);
                      setOpen(false);
                    }}
                  />
                </div>
                <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
                  Demonstration mode — submissions show a confirmation only and are not persisted.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="flex flex-col gap-8">
        <UsersRoleCard
          title="Admins"
          description="Organization-wide access, settings, and user administration."
          icon={Shield}
          users={admins}
          columns={columns}
          searchPlaceholder="Search admins…"
        />
        <UsersRoleCard
          title="Managers"
          description="Team leads, leave approvals, and day-to-day people operations."
          icon={UsersRound}
          users={managers}
          columns={columns}
          searchPlaceholder="Search managers…"
        />
        <UsersRoleCard
          title="Employees"
          description="Individual contributors and staff accounts."
          icon={Users}
          users={employees}
          columns={columns}
          searchPlaceholder="Search employees…"
        />
      </div>
    </RequireRole>
  );
}
