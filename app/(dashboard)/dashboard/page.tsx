"use client";

import { useAuth } from "@/lib/auth-context";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";

export default function DashboardPage() {
  const { role } = useAuth();

  if (role === "admin") return <AdminDashboard />;
  if (role === "manager") return <ManagerDashboard />;
  return <EmployeeDashboard />;
}
