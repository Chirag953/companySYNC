"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getNavSections, type NavItem, type NavSection } from "@/lib/nav-config";
import { UserAvatar } from "@/components/shared/UserAvatar";

function linkActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href !== "/dashboard" && pathname.startsWith(href)) return true;
  return false;
}

function groupHasActiveChild(pathname: string, items: NavItem[]) {
  return items.some((i) => linkActive(pathname, i.href));
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
            "flex min-h-11 w-full items-center justify-center rounded-md py-2 text-sm font-medium transition-colors",
            headerActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
          title={label}
          aria-expanded={open}
          aria-label={label}
        >
          <GroupIcon className="size-4 shrink-0" />
        </button>
        {open ? (
          <div className="flex flex-col gap-1 border-l border-border pl-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = linkActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={cn(
                    "flex min-h-11 items-center justify-center rounded-md py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  title={`${label}: ${item.label}`}
                >
                  <Icon className="size-4 shrink-0" />
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
          "flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
          headerActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        aria-expanded={open}
      >
        <GroupIcon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="ml-1 flex flex-col gap-1 border-l border-border pl-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = linkActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
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
  const { user, logout } = useAuth();
  const sections = getNavSections(user?.role ?? null);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-card">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          CS
        </div>
        {!collapsed ? (
          <div className="leading-tight">
            <p className="text-sm font-semibold">companySYNC</p>
            <p className="text-xs text-muted-foreground">Workforce</p>
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
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
        {sections.map((section) => renderSection(section, collapsed, pathname, onNavigate))}
      </nav>
      <Separator />
      <div className="shrink-0 space-y-2 p-3">
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
          onClick={() => {
            onNavigate?.();
            logout();
          }}
        >
          <LogOut className="size-4" />
          {!collapsed ? <span className="ml-2">Log out</span> : null}
        </Button>
      </div>
    </div>
  );
}
