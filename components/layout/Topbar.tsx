"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { breadcrumbsForPath } from "@/lib/route-titles";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/lib/auth-context";
import { AppLogo } from "@/components/shared/AppLogo";

export function Topbar({
  pathname,
  onMenuClick,
}: {
  pathname: string;
  /** Opens the same sidebar panel as desktop (mobile / tablet). */
  onMenuClick?: () => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const crumbs = breadcrumbsForPath(pathname);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      {onMenuClick ? (
        <button
          type="button"
          onClick={onMenuClick}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "shrink-0 md:hidden")}
          aria-label="Open menu"
        >
          <Menu className="size-4" aria-hidden />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground md:text-base">
          <Link
            href="/dashboard"
            className="group inline-flex min-h-9 min-w-9 items-center justify-center rounded-md hover:bg-accent hover:text-foreground"
          >
            <AppLogo size={28} />
            <span className="sr-only">Dashboard — companySYNC home</span>
          </Link>
          {crumbs.map((c) => (
            <span key={c.href} className="flex min-w-0 items-center gap-1">
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/80" aria-hidden />
              {c.current ? (
                <span className="truncate font-medium text-foreground" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="truncate hover:text-foreground">
                  {c.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <NotificationBell />
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: "ghost" }), "min-h-11 gap-2 px-2 inline-flex items-center rounded-lg")}
        >
          {user ? (
            <UserAvatar firstName={user.firstName} lastName={user.lastName} size="sm" />
          ) : null}
          <span className="hidden text-sm font-medium sm:inline">
            {user ? `${user.firstName} ${user.lastName}` : ""}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/settings")}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Sign out?"
        description="You will be returned to the sign-in page."
        confirmLabel="Sign out"
        onConfirm={() => {
          logout();
          router.push("/login");
        }}
      />
    </header>
  );
}
