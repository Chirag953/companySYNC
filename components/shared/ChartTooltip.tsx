"use client";

import type { TooltipContentProps } from "recharts";
import { cn } from "@/lib/utils";

function formatTooltipValue(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.map(String).join(", ");
  return String(v);
}

type ChartTooltipComponentProps = TooltipContentProps & { className?: string };

/**
 * Tooltip card for Recharts with emerald→cyan gradient labels (matches `.text-gradient` / PageHeader).
 * Use: `<Tooltip content={ChartTooltip} />` — Recharts injects `TooltipContentProps`.
 */
export function ChartTooltip({ active, payload, label, className }: ChartTooltipComponentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-popover/95 px-3 py-2.5 text-sm shadow-lg backdrop-blur-md dark:bg-popover/90",
        className,
      )}
    >
      {label != null && String(label) !== "" && (
        <p className="mb-2 border-b border-border/40 pb-1.5 font-display text-sm font-semibold text-gradient">
          {label}
        </p>
      )}
      <ul className="space-y-1.5">
        {payload.map((entry, i) => (
          <li key={i} className="flex items-baseline justify-between gap-6">
            <span className="flex min-w-0 items-center gap-2 font-medium leading-tight">
              {entry.color ? (
                <span
                  className="size-2 shrink-0 rounded-full ring-1 ring-border/60"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden
                />
              ) : null}
              <span className="text-gradient">
                {entry.name != null ? String(entry.name) : String(entry.dataKey ?? "")}
              </span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-gradient">{formatTooltipValue(entry.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
