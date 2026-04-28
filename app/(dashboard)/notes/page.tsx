"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteForm, type NoteFormValues } from "@/components/forms/NoteForm";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { mockNotes } from "@/lib/mock-data/notes";
import { useAuth } from "@/lib/auth-context";
import type { Note, Priority } from "@/lib/types";
import { toast } from "sonner";
import { Plus, StickyNote } from "lucide-react";

const noteFilterOptions = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

export default function NotesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Priority | "all">("all");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Note | null>(null);

  const allUserNotes = useMemo(() => mockNotes.filter((n) => n.userId === user?.id), [user?.id]);
  const notes = useMemo(
    () => allUserNotes.filter((n) => (filter === "all" ? true : n.priority === filter)),
    [allUserNotes, filter],
  );
  const noteFilterItems = useMemo(
    () =>
      noteFilterOptions.map((item) => ({
        ...item,
        label: `${item.label} (${
          item.value === "all" ? allUserNotes.length : allUserNotes.filter((n) => n.priority === item.value).length
        })`,
      })),
    [allUserNotes],
  );

  return (
    <>
      <PageHeader
        title="Notes"
        description="Private notes — visible only to you in this mock."
        action={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={cn(buttonVariants(), "min-h-11 gap-2")}>
              <Plus className="size-4" />
              New note
            </SheetTrigger>
            <SheetContent className="flex h-[100dvh] max-h-[100dvh] w-full flex-col gap-0 overflow-y-auto border-l border-white/10 bg-popover/95 p-0 shadow-2xl backdrop-blur-xl data-[side=right]:sm:max-w-lg dark:border-white/5">
              <SheetHeader className="border-b border-white/10 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-transparent p-6 pr-12">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-background/50 text-primary shadow-sm">
                    <StickyNote className="size-5" />
                  </div>
                  <div>
                    <SheetTitle>New note</SheetTitle>
                    <SheetDescription>Capture a private reminder, idea, or follow-up.</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="flex-1 p-5">
                <div className="rounded-2xl border border-white/10 bg-card/40 p-4 shadow-sm backdrop-blur-xl">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Add a clear title and priority so your notes stay easy to scan later.
                  </p>
                <NoteForm
                  onCancel={() => setOpen(false)}
                  onSubmit={(v: NoteFormValues) => {
                    toast.success(`Mock: saved “${v.title}”`);
                    setOpen(false);
                  }}
                />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        }
      />
      <Card className="mb-6 border-white/10 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter notes</CardTitle>
          <p className="text-sm text-muted-foreground">Switch between priority views without losing the notes context.</p>
        </CardHeader>
        <CardContent>
          <SegmentedControl
            value={filter}
            onValueChange={setFilter}
            items={noteFilterItems}
            ariaLabel="Note priority filter"
            triggerClassName="flex-1"
          />
        </CardContent>
      </Card>
      {notes.length ? (
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
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-10 text-center">
          <p className="font-medium text-foreground">No notes in this view</p>
          <p className="mt-1 text-sm text-muted-foreground">Create a new note or switch to another priority filter.</p>
        </div>
      )}
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
