"use client";

import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";

export default function DashboardPage() {
  const { role } = useAuth();

  const description =
    role === "admin"
      ? "Company overview, KPIs, and quick actions."
      : role === "manager"
        ? "Team snapshot and pending approvals."
        : "Your work snapshot and shortcuts.";

  return (
    <>
      <PageHeader title="Dashboard" description={description} />
      {role === "admin" ? (
        <AdminDashboard />
      ) : role === "manager" ? (
        <ManagerDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </>
  );
}
