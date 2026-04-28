"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  ClipboardCheck,
  FileText,
  Inbox,
  ListTodo,
  Mail,
  Megaphone,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mock-data/notifications";
import { useAuth } from "@/lib/auth-context";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { segmentedTabsListClass, segmentedTabsTriggerClass } from "@/lib/segmented-tab-styles";

const filters = ["all", "unread", "task", "leave", "attendance", "document"] as const;

type NotificationFilterTab = (typeof filters)[number];

const FILTER_TABS: {
  value: NotificationFilterTab;
  label: string;
  hint: string;
  Icon: LucideIcon;
}[] = [
  { value: "all", label: "All", hint: "Every notification", Icon: Inbox },
  { value: "unread", label: "Unread", hint: "Still needs your attention", Icon: Mail },
  { value: "task", label: "Tasks", hint: "Assignments & updates", Icon: ListTodo },
  { value: "leave", label: "Leave", hint: "Requests & approvals", Icon: CalendarClock },
  { value: "attendance", label: "Attendance", hint: "Check-ins & time", Icon: ClipboardCheck },
  { value: "document", label: "Documents", hint: "Files & expiries", Icon: FileText },
];

function iconFor(type: string) {
  switch (type) {
    case "task":
      return ListTodo;
    case "leave":
      return CalendarClock;
    case "attendance":
      return ClipboardCheck;
    case "document":
      return FileText;
    default:
      return Megaphone;
  }
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<NotificationFilterTab>("all");

  const mine = useMemo(
    () => (user?.id ? mockNotifications.filter((n) => n.userId === user.id) : []),
    [user?.id],
  );

  const tabCounts = useMemo(() => {
    return {
      all: mine.length,
      unread: mine.filter((n) => !n.isRead).length,
      task: mine.filter((n) => n.type === "task").length,
      leave: mine.filter((n) => n.type === "leave").length,
      attendance: mine.filter((n) => n.type === "attendance").length,
      document: mine.filter((n) => n.type === "document").length,
    };
  }, [mine]);

  const items = useMemo(() => {
    if (tab === "all") return mine;
    if (tab === "unread") return mine.filter((n) => !n.isRead);
    return mine.filter((n) => n.type === tab);
  }, [mine, tab]);

  return (
    <>
      <PageHeader
        title="Notifications"
        description="All alerts across tasks, leave, attendance, and documents."
        action={
          <Button className="min-h-11" variant="secondary" onClick={() => toast.success("Marked all as read (mock)")}>
            Mark all as read
          </Button>
        }
      />

      <section className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card via-card/95 to-muted/15 shadow-sm ring-1 ring-black/[0.03] dark:from-card/90 dark:via-card/70 dark:to-muted/10 dark:ring-white/[0.06]">
        <div className="border-b border-border/40 bg-gradient-to-r from-emerald-500/[0.07] via-transparent to-cyan-500/[0.07] px-4 py-3.5 sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Inbox filters</p>
          <p className="mt-1 text-sm text-muted-foreground">Switch channels or focus unread items — counts update from your mock feed.</p>
        </div>
        <div className="p-3 sm:p-4">
          <div
            className={cn(segmentedTabsListClass, "gap-1 border-border/40 bg-card/50 dark:bg-card/30")}
            role="group"
            aria-label="Notification filter"
          >
            {FILTER_TABS.map(({ value, label, hint, Icon }) => {
              const active = tab === value;
              const count = tabCounts[value];
              return (
                <button
                  key={value}
                  type="button"
                  title={hint}
                  aria-pressed={active}
                  aria-label={`${label}${typeof count === "number" ? `, ${count} items` : ""}`}
                  className={cn(
                    segmentedTabsTriggerClass,
                    "min-h-11 min-w-0 flex-1 flex-col gap-0.5 rounded-xl px-2 py-2 text-[11px] font-semibold sm:flex-row sm:gap-2 sm:px-3 sm:text-xs",
                    "text-foreground/70 transition-colors hover:text-foreground dark:text-muted-foreground",
                    "focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:outline-none",
                    active &&
                      "bg-gradient-to-r from-emerald-500 to-cyan-500 !text-white shadow-md ring-1 ring-white/15 dark:ring-white/10",
                    active && "[&_.tab-count]:text-white/90 [&_svg]:text-white",
                  )}
                  onClick={() => setTab(value)}
                >
                  <Icon className="size-3.5 shrink-0 opacity-90 sm:size-4" aria-hidden />
                  <span className="flex items-center justify-center gap-1">
                    <span>{label}</span>
                    <span
                      className={cn(
                        "tab-count tabular-nums text-[10px] font-bold opacity-90 sm:text-[11px]",
                        active ? "text-white/90" : "text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {items.map((n) => {
          const Icon = iconFor(n.type);
          return (
            <div key={n.id} className="panel-glass flex gap-3 px-4 py-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium leading-snug">{n.title}</p>
                  <span
                    className={cn(
                      "mt-1 size-2 shrink-0 rounded-full",
                      n.isRead ? "bg-muted" : "bg-primary shadow-[0_0_8px] shadow-primary/50",
                    )}
                    aria-label={n.isRead ? "Read" : "Unread"}
                  />
                </div>
                {n.body ? <p className="mt-1 text-sm text-muted-foreground">{n.body}</p> : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        {!items.length ? (
          <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
            No notifications for this filter.
          </p>
        ) : null}
      </div>
    </>
  );
}
