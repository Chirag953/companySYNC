"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";

const STATUS_CLASSES: Record<AttendanceStatus, string> = {
  present: "bg-emerald-500/85 text-white dark:bg-emerald-600/90 dark:text-emerald-50",
  on_time: "bg-emerald-500/85 text-white dark:bg-emerald-600/90 dark:text-emerald-50",
  late: "bg-amber-500/85 text-white dark:bg-amber-600/90 dark:text-amber-50",
  half_day: "bg-sky-500/85 text-white dark:bg-sky-600/90 dark:text-sky-50",
  absent: "bg-rose-500/75 text-white dark:bg-rose-600/85 dark:text-rose-50",
};

const LEGEND: { label: string; cls: string }[] = [
  { label: "Present", cls: "bg-emerald-500/85 dark:bg-emerald-600/90" },
  { label: "Late", cls: "bg-amber-500/85 dark:bg-amber-600/90" },
  { label: "Half day", cls: "bg-sky-500/85 dark:bg-sky-600/90" },
  { label: "Absent", cls: "bg-rose-500/75 dark:bg-rose-600/85" },
];

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  on_time: "Present",
  late: "Late",
  half_day: "Half",
  absent: "Absent",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const statusByDate = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    for (const r of records) {
      map.set(r.date, r.status);
    }
    return map;
  }, [records]);

  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Previous month"
          onClick={() => setMonth((m) => subMonths(m, 1))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-0 truncate text-center text-sm font-semibold tabular-nums">
          {format(month, "MMMM yyyy")}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Next month"
          onClick={() => setMonth((m) => addMonths(m, 1))}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] font-medium text-muted-foreground sm:gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-0.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const status = statusByDate.get(key);
          const inMonth = isSameMonth(day, month);
          const today = isToday(day);
          return (
            <div
              key={key}
              title={status ? `${key} · ${status.replace("_", " ")}` : key}
              aria-label={status ? `${format(day, "PPP")}: ${STATUS_LABELS[status]}` : format(day, "PPP")}
              className={[
                "flex aspect-square min-h-[2rem] flex-col items-center justify-center rounded-md text-[11px] font-medium tabular-nums transition-colors sm:min-h-0",
                !inMonth ? "opacity-30" : "",
                status ? STATUS_CLASSES[status] : inMonth ? "bg-muted/50 text-muted-foreground" : "bg-transparent",
                today ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : "",
              ].join(" ")}
            >
              <span>{format(day, "d")}</span>
              {status ? <span className="text-[8px] leading-none opacity-90">{STATUS_LABELS[status]}</span> : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t pt-3">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={`size-2.5 shrink-0 rounded-sm ${item.cls}`} aria-hidden />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
