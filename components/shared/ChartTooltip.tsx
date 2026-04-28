"use client";

import { cn } from "@/lib/utils";

/** Recharts passes these props to custom tooltip content */
type ChartTooltipPayload = {
  name?: string;
  value?: string | number;
  dataKey?: string | number;
  color?: string;
};

export type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string | number;
  className?: string;
};

/**
 * Tooltip card for Recharts with emerald→cyan gradient labels (matches `.text-gradient` / PageHeader).
 * Use: `<Tooltip content={ChartTooltip} />` or `<Tooltip content={<ChartTooltip />} />` — Recharts will inject props.
 */
export function ChartTooltip({ active, payload, label, className }: ChartTooltipProps) {
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
              <span className="text-gradient">{entry.name ?? String(entry.dataKey ?? "")}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-gradient">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
