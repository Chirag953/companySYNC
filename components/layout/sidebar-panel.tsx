"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getNavSections, type NavItem, type NavSection } from "@/lib/nav-config";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

/** Green–cyan glass nav: active row */
const navActiveClass =
  "border border-emerald-400/25 bg-gradient-to-br from-emerald-500/18 via-cyan-500/12 to-white/8 text-emerald-700 shadow-[0_8px_24px_-14px_rgba(16,185,129,0.75)] backdrop-blur-xl ring-1 ring-white/35 dark:border-emerald-300/20 dark:from-emerald-400/18 dark:via-cyan-400/12 dark:to-white/[0.06] dark:text-emerald-100 dark:shadow-[0_8px_26px_-14px_rgba(45,212,191,0.55)] dark:ring-white/10";
const navInactiveClass =
  "text-muted-foreground hover:bg-sidebar-accent/90 hover:text-sidebar-foreground dark:hover:bg-white/10 dark:hover:text-sidebar-foreground";

function linkActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href !== "/dashboard" && pathname.startsWith(href)) return true;
  return false;
}

function groupHasActiveChild(pathname: string, items: NavItem[]) {
  return items.some((i) => linkActive(pathname, i.href));
}

function ActiveMenuDot({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <span
      className={cn(
        "ml-auto size-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.85)] ring-2 ring-white/30 dark:bg-emerald-300 dark:ring-black/25",
        collapsed && "absolute right-2 top-1/2 ml-0 -translate-y-1/2",
      )}
      aria-hidden
    />
  );
}

function NavGroupRow({
  label,
  icon: GroupIcon,
  items,
  collapsed,
  pathname,
  onNavigate,
}: {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const initiallyOpen = groupHasActiveChild(pathname, items);
  const [open, setOpen] = useState(initiallyOpen);
  const headerActive = groupHasActiveChild(pathname, items);

  useEffect(() => {
    if (groupHasActiveChild(pathname, items)) setOpen(true);
  }, [pathname, items]);

  if (collapsed) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "relative flex min-h-11 w-full items-center justify-center rounded-md py-2 text-sm font-medium transition-colors",
            headerActive ? navActiveClass : navInactiveClass,
          )}
          title={label}
          aria-expanded={open}
          aria-label={label}
        >
          <GroupIcon className="size-4 shrink-0" />
          {headerActive ? <ActiveMenuDot collapsed /> : null}
        </button>
        {open ? (
          <div className="flex flex-col gap-1 border-l border-sidebar-border/60 pl-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = linkActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={cn(
                    "relative flex min-h-11 items-center justify-center rounded-md py-2 text-sm font-medium transition-colors",
                    active ? navActiveClass : navInactiveClass,
                  )}
                  title={`${label}: ${item.label}`}
                >
                  <Icon className="size-4 shrink-0" />
                  {active ? <ActiveMenuDot collapsed /> : null}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
          headerActive ? navActiveClass : navInactiveClass,
        )}
        aria-expanded={open}
      >
        <GroupIcon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {headerActive ? <ActiveMenuDot /> : null}
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="ml-1 flex flex-col gap-1 border-l border-sidebar-border/60 pl-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = linkActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={cn(
                  "relative flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? navActiveClass : navInactiveClass,
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {active ? <ActiveMenuDot /> : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function NavLinkRow({
  item,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const active = linkActive(pathname, item.href);
  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => onNavigate?.()}
      className={cn(
        "relative flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? navActiveClass : navInactiveClass,
        collapsed && "justify-center px-0",
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
      {active ? <ActiveMenuDot collapsed={collapsed} /> : null}
    </Link>
  );
}

function renderSection(
  section: NavSection,
  collapsed: boolean,
  pathname: string,
  onNavigate?: () => void,
) {
  if (section.type === "link") {
    return (
      <NavLinkRow
        key={section.item.href}
        item={section.item}
        collapsed={collapsed}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    );
  }
  return (
    <NavGroupRow
      key={section.label}
      label={section.label}
      icon={section.icon}
      items={section.items}
      collapsed={collapsed}
      pathname={pathname}
      onNavigate={onNavigate}
    />
  );
}

export type SidebarPanelProps = {
  collapsed: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  showCollapseToggle: boolean;
  /** Close mobile sheet after navigating */
  onNavigate?: () => void;
};

export function SidebarPanel({
  collapsed,
  onCollapsedChange,
  showCollapseToggle,
  onNavigate,
}: SidebarPanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const sections = getNavSections(user?.role ?? null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-transparent">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border/70 px-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-gradient-to-br from-emerald-600 to-cyan-600 text-xs font-bold text-white shadow-sm dark:from-emerald-500 dark:to-cyan-500">
          CS
        </div>
        {!collapsed ? (
          <div className="leading-tight">
            <p className="text-sm font-semibold">companySYNC</p>
          </div>
        ) : null}
        {showCollapseToggle && onCollapsedChange ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto hidden lg:flex"
            onClick={() => onCollapsedChange(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        ) : null}
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-3">
        {sections.map((section) => renderSection(section, collapsed, pathname, onNavigate))}
      </nav>
      <div
        className={cn(
          "mt-auto shrink-0 space-y-2 border-t border-sidebar-border/60 bg-sidebar-accent/70 p-3 backdrop-blur-md dark:bg-black/35",
          collapsed && "px-2",
        )}
      >
        {user ? (
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg border border-sidebar-border/60 bg-card/40 p-2 shadow-sm dark:border-white/10 dark:bg-white/[0.08]",
              collapsed && "justify-center border-0 bg-transparent p-0 shadow-none",
            )}
          >
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
          className={cn(
            "w-full min-h-11 gap-2 border-sidebar-border/70 bg-card/40 backdrop-blur-sm hover:bg-sidebar-accent hover:text-foreground dark:border-white/15 dark:bg-white/[0.08] dark:hover:bg-white/[0.14]",
            collapsed && "px-0",
          )}
          onClick={() => setLogoutOpen(true)}
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          {!collapsed ? <span>Log out</span> : null}
        </Button>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Sign out?"
        description="You will be returned to the sign-in page."
        confirmLabel="Sign out"
        onConfirm={() => {
          onNavigate?.();
          logout();
          router.push("/login");
        }}
      />
    </div>
  );
}
