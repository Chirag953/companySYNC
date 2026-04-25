"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockNotifications } from "@/lib/mock-data/notifications";
import { useAuth } from "@/lib/auth-context";
import { formatDistanceToNow } from "date-fns";
import { Bell, CalendarClock, FileText, ListTodo, Megaphone } from "lucide-react";
import { toast } from "sonner";

const filters = ["all", "unread", "task", "leave", "attendance", "document"] as const;

function iconFor(type: string) {
  switch (type) {
    case "task":
      return ListTodo;
    case "leave":
      return CalendarClock;
    case "attendance":
      return Bell;
    case "document":
      return FileText;
    default:
      return Megaphone;
  }
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof filters)[number]>("all");

  const items = useMemo(() => {
    const mine = mockNotifications.filter((n) => n.userId === user?.id);
    if (tab === "all") return mine;
    if (tab === "unread") return mine.filter((n) => !n.isRead);
    return mine.filter((n) => n.type === tab);
  }, [user?.id, tab]);

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
      <Tabs value={tab} onValueChange={(v) => setTab(v as (typeof filters)[number])}>
        <TabsList className="flex h-auto flex-wrap gap-1">
          {filters.map((f) => (
            <TabsTrigger key={f} value={f} className="min-h-11 capitalize">
              {f}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4 space-y-2">
          {items.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div
                key={n.id}
                className="flex gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-snug">{n.title}</p>
                    <span className={`mt-1 size-2 shrink-0 rounded-full ${n.isRead ? "bg-muted" : "bg-primary"}`} />
                  </div>
                  {n.body ? <p className="mt-1 text-sm text-muted-foreground">{n.body}</p> : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
          {!items.length ? <p className="text-sm text-muted-foreground">No notifications.</p> : null}
        </div>
      </Tabs>
    </>
  );
}
