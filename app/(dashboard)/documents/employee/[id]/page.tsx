"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Download, FileArchive } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { managerVisibleUserIds } from "@/lib/audit-log-scope";
import { mockDocuments, mockDocumentCategories } from "@/lib/mock-data/documents";
import { getUserById } from "@/lib/mock-data/users";
import { useAuth } from "@/lib/auth-context";
import type { Document } from "@/lib/types";
import { toast } from "sonner";

function canViewEmployeeDocs(viewerRole: string, viewerId: string | undefined, targetId: string): boolean {
  if (!viewerId) return false;
  if (viewerRole === "admin") return true;
  if (viewerRole === "employee") return viewerId === targetId;
  if (viewerRole === "manager") return managerVisibleUserIds(viewerId).has(targetId);
  return false;
}

export default function EmployeeDocumentsPage() {
  const params = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const targetId = params.id;

  const allowed = useMemo(
    () => (user && targetId ? canViewEmployeeDocs(role ?? "", user.id, targetId) : false),
    [role, user, targetId],
  );

  const employee = targetId ? getUserById(targetId) : undefined;

  const docs = useMemo(() => {
    if (!targetId || !allowed) return [];
    return mockDocuments.filter((d) => d.ownerId === targetId);
  }, [targetId, allowed]);

  const grouped = useMemo(() => {
    return mockDocumentCategories.map((c) => ({
      category: c,
      docs: docs.filter((d) => d.categoryId === c.id),
    }));
  }, [docs]);

  if (!user || !targetId) {
    return null;
  }

  if (!allowed || !employee) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">You do not have access to these documents.</p>
        <Link href="/documents" className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex")}>
          Back to documents
        </Link>
      </div>
    );
  }

  function downloadOne(doc: Document) {
    toast.success(`Mock download: ${doc.fileName}`);
  }

  function downloadAll() {
    if (!docs.length) {
      toast.message("No documents to download.");
      return;
    }
    toast.success(`Mock: packaged ${docs.length} file${docs.length === 1 ? "" : "s"} for download (ZIP)`);
  }

  const title =
    role === "employee" && user.id === targetId ? "My documents" : `${employee.firstName} ${employee.lastName}`;

  return (
    <>
      <PageHeader
        title={title}
        description="Documents grouped by category (mock). Download individually or all at once."
        fallbackHref="/documents"
        action={
          <Button type="button" className="min-h-11 gap-2" onClick={downloadAll} disabled={!docs.length}>
            <FileArchive className="size-4" aria-hidden />
            Download all
          </Button>
        }
      />

      <div className="mx-auto max-w-4xl space-y-6">
        {grouped.map(({ category, docs: catDocs }) => (
          <Card key={category.id} className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg">{category.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {catDocs.length ? `${catDocs.length} file${catDocs.length === 1 ? "" : "s"}` : "No files in this category"}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {catDocs.length ? (
                catDocs.map((d) => {
                  const statusVariant =
                    d.expiryStatus === "expired" ? "destructive" : d.expiryStatus === "expiring_soon" ? "secondary" : "outline";
                  return (
                    <div
                      key={d.id}
                      className="flex flex-col gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{d.fileName}</p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>Uploaded {d.uploadDate}</span>
                          <span aria-hidden>·</span>
                          <span>Expires {d.expiryDate ?? "—"}</span>
                          <Badge variant={statusVariant} className="capitalize">
                            {d.expiryStatus.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="min-h-11 shrink-0 gap-2"
                        onClick={() => downloadOne(d)}
                      >
                        <Download className="size-4" aria-hidden />
                        Download
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="rounded-lg border border-dashed border-border/60 bg-background/50 px-4 py-6 text-center text-sm text-muted-foreground">
                  No documents in this category.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
