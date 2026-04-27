import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-muted/40 md:flex-row">
      <div className="absolute right-3 top-3 z-20 md:right-4 md:top-4">
        <ThemeToggle className="bg-background/80 shadow-sm backdrop-blur-sm dark:bg-background/60" />
      </div>
      {children}
    </div>
  );
}
