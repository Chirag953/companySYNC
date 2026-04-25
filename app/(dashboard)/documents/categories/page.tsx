"use client";

import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDocumentCategories } from "@/lib/mock-data/documents";
import { toast } from "sonner";

export default function DocumentCategoriesPage() {
  return (
    <RequireRole allow="admin">
      <PageHeader
        title="Document categories"
        description="CRUD for document types (mock)."
        action={
          <Button className="min-h-11" onClick={() => toast.message("Mock: add category")}>
            Add category
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {mockDocumentCategories.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">{c.name}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="min-h-9" onClick={() => toast.message("Edit")}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" className="min-h-9" onClick={() => toast.message("Delete")}>
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">ID: {c.id}</CardContent>
          </Card>
        ))}
      </div>
    </RequireRole>
  );
}
