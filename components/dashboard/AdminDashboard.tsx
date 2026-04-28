"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartTooltip } from "@/components/shared/ChartTooltip";
import { StatCard } from "@/components/shared/StatCard";
import { Users, UsersRound, CalendarClock, FileWarning } from "lucide-react";
import { mockUsers } from "@/lib/mock-data/users";
import { mockTeams } from "@/lib/mock-data/teams";
import { mockLeaveRequests } from "@/lib/mock-data/leaves";
import { mockDocuments } from "@/lib/mock-data/documents";
import { mockDepartments } from "@/lib/mock-data/departments";
import { mockAttendanceRecords } from "@/lib/mock-data/attendance";

export function AdminDashboard() {
  const pendingLeaves = mockLeaveRequests.filter((l) => l.status === "pending").length;
  const expiringDocs = mockDocuments.filter((d) => d.expiryStatus !== "valid").length;

  const deptHeadcount = mockDepartments.map((d) => ({
    name: d.name,
    count: mockUsers.filter((u) => u.departmentId === d.id).length,
  }));

  const last30 = Array.from({ length: 30 }).map((_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const date = `2026-04-${day}`;
    const present = mockAttendanceRecords.filter(
      (a) => a.date === date && (a.status === "present" || a.status === "on_time"),
    ).length;
    return { day, present };
  });

  const leavePie = [
    { name: "Sick", value: 12 },
    { name: "Casual", value: 18 },
    { name: "Paid", value: 24 },
    { name: "Unpaid", value: 4 },
  ];

  const leavePieFillByName: Record<string, string> = {
    Sick: "#10b981",
    Casual: "#3b82f6",
    Paid: "#a855f7",
    Unpaid: "#f97316",
  };

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
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="panel-glass p-5">
          <h3 className="mb-4 text-sm font-medium">Department headcount</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptHeadcount}>
                <defs>
                  <linearGradient id="adminDeptBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip content={ChartTooltip} />
                <Bar dataKey="count" fill="url(#adminDeptBarGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel-glass p-5">
          <h3 className="mb-4 text-sm font-medium">Attendance trend (sample month)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last30}>
                <defs>
                  <linearGradient id="adminAttendanceLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={ChartTooltip} />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="url(#adminAttendanceLineGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="panel-glass p-5">
        <h3 className="mb-4 text-sm font-medium">Leave type distribution</h3>
        <div className="mx-auto h-72 max-w-md">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={leavePie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {leavePie.map((slice) => (
                  <Cell key={slice.name} fill={leavePieFillByName[slice.name] ?? "#64748b"} />
                ))}
              </Pie>
              <Tooltip content={ChartTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
