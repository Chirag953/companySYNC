"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { Users, UsersRound, CalendarClock, FileWarning } from "lucide-react";
import { mockUsers } from "@/lib/mock-data/users";
import { mockTeams } from "@/lib/mock-data/teams";
import { mockLeaveRequests } from "@/lib/mock-data/leaves";
import { mockDocuments } from "@/lib/mock-data/documents";
import { DashboardStickyBoard } from "@/components/dashboard/DashboardStickyBoard";

export function AdminDashboard() {
  const pendingLeaves = mockLeaveRequests.filter((l) => l.status === "pending").length;
  const expiringDocs = mockDocuments.filter((d) => d.expiryStatus !== "valid").length;

  return (
    <div className="space-y-10">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total employees" value={mockUsers.length} icon={Users} />
        <StatCard label="Active teams" value={mockTeams.length} icon={UsersRound} />
        <StatCard label="Pending leave requests" value={pendingLeaves} icon={CalendarClock} />
        <StatCard label="Documents expiring soon" value={expiringDocs} icon={FileWarning} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/users" className={cn(buttonVariants({ size: "sm" }), "min-h-11 inline-flex")}>
          Add user
        </Link>
        <Link
          href="/teams"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "min-h-11 inline-flex")}
        >
          Create team
        </Link>
        <Link
          href="/leave"
          className={cn(buttonVariants({ size: "sm", variant: "outline" }), "min-h-11 inline-flex")}
        >
          Review leaves
        </Link>
      </div>
      <div className="panel-glass min-w-0 rounded-xl p-4 sm:p-6">
        <DashboardStickyBoard />
      </div>
    </div>
  );
}
