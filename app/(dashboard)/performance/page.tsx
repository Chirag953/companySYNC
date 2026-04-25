"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { mockUsers } from "@/lib/mock-data/users";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Row = {
  id: string;
  name: string;
  tasks: number;
  attendance: number;
  onTime: number;
};

export default function PerformancePage() {
  const { role } = useAuth();

  const rows: Row[] = useMemo(
    () =>
      mockUsers
        .filter((u) => u.role === "employee")
        .map((u, i) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          tasks: 20 + (i % 7) * 3,
          attendance: 88 + (i % 5),
          onTime: 72 + (i % 8),
        })),
    [],
  );

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: "name", header: "Employee" },
      { accessorKey: "tasks", header: "Tasks completed" },
      { accessorKey: "attendance", header: "Attendance %" },
      { accessorKey: "onTime", header: "On-time %" },
    ],
    [],
  );

  const trend = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        m: `M${i + 1}`,
        score: 65 + (i % 6) * 5,
      })),
    [],
  );

  if (role === "employee") {
    return (
      <>
        <PageHeader title="My performance" description="Personal stats and trend (mock)." />
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Tasks completed</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">42</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Completion rate</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">86%</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Attendance</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">92%</CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trend (30 / 60 / 90 mock)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="m" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </>
    );
  }

  const deptData = [
    { name: "Engineering", score: 82 },
    { name: "HR", score: 74 },
    { name: "Sales", score: 79 },
  ];

  return (
    <>
      <PageHeader
        title="Performance"
        description={role === "admin" ? "Company-wide leaderboard (mock)." : "Team performance (mock)."}
      />
      <div className="mb-6 h-72 rounded-lg border bg-card p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" name="Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable columns={columns} data={rows} searchPlaceholder="Search employees…" />
    </>
  );
}
