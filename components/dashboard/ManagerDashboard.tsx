"use client";

import Link from "next/link";
import { ListTodo, Users, CalendarCheck, Clock3 } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "@/components/shared/ChartTooltip";
import { StatCard } from "@/components/shared/StatCard";
import { buttonVariants } from "@/components/ui/button";
import { mockTasks } from "@/lib/mock-data/tasks";
import { mockLeaveRequests } from "@/lib/mock-data/leaves";
import { mockAttendanceRecords } from "@/lib/mock-data/attendance";
import { mockTeams } from "@/lib/mock-data/teams";
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DashboardStickyBoard } from "@/components/dashboard/DashboardStickyBoard";

/** Distinct hues per slice — avoid same green/cyan family for every segment */
const TASK_STATUS_PIE: Record<string, { gradId: string; from: string; to: string }> = {
  "To Do": { gradId: "managerTaskGradTodo", from: "#f59e0b", to: "#b45309" },
  "In Progress": { gradId: "managerTaskGradProgress", from: "#3b82f6", to: "#1e40af" },
  Done: { gradId: "managerTaskGradDone", from: "#10b981", to: "#047857" },
};

export function ManagerDashboard() {
  const { user } = useAuth();
  const team = mockTeams.find((t) => t.managerId === user?.id) ?? mockTeams[0];
  const teamSize = team.memberIds.length;
  const pendingTasks = mockTasks.filter((t) => t.status !== "completed").length;
  const approvedThisMonth = mockLeaveRequests.filter((l) => l.status === "approved").length;
  const lateThisWeek = mockAttendanceRecords.filter((a) => a.status === "late").length;

  const pieData = [
    { name: "To Do", value: mockTasks.filter((t) => t.status === "todo").length },
    { name: "In Progress", value: mockTasks.filter((t) => t.status === "in_progress").length },
    { name: "Done", value: mockTasks.filter((t) => t.status === "completed").length },
  ];
  const today = format(new Date(), "yyyy-MM-dd");
  const todayRows = mockAttendanceRecords.filter((a) => a.date === today).slice(0, 6);

  const pending = mockLeaveRequests.filter((l) => l.status === "pending").slice(0, 4);

  return (
    <div className="space-y-10">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Team size" value={teamSize} icon={Users} />
        <StatCard label="Pending tasks (company)" value={pendingTasks} icon={ListTodo} />
        <StatCard label="Approved leaves (sample)" value={approvedThisMonth} icon={CalendarCheck} />
        <StatCard label="Late marks (sample set)" value={lateThisWeek} icon={Clock3} />
      </div>
      <div className="panel-glass min-w-0 rounded-xl p-4 sm:p-6">
        <DashboardStickyBoard />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="panel-glass p-5">
          <h3 className="mb-4 text-sm font-medium">Task status distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {Object.values(TASK_STATUS_PIE).map((cfg) => (
                    <linearGradient key={cfg.gradId} id={cfg.gradId} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={cfg.from} />
                      <stop offset="100%" stopColor={cfg.to} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {pieData.map((d) => {
                    const cfg = TASK_STATUS_PIE[d.name] ?? TASK_STATUS_PIE["To Do"];
                    return <Cell key={d.name} fill={`url(#${cfg.gradId})`} />;
                  })}
                </Pie>
                <Tooltip content={ChartTooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel-glass p-5">
          <h3 className="mb-4 text-sm font-medium">Team attendance today (sample)</h3>
          <ul className="divide-y rounded-md border">
            {todayRows.map((row) => (
              <li key={row.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-muted-foreground">{row.userId.slice(-4)}</span>
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="panel-glass p-5">
        <h3 className="mb-4 text-sm font-medium">Pending leave requests</h3>
        <div className="space-y-4">
          {pending.map((l) => (
            <div
              key={l.id}
              className="flex flex-col gap-2 rounded-md border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium">Request {l.id}</p>
                <p className="text-xs text-muted-foreground">
                  {l.daysCount} day(s) · {l.reason ?? "No reason"}
                </p>
              </div>
              <Link
                href="/leave/requests"
                className={cn(buttonVariants({ size: "sm" }), "min-h-11 inline-flex")}
              >
                Review request
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
