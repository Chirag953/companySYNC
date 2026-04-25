"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/shared/FileUpload";
import { mockDocuments, mockDocumentCategories } from "@/lib/mock-data/documents";
import { getUserById } from "@/lib/mock-data/users";
import { mockTeams } from "@/lib/mock-data/teams";
import { useAuth } from "@/lib/auth-context";
import type { Document } from "@/lib/types";
import { toast } from "sonner";

export default function DocumentsPage() {
  const { user, role } = useAuth();

  const scoped = useMemo(() => {
    if (role === "admin") return mockDocuments;
    if (role === "manager") {
      const team = mockTeams.find((t) => t.managerId === user?.id) ?? mockTeams[0];
      const ids = new Set(team.memberIds);
      return mockDocuments.filter((d) => ids.has(d.ownerId));
    }
    return mockDocuments.filter((d) => d.ownerId === user?.id);
  }, [role, user?.id]);

  const columns = useMemo<ColumnDef<Document>[]>(
    () => [
      {
        accessorKey: "ownerId",
        header: "Employee",
        cell: ({ getValue }) => {
          const u = getUserById(getValue() as string);
          return u ? `${u.firstName} ${u.lastName}` : (getValue() as string);
        },
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        cell: ({ getValue }) =>
          mockDocumentCategories.find((c) => c.id === (getValue() as string))?.name ?? "—",
      },
      { accessorKey: "fileName", header: "File" },
      { accessorKey: "uploadDate", header: "Uploaded" },
      { accessorKey: "expiryDate", header: "Expiry" },
      {
        accessorKey: "expiryStatus",
        header: "Status",
        cell: ({ getValue }) => {
          const v = getValue() as Document["expiryStatus"];
          const variant = v === "expired" ? "destructive" : v === "expiring_soon" ? "secondary" : "outline";
          return <Badge variant={variant}>{v.replace("_", " ")}</Badge>;
        },
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="min-h-9" onClick={() => toast.message("Mock download")}>
              Download
            </Button>
            {role === "admin" ? (
              <Button size="sm" variant="destructive" className="min-h-9" onClick={() => toast.message("Mock delete")}>
                Delete
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [role],
  );

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

  return (
    <>
      <PageHeader
        title="Documents"
        description={role === "admin" ? "All employee documents." : "Team documents (read-only delete)."}
        action={
          <Link
            href="/documents/categories"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex items-center justify-center")}
          >
            Categories
          </Link>
        }
      />
      <div className="mt-4 space-y-4">
        <FileUpload onFilesSelected={() => toast.message("Mock: files staged")} />
        <DataTable columns={columns} data={scoped} searchPlaceholder="Search documents…" />
      </div>
    </>
  );
}
