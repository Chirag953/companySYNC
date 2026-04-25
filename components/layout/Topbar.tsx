"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
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
import { breadcrumbsForPath, titleForPath } from "@/lib/route-titles";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useAuth } from "@/lib/auth-context";

export function Topbar({ pathname }: { pathname: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const crumbs = breadcrumbsForPath(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold md:text-xl">{titleForPath(pathname)}</h1>
        <nav className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground md:text-sm">
          <Link href="/dashboard" className="hover:text-foreground">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.href} className="flex items-center gap-1">
              <ChevronRight className="size-3" />
              <Link href={c.href} className="hover:text-foreground">
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
      <NotificationBell />
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
          <DropdownMenuItem
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
