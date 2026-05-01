"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RequireRole } from "@/components/role-gates";
import { mockDocuments, mockDocumentCategories } from "@/lib/mock-data/documents";
import { getUserById, mockUsers } from "@/lib/mock-data/users";
import { mockDepartments } from "@/lib/mock-data/departments";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/shared/UserAvatar";

type TeamMemberRow = {
  id: string;
  name: string;
  department: string;
  docCount: number;
};

export default function DocumentsPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");

  const scoped = useMemo(() => {
    if (role !== "employee") return [];
    return mockDocuments.filter((d) => d.ownerId === user?.id);
  }, [role, user?.id]);

  /** Admin: all employees company-wide. Managers do not have access to team documents (Phase 1). */
  const teamMemberRows = useMemo<TeamMemberRow[]>(() => {
    if (!user || role !== "admin") return [];

    const employees = mockUsers.filter((u) => u.role === "employee");

    return employees
      .map((u) => {
        const docCount = mockDocuments.filter((d) => d.ownerId === u.id).length;
        const department =
          mockDepartments.find((department) => department.id === u.departmentId)?.name ?? "—";
        return {
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          department,
          docCount,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [role, user]);

  const adminEmployeeColumns = useMemo<ColumnDef<TeamMemberRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Employee",
        cell: ({ row }) => {
          const u = getUserById(row.original.id);
          return (
            <Link
              href={`/documents/employee/${row.original.id}`}
              className="inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
            >
              <UserAvatar
                firstName={u?.firstName ?? "?"}
                lastName={u?.lastName ?? "?"}
                size="sm"
                className="shrink-0"
              />
              {row.original.name}
            </Link>
          );
        },
      },
      { accessorKey: "department", header: "Department" },
      {
        accessorKey: "docCount",
        header: "Documents",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue() as number}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/documents/employee/${row.original.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "min-h-9")}
          >
            View files
          </Link>
        ),
      },
    ],
    [],
  );

  const employeeOptions = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase();

    return mockUsers
      .filter((u) => u.role === "employee")
      .filter((u) => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const departmentName = mockDepartments.find((department) => department.id === u.departmentId)?.name ?? "";
        return (
          !query ||
          fullName.includes(query) ||
          u.email.toLowerCase().includes(query) ||
          (u.designation ?? "").toLowerCase().includes(query) ||
          departmentName.toLowerCase().includes(query)
        );
      });
  }, [employeeSearch]);

  function openEmployeeDocuments(userId: string) {
    setEmployeeDialogOpen(false);
    setEmployeeSearch("");
    router.push(`/documents/employee/${userId}`);
  }

  if (role === "employee") {
    const grouped = mockDocumentCategories.map((c) => ({
      category: c.name,
      docs: scoped.filter((d) => d.categoryId === c.id),
    }));
    return (
      <>
        <PageHeader title="Documents" description="Your files grouped by category." />
        <div className="space-y-6">
          {grouped.map((g) => (
            <div key={g.category}>
              <h3 className="mb-2 text-sm font-semibold">{g.category}</h3>
              <ul className="space-y-2 text-sm">
                {g.docs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span>{d.fileName}</span>
                    <Button size="sm" variant="outline" className="min-h-9" onClick={() => toast.message("Mock download")}>
                      Download
                    </Button>
                  </li>
                ))}
                {!g.docs.length ? <li className="text-muted-foreground">No documents.</li> : null}
              </ul>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (role === "admin") {
    const description =
      "All employees — open someone’s folder to view, edit, or delete documents by category (mock).";

    const emptyMessage = "No employees found in this mock dataset.";

    const searchPlaceholder = "Search employees…";

    return (
      <>
        <PageHeader
            title="Documents"
            description={description}
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
                  <DialogTrigger className={cn(buttonVariants(), "min-h-11")}>
                    Add Employee documents
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Select employee</DialogTitle>
                      <DialogDescription>
                        Choose an employee to open their documents. You can upload or manage files from there (mock).
                      </DialogDescription>
                    </DialogHeader>
                    <Input
                      aria-label="Search employees for document upload"
                      placeholder="Search by name, email, designation, or department..."
                      value={employeeSearch}
                      onChange={(event) => setEmployeeSearch(event.target.value)}
                      className="min-h-11"
                    />
                    <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-card/40 p-2 shadow-sm backdrop-blur-xl">
                      {employeeOptions.length ? (
                        employeeOptions.map((employee) => {
                          const departmentName =
                            mockDepartments.find((department) => department.id === employee.departmentId)?.name ??
                            "No department";

                          return (
                            <button
                              key={employee.id}
                              type="button"
                              className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                              onClick={() => openEmployeeDocuments(employee.id)}
                            >
                              <UserAvatar firstName={employee.firstName} lastName={employee.lastName} />
                              <span className="min-w-0">
                                <span className="block font-medium text-foreground">
                                  {employee.firstName} {employee.lastName}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {departmentName} · {employee.designation ?? "No designation"} · {employee.email}
                                </span>
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-8 text-center">
                          <p className="font-medium text-foreground">No employees found</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Try searching by a different name, email, role, or department.
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Link
                  href="/documents/categories"
                  className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex items-center justify-center")}
                >
                  Categories
                </Link>
              </div>
            }
          />
          <div className="mt-4 space-y-4">
            {teamMemberRows.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            ) : (
              <DataTable columns={adminEmployeeColumns} data={teamMemberRows} searchPlaceholder={searchPlaceholder} />
            )}
          </div>
        </>
    );
  }

  return (
    <RequireRole allow={["admin", "employee"]}>
      {null}
    </RequireRole>
  );
}
