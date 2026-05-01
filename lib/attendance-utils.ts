import { format, parseISO } from "date-fns";
import type { AttendanceRecord, AttendanceStatus, Department, User } from "@/lib/types";

export type EnrichedAttendanceRow = AttendanceRecord & {
  employeeName: string;
  email: string;
  departmentName: string;
  departmentId?: string;
};

export function getAttendanceDateBounds(records: { date: string }[]) {
  const dates = [...new Set(records.map((r) => r.date))].sort();
  const today = format(new Date(), "yyyy-MM-dd");
  return {
    min: dates[0] ?? today,
    max: dates[dates.length - 1] ?? today,
  };
}

export function normalizeDateRange(fromStr: string, toStr: string): { from: string; to: string } {
  if (fromStr <= toStr) return { from: fromStr, to: toStr };
  return { from: toStr, to: fromStr };
}

export function isDateWithinRange(dateStr: string, fromStr: string, toStr: string): boolean {
  const { from, to } = normalizeDateRange(fromStr, toStr);
  return dateStr >= from && dateStr <= to;
}

export function getEmployeeFullName(user: User | undefined, fallbackId: string): string {
  if (!user) return fallbackId;
  return `${user.firstName} ${user.lastName}`;
}

export function getDepartmentName(
  departmentId: string | undefined,
  departments: Department[],
): string {
  if (!departmentId) return "—";
  return departments.find((d) => d.id === departmentId)?.name ?? "—";
}

export function formatTimeFromIso(iso?: string): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "h:mm a");
  } catch {
    return "—";
  }
}

export function formatWorkingMinutesDisplay(minutes?: number): string {
  if (minutes == null || Number.isNaN(minutes)) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h 0m`;
  return `${h}h ${m}m`;
}

export function formatAttendanceStatusForCsv(status: AttendanceStatus): string {
  const map: Record<AttendanceStatus, string> = {
    present: "Present",
    absent: "Absent",
    half_day: "Half Day",
    late: "Late",
    on_time: "On Time",
  };
  return map[status] ?? status;
}

export function dayNameForDate(dateStr: string): string {
  try {
    return format(parseISO(`${dateStr}T12:00:00`), "EEEE");
  } catch {
    return "—";
  }
}

export function escapeCsvValue(value: string | number | undefined | null): string {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildCompanyAttendanceCsv(rows: EnrichedAttendanceRow[]): string {
  const header = [
    "Employee name",
    "Email",
    "Department",
    "Date",
    "Day",
    "Check-in",
    "Check-out",
    "Working minutes",
    "Working hours",
    "Status",
  ];
  const lines = rows.map((row) =>
    [
      row.employeeName,
      row.email,
      row.departmentName,
      row.date,
      dayNameForDate(row.date),
      formatTimeFromIso(row.checkIn),
      formatTimeFromIso(row.checkOut),
      row.workingMinutes ?? "",
      formatWorkingMinutesDisplay(row.workingMinutes),
      formatAttendanceStatusForCsv(row.status),
    ]
      .map(escapeCsvValue)
      .join(","),
  );
  return [header.map(escapeCsvValue).join(","), ...lines].join("\n");
}

export function buildEmployeeAttendanceCsv(rows: AttendanceRecord[]): string {
  const header = [
    "Date",
    "Day",
    "Check-in",
    "Check-out",
    "Working minutes",
    "Working hours",
    "Status",
  ];
  const lines = rows.map((row) =>
    [
      row.date,
      dayNameForDate(row.date),
      formatTimeFromIso(row.checkIn),
      formatTimeFromIso(row.checkOut),
      row.workingMinutes ?? "",
      formatWorkingMinutesDisplay(row.workingMinutes),
      formatAttendanceStatusForCsv(row.status),
    ]
      .map(escapeCsvValue)
      .join(","),
  );
  return [header.map(escapeCsvValue).join(","), ...lines].join("\n");
}

export function downloadCsvString(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function averageWorkingMinutes(records: { workingMinutes?: number }[]): number | null {
  const vals = records.map((r) => r.workingMinutes).filter((m): m is number => m != null && !Number.isNaN(m));
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function slugifyFilenamePart(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "employee";
}
