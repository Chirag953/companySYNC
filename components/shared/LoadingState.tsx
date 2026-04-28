import { cn } from "@/lib/utils";

type LoadingStateProps = {
  message: string;
  description?: string;
  className?: string;
};

export function LoadingState({ message, description, className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex min-h-[40vh] items-center justify-center p-4", className)}
    >
      <div className="panel-glass max-w-sm rounded-xl p-5 text-center">
        <div className="mx-auto mb-3 size-8 animate-pulse rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
        <p className="font-medium text-foreground">{message}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}
