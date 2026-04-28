"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarPanel } from "@/components/layout/sidebar-panel";
import { Topbar } from "@/components/layout/Topbar";
import { LoadingState } from "@/components/shared/LoadingState";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <LoadingState
        message="Preparing your workspace…"
        description="Redirecting to sign in if your session is missing."
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-transparent md:flex-row">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="h-full w-60 max-w-[min(100vw-2rem,18rem)] border-r border-sidebar-border/80 bg-sidebar/95 p-0 shadow-[4px_0_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:max-w-60"
        >
          <SidebarPanel
            collapsed={false}
            showCollapseToggle={false}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[margin] duration-200 ease-out",
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-60",
        )}
      >
        <Topbar pathname={pathname} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
