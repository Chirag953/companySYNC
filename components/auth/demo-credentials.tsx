"use client";

import { cn } from "@/lib/utils";

type DemoCredentialsProps = {
  variant: "dark" | "light";
};

/** Collapsible Phase 1 demo emails — reused on login brand strip and mobile form. */
export function DemoCredentials({ variant }: DemoCredentialsProps) {
  const isDark = variant === "dark";
  return (
    <details
      className={cn(
        "group rounded-2xl border transition-colors",
        isDark
          ? "border-white/15 bg-black/20 backdrop-blur-md dark:bg-black/30"
          : "border-border/80 bg-muted/30 dark:bg-muted/20",
      )}
    >
      <summary
        className={cn(
          "cursor-pointer list-none px-4 py-3 text-xs font-semibold uppercase tracking-wider outline-none [&::-webkit-details-marker]:hidden",
          isDark ? "text-white/85" : "text-muted-foreground",
        )}
      >
        <span className="flex items-center justify-between gap-2">
          Demo credentials
          <span className="text-[0.65rem] font-normal opacity-70 transition group-open:rotate-180">▼</span>
        </span>
      </summary>
      <div
        className={cn(
          "border-t px-4 pb-4 pt-2 text-sm leading-relaxed",
          isDark ? "border-white/10 text-primary-foreground/88" : "text-muted-foreground",
        )}
      >
        Phase 1 uses mock data. Sign in with{" "}
        <code
          className={cn(
            "rounded px-1 py-0.5 font-mono text-[0.75rem]",
            isDark ? "bg-black/30 dark:bg-black/45" : "bg-background text-foreground",
          )}
        >
          admin@company.com
        </code>
        ,{" "}
        <code
          className={cn(
            "rounded px-1 py-0.5 font-mono text-[0.75rem]",
            isDark ? "bg-black/30 dark:bg-black/45" : "bg-background text-foreground",
          )}
        >
          manager@company.com
        </code>
        , or{" "}
        <code
          className={cn(
            "rounded px-1 py-0.5 font-mono text-[0.75rem]",
            isDark ? "bg-black/30 dark:bg-black/45" : "bg-background text-foreground",
          )}
        >
          employee@company.com
        </code>{" "}
        — password{" "}
        <code
          className={cn(
            "rounded px-1 py-0.5 font-mono text-[0.75rem]",
            isDark ? "bg-black/30 dark:bg-black/45" : "bg-background text-foreground",
          )}
        >
          password
        </code>
        .
      </div>
    </details>
  );
}
