import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

const map: Record<Priority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200" },
  medium: {
    label: "Medium",
    className: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  low: { label: "Low", className: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = map[priority];
  return (
    <Badge variant="secondary" className={cn("font-medium", cfg.className)}>
      {cfg.label}
    </Badge>
  );
}
