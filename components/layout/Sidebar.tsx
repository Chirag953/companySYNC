"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { navForRole } from "@/lib/nav-config";
import { UserAvatar } from "@/components/shared/UserAvatar";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const items = navForRole(user?.role ?? null);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r bg-card md:flex md:flex-col",
        collapsed ? "w-[72px]" : "w-60",
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b px-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          CS
        </div>
        {!collapsed ? (
          <div className="leading-tight">
            <p className="text-sm font-semibold">companySYNC</p>
            <p className="text-xs text-muted-foreground">Workforce</p>
          </div>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto hidden lg:flex"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="space-y-2 p-3">
        {user ? (
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <UserAvatar firstName={user.firstName} lastName={user.lastName} size="sm" />
            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs capitalize text-muted-foreground">{user.role}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        <Button
          variant="outline"
          className={cn("w-full min-h-11", collapsed && "px-0")}
          onClick={() => logout()}
        >
          <LogOut className="size-4" />
          {!collapsed ? <span className="ml-2">Log out</span> : null}
        </Button>
      </div>
    </aside>
  );
}
