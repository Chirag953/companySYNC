"use client";

import { cn } from "@/lib/utils";
import { segmentedTabsListClass, segmentedTabsTriggerClass } from "@/lib/segmented-tab-styles";

type SegmentedControlItem<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  items: readonly SegmentedControlItem<T>[];
  ariaLabel: string;
  className?: string;
  triggerClassName?: string;
};

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  items,
  ariaLabel,
  className,
  triggerClassName,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn(segmentedTabsListClass, className)} role="group" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            className={cn(
              segmentedTabsTriggerClass,
              "rounded-md text-foreground/60 transition-colors hover:text-foreground",
              active && "bg-gradient-to-r from-emerald-500 to-cyan-500 !text-white shadow-sm",
              triggerClassName,
            )}
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
