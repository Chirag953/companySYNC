"use client";

import { ListTodo, Users, CalendarCheck, Clock3 } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { mockTasks } from "@/lib/mock-data/tasks";
import { mockLeaveRequests } from "@/lib/mock-data/leaves";
import { mockAttendanceRecords } from "@/lib/mock-data/attendance";
import { mockTeams } from "@/lib/mock-data/teams";
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format } from "date-fns";

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
  const COLORS = ["#94a3b8", "#3b82f6", "#22c55e"];

  const today = format(new Date(), "yyyy-MM-dd");
  const todayRows = mockAttendanceRecords.filter((a) => a.date === today).slice(0, 6);

  const pending = mockLeaveRequests.filter((l) => l.status === "pending").slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Team size" value={teamSize} icon={Users} />
        <StatCard label="Pending tasks (company)" value={pendingTasks} icon={ListTodo} />
        <StatCard label="Approved leaves (sample)" value={approvedThisMonth} icon={CalendarCheck} />
        <StatCard label="Late marks (sample set)" value={lateThisWeek} icon={Clock3} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-medium">Task status distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
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
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-medium">Pending leave requests</h3>
        <div className="space-y-3">
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
              <div className="flex gap-2">
                <Button size="sm" className="min-h-11 bg-emerald-600 hover:bg-emerald-600/90">
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="min-h-11">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
