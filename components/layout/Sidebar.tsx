"use client";

import { cn } from "@/lib/utils";
import { SidebarPanel } from "@/components/layout/sidebar-panel";

export type SidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 hidden h-screen shrink-0 flex-col border-r border-sidebar-border/80 bg-sidebar/85 shadow-[4px_0_24px_-8px_rgba(0,0,0,0.45)] backdrop-blur-xl dark:bg-sidebar/80 dark:shadow-[4px_0_28px_-6px_rgba(6,182,212,0.12)] md:flex",
        collapsed ? "w-[72px]" : "w-60",
      )}
    >
      <SidebarPanel
        collapsed={collapsed}
        onCollapsedChange={onCollapsedChange}
        showCollapseToggle
      />
    </aside>
  );
}
