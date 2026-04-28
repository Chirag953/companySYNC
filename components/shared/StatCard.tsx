import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { direction: "up" | "down"; value: string };
  className?: string;
};

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-gradient tabular-nums">{value}</div>
        {trend ? (
          <p className="text-xs text-muted-foreground">
            <span
              className={cn(
                "font-medium",
                trend.direction === "up" ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
            </span>{" "}
            vs last period
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
