"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/types";

export function RequireRole({
  allow,
  children,
}: {
  allow: Role | Role[];
  children: React.ReactNode;
}) {
  const { role } = useAuth();
  const router = useRouter();
  const allowed = Array.isArray(allow) ? allow : [allow];

  useEffect(() => {
    if (role && !allowed.includes(role)) {
      router.replace("/dashboard");
    }
  }, [role, router, allow]);

  if (!role || !allowed.includes(role)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  return <>{children}</>;
}
