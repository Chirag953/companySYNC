"use client";

import { createElement, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { iconForPath } from "@/lib/route-titles";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  /** Overrides path-based default icon from `iconForPath`. */
  icon?: LucideIcon;
  /** When false, hides the back control (default: true for all roles). */
  showBack?: boolean;
  /** When history is empty, navigate here (default: dashboard). */
  fallbackHref?: string;
};

const DEFAULT_FALLBACK = "/dashboard";

export function PageHeader({
  title,
  description,
  action,
  icon,
  showBack = true,
  fallbackHref = DEFAULT_FALLBACK,
}: PageHeaderProps) {
  "use no memo";

  const pathname = usePathname();
  const router = useRouter();
  const Icon = icon ?? iconForPath(pathname);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    if (fallbackHref) {
      router.push(fallbackHref);
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-start gap-3">
          {showBack ? (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="mt-0.5 shrink-0"
              aria-label="Go back"
              onClick={handleBack}
            >
              <ArrowLeft className="size-4" />
            </Button>
          ) : null}
          {Icon ? (
            <span
              className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 text-primary shadow-sm"
              aria-hidden
            >
              {createElement(Icon, { className: "size-6" })}
            </span>
          ) : null}
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold tracking-tight text-gradient">{title}</h1>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
