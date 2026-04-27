import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus, LeaveStatus, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type AnyStatus = TaskStatus | LeaveStatus | AttendanceStatus;

const styles: Record<string, string> = {
  todo: "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  in_progress: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
  completed: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  approved: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  rejected: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
  present: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  absent: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
  half_day: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  late: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
  on_time: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
};

const labels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  present: "Present",
  absent: "Absent",
  half_day: "Half Day",
  late: "Late",
  on_time: "On Time",
};

export function StatusBadge({ status }: { status: AnyStatus }) {
  return (
    <Badge variant="secondary" className={cn("font-medium capitalize", styles[status])}>
      {labels[status] ?? status}
    </Badge>
  );
}
