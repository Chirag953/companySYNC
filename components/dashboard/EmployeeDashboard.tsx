"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ListChecks, Palmtree, Timer } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { mockTasks } from "@/lib/mock-data/tasks";
import { mockLeaveBalances, mockLeaveTypes } from "@/lib/mock-data/leaves";
import { mockAttendanceRecords } from "@/lib/mock-data/attendance";
import { mockShifts } from "@/lib/mock-data/shifts";
import { useAuth } from "@/lib/auth-context";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format, subDays } from "date-fns";

export function EmployeeDashboard() {
  const { user } = useAuth();
  const uid = user?.id ?? "";
  const [checkedIn, setCheckedIn] = useState(false);
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const myTasks = mockTasks.filter((t) => t.assigneeId === uid);
  const assigned = myTasks.length;
  const completed = myTasks.filter((t) => t.status === "completed").length;
  const balanceTotal = mockLeaveBalances
    .filter((b) => b.userId === uid)
    .reduce((acc, b) => acc + (b.allocated - b.used), 0);
  const shift = mockShifts.find((s) => s.assignedUserIds.includes(uid)) ?? mockShifts[0];

  const topTasks = myTasks
    .filter((t) => t.status !== "completed")
    .slice(0, 5);

  const last7 = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
      const rec = mockAttendanceRecords.find((a) => a.userId === uid && a.date === d);
      return { label: format(subDays(new Date(), 6 - i), "EEE"), status: rec?.status ?? "absent" };
    });
  }, [uid]);

  const perfTrend = Array.from({ length: 12 }).map((_, i) => ({
    week: `W${i + 1}`,
    score: 60 + ((i + tick) % 5) * 8,
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tasks assigned" value={assigned} icon={ListChecks} />
        <StatCard label="Tasks completed" value={completed} icon={CheckCircle2} />
        <StatCard label="Leave balance (days)" value={balanceTotal} icon={Palmtree} />
        <StatCard label="Today's shift" value={shift.name} icon={Timer} />
      </div>
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="text-2xl font-mono font-semibold">
              {new Date(tick).toLocaleTimeString()}
            </p>
          </div>
          <Button
            size="lg"
            className="min-h-12 min-w-[11rem]"
            variant={checkedIn ? "secondary" : "default"}
            onClick={() => setCheckedIn((c) => !c)}
          >
            {checkedIn ? "Check out" : "Check in"}
          </Button>
        </div>
        {checkedIn ? (
          <p className="mt-2 text-sm text-muted-foreground">Timer running (mock) — session started.</p>
        ) : null}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-medium">My upcoming tasks</h3>
          <ul className="space-y-2">
            {topTasks.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
              >
                <span className="text-sm font-medium">{t.title}</span>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </li>
            ))}
            {!topTasks.length ? (
              <p className="text-sm text-muted-foreground">No upcoming tasks.</p>
            ) : null}
          </ul>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-medium">Attendance last 7 days</h3>
          <div className="flex gap-2">
            {last7.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`h-16 w-full rounded-md ${
                    d.status === "present" || d.status === "on_time"
                      ? "bg-emerald-500/80 dark:bg-emerald-600/85"
                      : d.status === "late"
                        ? "bg-amber-500/80 dark:bg-amber-600/85"
                        : d.status === "half_day"
                          ? "bg-sky-500/80 dark:bg-sky-600/85"
                          : "bg-rose-500/70 dark:bg-rose-600/80"
                  }`}
                  title={d.status}
                />
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-medium">Performance trend (mock)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={perfTrend}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground shadow-sm">
        Leave types:{" "}
        {mockLeaveTypes.map((t) => (
          <span key={t.id} className="mr-3 inline-block">
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}
