import type { AttendanceRecord, AttendanceRules } from "@/lib/types";
import { addDays, format } from "date-fns";

const userIds = [
  "user-emp-1",
  "user-emp-2",
  "user-emp-3",
  "user-emp-4",
  "user-emp-5",
  "user-mgr-1",
];

function seedRecords(): AttendanceRecord[] {
  const start = new Date("2026-03-28");
  const records: AttendanceRecord[] = [];
  let id = 1;
  for (let d = 0; d < 35; d++) {
    const date = addDays(start, d);
    const dateStr = format(date, "yyyy-MM-dd");
    userIds.forEach((userId, ui) => {
      const mod = (d + ui) % 7;
      const status =
        mod === 0
          ? "absent"
          : mod === 5
            ? "half_day"
            : mod === 6
              ? "late"
              : "on_time";
      const checkIn =
        status === "absent"
          ? undefined
          : `${dateStr}T0${9 + (ui % 2)}:${15 + ui}:00.000Z`;
      const checkOut =
        status === "absent"
          ? undefined
          : `${dateStr}T18:${10 + ui}:00.000Z`;
      records.push({
        id: `att-${id++}`,
        userId,
        date: dateStr,
        checkIn,
        checkOut,
        workingMinutes:
          status === "absent" ? undefined : status === "half_day" ? 240 : 480,
        status: status === "on_time" ? "present" : status,
      });
    });
  }
  return records;
}

export const mockAttendanceRecords: AttendanceRecord[] = seedRecords();

export const mockAttendanceRules: AttendanceRules = {
  lateMarkAfterMinutes: 15,
  halfDayAfterMinutes: 240,
  overtimeAfterMinutes: 480,
};
