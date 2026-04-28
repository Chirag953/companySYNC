"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { mockNotifications } from "@/lib/mock-data/notifications";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const { user } = useAuth();
  const items = mockNotifications
    .filter((n) => n.userId === user?.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const unread = items.filter((n) => !n.isRead).length;
  const latest = items.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative min-h-11 min-w-11",
        )}
      >
        <Bell className="size-5 text-muted-foreground" aria-hidden />
        {unread > 0 ? (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
        <span className="sr-only">Notifications</span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="px-4 py-3 text-sm font-semibold">Notifications</div>
        <Separator />
        <ScrollArea className="h-72">
          <ul className="divide-y">
            {latest.map((n) => (
              <li key={n.id} className="px-4 py-3 text-sm">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1 size-2 shrink-0 rounded-full ${n.isRead ? "bg-muted" : "bg-primary"}`}
                  />
                  <div>
                    <p className="font-medium leading-tight">{n.title}</p>
                    {n.body ? (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
            {!latest.length ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications</li>
            ) : null}
          </ul>
        </ScrollArea>
        <Separator />
        <div className="p-2">
          <Link
            href="/notifications"
            className={cn(buttonVariants({ variant: "ghost" }), "flex w-full justify-center min-h-11")}
          >
            View all
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
