"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoadingState } from "@/components/shared/LoadingState";
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
  const allowed = useMemo(() => (Array.isArray(allow) ? allow : [allow]), [allow]);

  useEffect(() => {
    if (role && !allowed.includes(role)) {
      router.replace("/dashboard");
    }
  }, [role, router, allowed]);

  if (!role || !allowed.includes(role)) {
    return (
      <LoadingState
        message="Checking access…"
        description="We are verifying whether this page is available for your role."
      />
    );
  }

  return <>{children}</>;
}
