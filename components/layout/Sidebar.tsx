"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarPanel } from "@/components/layout/sidebar-panel";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r bg-card md:flex md:flex-col",
        collapsed ? "w-[72px]" : "w-60",
      )}
    >
      <SidebarPanel
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        showCollapseToggle
      />
    </aside>
  );
}
