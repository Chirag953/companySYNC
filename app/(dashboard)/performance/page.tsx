"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/shared/ChartTooltip";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { managerVisibleUserIds } from "@/lib/audit-log-scope";
import { mockTeams } from "@/lib/mock-data/teams";
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

function escapeCsvValue(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export default function PerformancePage() {
  const { user, role } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const rows: Row[] = useMemo(() => {
    const employees = mockUsers.filter((u) => u.role === "employee");
    const scoped =
      role === "admin"
        ? employees
        : role === "manager" && user
          ? employees.filter((e) => managerVisibleUserIds(user.id).has(e.id))
          : employees;

    return scoped.map((u, i) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      tasks: 20 + (i % 7) * 3,
      attendance: 88 + (i % 5),
      onTime: 72 + (i % 8),
    }));
  }, [role, user]);

  const managerTeamBarData = useMemo(() => {
    if (role !== "manager" || !user) return [];
    return mockTeams
      .filter((t) => t.managerId === user.id)
      .map((team, i) => ({
        name: team.name,
        score: 76 + (i % 5) * 4,
      }));
  }, [role, user]);

  const displayRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || String(r.tasks).includes(q),
    );
  }, [rows, search]);

  const selectedRows = displayRows.filter((r) => selectedIds.has(r.id));
  const allVisibleSelected = displayRows.length > 0 && displayRows.every((r) => selectedIds.has(r.id));

  function toggleRow(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllVisible(checked: boolean) {
    setSelectedIds((current) => {
      if (checked) {
        return new Set([...current, ...displayRows.map((r) => r.id)]);
      }
      const visible = new Set(displayRows.map((r) => r.id));
      return new Set([...current].filter((id) => !visible.has(id)));
    });
  }

  function exportLeaderboardCsv() {
    const toExport = selectedRows.length > 0 ? selectedRows : displayRows;
    if (!toExport.length) return;

    const header = ["Employee ID", "Employee name", "Tasks completed (mock)", "Attendance %", "On-time %"];
    const lines = toExport.map((r) =>
      [r.id, r.name, r.tasks, r.attendance, r.onTime].map(escapeCsvValue).join(","),
    );
    const csv = [header.map(escapeCsvValue).join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `performance-leaderboard-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

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
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
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
                <defs>
                  <linearGradient id="performanceEmployeeLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="m" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={ChartTooltip} />
                <Line type="monotone" dataKey="score" stroke="url(#performanceEmployeeLineGrad)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </>
    );
  }

  const companyDeptData = [
    { name: "Engineering", score: 82 },
    { name: "HR", score: 74 },
    { name: "Sales", score: 79 },
  ];

  const barChartData = role === "admin" ? companyDeptData : managerTeamBarData;

  return (
    <>
      <PageHeader
        title="Performance"
        description={
          role === "admin"
            ? "Company-wide leaderboard (mock)."
            : "Your teams only — direct reports from teams you manage (mock)."
        }
      />
      <div className="panel-glass mb-8 h-72 p-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData}>
            <defs>
              <linearGradient id="performanceDeptBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip content={ChartTooltip} />
            <Bar dataKey="score" name="Score" fill="url(#performanceDeptBarGrad)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {role === "manager" && rows.length === 0 ? (
        <p className="mb-4 rounded-lg border border-dashed border-border/60 bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          No team members found for your managed teams in this mock dataset.
        </p>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Employee leaderboard</h2>
          <p className="text-sm text-muted-foreground">
            Mock scores · Select rows to export a subset, or export all visible rows when none are selected.
          </p>
        </div>
        <Button
          type="button"
          className="min-h-11 w-full gap-2 sm:w-auto"
          onClick={exportLeaderboardCsv}
          disabled={!displayRows.length}
        >
          <Download className="size-4" aria-hidden />
          {selectedRows.length > 0 ? `Export selected (${selectedRows.length})` : "Export CSV"}
        </Button>
      </div>

      <div className="mb-3">
        <Input
          aria-label="Search employees in leaderboard"
          placeholder="Search by name or employee id…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 max-w-md"
        />
      </div>

      <div className="panel-glass rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  aria-label="Select all visible employees"
                  checked={allVisibleSelected}
                  onCheckedChange={(checked) => toggleAllVisible(Boolean(checked))}
                />
              </TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Tasks completed</TableHead>
              <TableHead>Attendance %</TableHead>
              <TableHead>On-time %</TableHead>
              <TableHead className="w-[1%]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.length ? (
              displayRows.map((r) => {
                const selected = selectedIds.has(r.id);
                return (
                  <TableRow key={r.id} data-state={selected ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${r.name}`}
                        checked={selected}
                        onCheckedChange={(checked) => toggleRow(r.id, Boolean(checked))}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/performance/employee/${r.id}`}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {r.name}
                      </Link>
                    </TableCell>
                    <TableCell className="tabular-nums">{r.tasks}</TableCell>
                    <TableCell className="tabular-nums">{r.attendance}</TableCell>
                    <TableCell className="tabular-nums">{r.onTime}</TableCell>
                    <TableCell>
                      <Link
                        href={`/performance/employee/${r.id}`}
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        View detail
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-1 py-6">
                    <p className="font-medium text-foreground">No employees match</p>
                    <p className="text-sm text-muted-foreground">Try another search or filter context.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
