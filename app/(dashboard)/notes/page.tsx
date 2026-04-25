"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteForm, type NoteFormValues } from "@/components/forms/NoteForm";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { mockNotes } from "@/lib/mock-data/notes";
import { useAuth } from "@/lib/auth-context";
import type { Note, Priority } from "@/lib/types";
import { toast } from "sonner";

export default function NotesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Priority | "all">("all");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Note | null>(null);

  const notes = useMemo(
    () => mockNotes.filter((n) => n.userId === user?.id && (filter === "all" ? true : n.priority === filter)),
    [user?.id, filter],
  );

  return (
    <>
      <PageHeader
        title="Notes"
        description="Private notes — visible only to you in this mock."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} className="min-h-11" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button
              variant={filter === "high" ? "default" : "outline"}
              className="min-h-11"
              onClick={() => setFilter("high")}
            >
              High
            </Button>
            <Button
              variant={filter === "medium" ? "default" : "outline"}
              className="min-h-11"
              onClick={() => setFilter("medium")}
            >
              Medium
            </Button>
            <Button
              variant={filter === "low" ? "default" : "outline"}
              className="min-h-11"
              onClick={() => setFilter("low")}
            >
              Low
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className={cn(buttonVariants(), "min-h-11")}>New note</SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>New note</SheetTitle>
                </SheetHeader>
                <NoteForm
                  onCancel={() => setOpen(false)}
                  onSubmit={(v: NoteFormValues) => {
                    toast.success(`Mock: saved “${v.title}”`);
                    setOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {notes.map((n) => (
          <Card
            key={n.id}
            className="cursor-pointer shadow-sm transition hover:shadow-md"
            onClick={() => setActive(n)}
          >
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base leading-snug">{n.title}</CardTitle>
                <PriorityBadge priority={n.priority} />
              </div>
              <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">{n.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          {active ? (
            <>
              <DialogHeader>
                <DialogTitle>{active.title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{active.content}</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="min-h-11" onClick={() => toast.message("Mock edit")}>
                  Edit
                </Button>
                <Button variant="destructive" className="min-h-11" onClick={() => toast.message("Mock delete")}>
                  Delete
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
