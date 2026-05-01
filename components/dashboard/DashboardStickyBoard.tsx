"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { format } from "date-fns";
import { Pencil, Plus, StickyNote, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { mockNotes } from "@/lib/mock-data/notes";
import type { Note, Priority } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NoteForm, type NoteFormValues } from "@/components/forms/NoteForm";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STORAGE_PREFIX = "companysync:sticky-board:";

/** Seeded layout & fallback when board not measured yet */
const NOTE_W_MAX = 200;
const NOTE_W_MIN = 152;
const NOTE_H_MAX = 148;
const NOTE_H_MIN = 128;

type BoardNote = Note & { x: number; y: number; z: number };

type PersistedV1 = {
  v: 1;
  positions: Record<string, { x: number; y: number; z: number }>;
  extras: BoardNote[];
  deletedIds: string[];
  /** Content overrides for seeded mock notes (ids in `mockNotes`). */
  overrides: Record<string, Pick<Note, "title" | "content" | "priority" | "updatedAt">>;
};

const filterOptions = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function defaultPosition(index: number): { x: number; y: number; z: number } {
  const col = index % 4;
  const row = Math.floor(index / 4);
  return {
    x: 12 + col * (NOTE_W_MAX + 12),
    y: 12 + row * (NOTE_H_MAX + 12),
    z: index,
  };
}

function noteDimensionsForBoardWidth(boardInnerWidth: number): { noteW: number; noteH: number } {
  if (boardInnerWidth <= 0) {
    return { noteW: NOTE_W_MAX, noteH: NOTE_H_MAX };
  }
  const noteW = Math.min(NOTE_W_MAX, Math.max(NOTE_W_MIN, Math.floor(boardInnerWidth - 16)));
  const t = (noteW - NOTE_W_MIN) / (NOTE_W_MAX - NOTE_W_MIN);
  const noteH = Math.round(NOTE_H_MIN + t * (NOTE_H_MAX - NOTE_H_MIN));
  return { noteW, noteH };
}

function loadPersisted(userId: string): PersistedV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedV1;
    if (parsed?.v !== 1) return null;
    return {
      v: 1,
      positions: parsed.positions ?? {},
      extras: Array.isArray(parsed.extras) ? parsed.extras : [],
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
      overrides:
        parsed.overrides && typeof parsed.overrides === "object" && !Array.isArray(parsed.overrides)
          ? (parsed.overrides as PersistedV1["overrides"])
          : {},
    };
  } catch {
    return null;
  }
}

function savePersisted(userId: string, data: PersistedV1) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(data));
  } catch {
    toast.error("Could not save board layout.");
  }
}

function seedFromMock(userId: string, persisted: PersistedV1 | null): BoardNote[] {
  const deleted = new Set(persisted?.deletedIds ?? []);
  const positions = persisted?.positions ?? {};
  const overrides = persisted?.overrides ?? {};
  const base = mockNotes.filter((n) => n.userId === userId && !deleted.has(n.id));
  return base.map((n, i) => {
    const p = positions[n.id] ?? defaultPosition(i);
    const o = overrides[n.id];
    const merged = o ? { ...n, ...o } : n;
    return { ...merged, x: p.x, y: p.y, z: p.z };
  });
}

export function DashboardStickyBoard() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  const [filter, setFilter] = useState<Priority | "all">("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<BoardNote[]>([]);

  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    pointerId: number;
  } | null>(null);
  const deletedIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!userId) return;
    const persisted = loadPersisted(userId);
    deletedIdsRef.current = persisted?.deletedIds ?? [];
    const seeded = seedFromMock(userId, persisted);
    const seedIds = new Set(seeded.map((s) => s.id));
    const extras = (persisted?.extras ?? []).filter((e) => e.userId === userId && !seedIds.has(e.id));
    const merged = [...seeded, ...extras].sort((a, b) => a.z - b.z);
    startTransition(() => {
      setNotes(merged);
    });
  }, [userId]);

  const { noteW, noteH } = useMemo(
    () => noteDimensionsForBoardWidth(boardSize.width),
    [boardSize.width],
  );

  useLayoutEffect(() => {
    if (!userId) return;
    const el = boardRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBoardSize({ width: r.width, height: r.height });
    };
    measure();
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setBoardSize({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [userId]);

  const persist = useCallback(
    (next: BoardNote[], deletedIds: string[]) => {
      if (!userId) return;
      const positions: Record<string, { x: number; y: number; z: number }> = {};
      const extras: BoardNote[] = [];
      const mockIds = new Set(mockNotes.filter((m) => m.userId === userId).map((m) => m.id));
      const origById = new Map(mockNotes.map((m) => [m.id, m]));
      const overrides: NonNullable<PersistedV1["overrides"]> = {};
      for (const n of next) {
        positions[n.id] = { x: n.x, y: n.y, z: n.z };
        if (!mockIds.has(n.id)) extras.push(n);
        else {
          const orig = origById.get(n.id);
          if (
            orig &&
            (orig.title !== n.title ||
              (orig.content ?? "") !== (n.content ?? "") ||
              orig.priority !== n.priority)
          ) {
            overrides[n.id] = {
              title: n.title,
              content: n.content,
              priority: n.priority,
              updatedAt: n.updatedAt,
            };
          }
        }
      }
      savePersisted(userId, {
        v: 1,
        positions,
        extras,
        deletedIds,
        overrides,
      });
    },
    [userId],
  );

  /** Keep notes inside the board when the viewport or card size changes */
  useLayoutEffect(() => {
    if (!userId || boardSize.width <= 0) return;
    startTransition(() => {
      setNotes((prev) => {
        const maxX = Math.max(0, boardSize.width - noteW);
        const maxY = Math.max(0, boardSize.height - noteH);
        const next = prev.map((n) => ({
          ...n,
          x: Math.min(Math.max(0, n.x), maxX),
          y: Math.min(Math.max(0, n.y), maxY),
        }));
        const changed = next.some((n, i) => n.x !== prev[i]!.x || n.y !== prev[i]!.y);
        if (changed) {
          queueMicrotask(() => persist(next, deletedIdsRef.current));
        }
        return changed ? next : prev;
      });
    });
  }, [userId, boardSize.width, boardSize.height, noteW, noteH, persist]);

  const filteredNotes = useMemo(
    () => notes.filter((n) => (filter === "all" ? true : n.priority === filter)).sort((a, b) => a.z - b.z),
    [notes, filter],
  );

  const editFormDefaults = useMemo((): Partial<NoteFormValues> | undefined => {
    if (!editingId) return undefined;
    const n = notes.find((x) => x.id === editingId);
    if (!n) return undefined;
    return { title: n.title, content: n.content ?? "", priority: n.priority };
  }, [editingId, notes]);

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setEditingId(null);
  };

  const filterItems = useMemo(() => {
    const counts = (p: Priority | "all") =>
      p === "all" ? notes.length : notes.filter((n) => n.priority === p).length;
    return filterOptions.map((item) => ({
      ...item,
      label: `${item.label} (${counts(item.value as Priority | "all")})`,
    }));
  }, [notes]);

  const clampToBoard = useCallback(
    (x: number, y: number, boardW: number, boardH: number, nw: number, nh: number) => {
      const maxX = Math.max(0, boardW - nw);
      const maxY = Math.max(0, boardH - nh);
      return {
        x: Math.min(Math.max(0, x), maxX),
        y: Math.min(Math.max(0, y), maxY),
      };
    },
    [],
  );

  const handlePointerDown = (e: React.PointerEvent, note: BoardNote) => {
    if (!boardRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      id: note.id,
      startX: e.clientX,
      startY: e.clientY,
      originX: note.x,
      originY: note.y,
      pointerId: e.pointerId,
    };
    setNotes((prev) => {
      const maxZ = prev.reduce((m, n) => Math.max(m, n.z), 0);
      return prev.map((n) => (n.id === note.id ? { ...n, z: maxZ + 1 } : n));
    });
  };

  const handlePointerMoveCard = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const { x, y } = clampToBoard(d.originX + dx, d.originY + dy, rect.width, rect.height, noteW, noteH);
    setNotes((prev) => prev.map((n) => (n.id === d.id ? { ...n, x, y } : n)));
  };

  const handlePointerUpCard = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    setNotes((prev) => {
      persist(prev, deletedIdsRef.current);
      return prev;
    });
  };

  const handleDelete = (id: string) => {
    const mockIds = new Set(mockNotes.filter((m) => m.userId === userId).map((m) => m.id));
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (mockIds.has(id)) {
        deletedIdsRef.current = [...new Set([...deletedIdsRef.current, id])];
      }
      persist(next, deletedIdsRef.current);
      toast.success("Note removed from your board.");
      return next;
    });
  };

  const handleCreate = (values: NoteFormValues) => {
    if (!userId) return;
    const now = new Date().toISOString();
    const id = `note-local-${Date.now()}`;
    setNotes((prev) => {
      const maxZ = prev.reduce((m, n) => Math.max(m, n.z), 0);
      const next: BoardNote = {
        id,
        userId,
        title: values.title,
        content: values.content,
        priority: values.priority,
        createdAt: now,
        updatedAt: now,
        x: 12,
        y: 12,
        z: maxZ + 1,
      };
      const merged = [...prev, next];
      persist(merged, deletedIdsRef.current);
      toast.success(`Saved “${values.title}”`);
      setSheetOpen(false);
      setEditingId(null);
      return merged;
    });
  };

  const handleUpdate = (values: NoteFormValues) => {
    if (!userId || !editingId) return;
    const now = new Date().toISOString();
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === editingId
          ? { ...n, title: values.title, content: values.content, priority: values.priority, updatedAt: now }
          : n,
      );
      persist(next, deletedIdsRef.current);
      toast.success(`Updated “${values.title}”`);
      setSheetOpen(false);
      setEditingId(null);
      return next;
    });
  };

  if (!userId) {
    return (
      <div className="panel-glass rounded-xl p-4 text-sm text-muted-foreground sm:p-6">
        Sign in to use your sticky board.
      </div>
    );
  }

  return (
    <section className="min-w-0 space-y-3 sm:space-y-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Sticky board</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Private notes for your account — drag cards, tap the pencil to edit, or add a new note. Layout and edits are saved in this browser.
          </p>
        </div>
        <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="button"
            className={cn(buttonVariants(), "min-h-11 w-full shrink-0 gap-2 sm:w-auto")}
            onClick={() => {
              setEditingId(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="size-4" />
            New note
          </Button>
          <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-full flex-col gap-0 overflow-y-auto border-l border-white/10 bg-popover/95 p-0 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[env(safe-area-inset-top,0px)] shadow-2xl backdrop-blur-xl data-[side=right]:sm:max-w-lg dark:border-white/5">
              <SheetHeader className="border-b border-white/10 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-transparent p-4 pr-12 sm:p-6 sm:pr-12">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-background/50 text-primary shadow-sm sm:size-11">
                    <StickyNote className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <SheetTitle className="text-base sm:text-lg">{editingId ? "Edit note" : "New note"}</SheetTitle>
                    <SheetDescription className="text-xs sm:text-sm">
                      {editingId
                        ? "Update the title, body, or priority — your board saves automatically."
                        : "Capture a reminder or follow-up on your board."}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="flex-1 p-4 sm:p-5">
                <div className="rounded-2xl border border-white/10 bg-card/40 p-3 shadow-sm backdrop-blur-xl sm:p-4">
                  <NoteForm
                    key={editingId ?? "new"}
                    defaultValues={editFormDefaults}
                    submitLabel={editingId ? "Save changes" : "Save note"}
                    onCancel={() => handleSheetOpenChange(false)}
                    onSubmit={editingId ? handleUpdate : handleCreate}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Card className="border-white/10 bg-card/30 p-3 shadow-sm backdrop-blur-xl sm:p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:mb-3">
          Filter by priority
        </p>
        <SegmentedControl
          value={filter}
          onValueChange={setFilter}
          items={filterItems}
          ariaLabel="Sticky note priority filter"
          triggerClassName="min-h-11 flex-1 basis-[calc(50%-0.125rem)] text-[11px] leading-tight sm:min-h-10 sm:basis-0 sm:px-3.5 sm:text-xs"
        />
      </Card>

      <div
        ref={boardRef}
        className={cn(
          "relative min-h-[min(48vh,28rem)] overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-inner sm:min-h-[26rem] lg:min-h-[35rem] dark:bg-muted/10",
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--muted-foreground) / 0.12) 1px, transparent 1px)",
          backgroundSize: "clamp(14px, 4vw, 20px) clamp(14px, 4vw, 20px)",
        }}
      >
        {!filteredNotes.length ? (
          <div className="flex min-h-[min(42vh,24rem)] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[22rem] sm:px-6 sm:py-16 lg:min-h-[28rem]">
            <StickyNote className="mb-3 size-10 text-muted-foreground/60" aria-hidden />
            <p className="font-medium text-foreground">No notes in this view</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create a new note or switch priority filter. Notes from your mock data appear here automatically.
            </p>
          </div>
        ) : null}

        {filteredNotes.map((note) => (
          <article
            key={note.id}
            className={cn(
              "absolute flex max-w-[calc(100%-0.75rem)] touch-none cursor-grab flex-col rounded-xl border border-white/15 bg-gradient-to-br from-amber-50/95 via-yellow-50/90 to-amber-100/95 p-2 shadow-lg select-none active:cursor-grabbing sm:max-w-none sm:p-3 dark:from-amber-950/50 dark:via-yellow-950/40 dark:to-amber-900/50 dark:border-white/10",
              note.priority === "high" &&
                "from-rose-50/95 via-orange-50/90 to-amber-50/95 dark:from-rose-950/45 dark:via-orange-950/35 dark:to-amber-950/40",
              note.priority === "low" &&
                "from-slate-50/95 via-zinc-50/90 to-slate-100/95 dark:from-slate-900/50 dark:via-zinc-900/45 dark:to-slate-800/50",
            )}
            style={{
              left: note.x,
              top: note.y,
              zIndex: note.z,
              width: noteW,
              height: noteH,
            }}
            onPointerDown={(e) => handlePointerDown(e, note)}
            onPointerMove={handlePointerMoveCard}
            onPointerUp={handlePointerUpCard}
            onPointerCancel={handlePointerUpCard}
          >
            <div className="flex min-w-0 items-start justify-between gap-1.5 sm:gap-2">
              <h3 className="min-w-0 line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-sm">
                {note.title}
              </h3>
              <span className="shrink-0">
                <PriorityBadge priority={note.priority} />
              </span>
            </div>
            <p className="mt-1 line-clamp-3 flex-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              {note.content?.trim() ? note.content : "No body"}
            </p>
            <div className="mt-auto flex items-center justify-between gap-1 pt-1.5 sm:pt-2">
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {format(new Date(note.updatedAt), "MMM d")}
              </span>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-9 text-muted-foreground hover:text-primary sm:size-8"
                  aria-label={`Edit ${note.title}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(note.id);
                    setSheetOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-9 shrink-0 text-muted-foreground hover:text-destructive sm:size-8"
                  aria-label={`Delete ${note.title}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
