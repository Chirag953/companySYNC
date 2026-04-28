"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { getUserById } from "@/lib/mock-data/users";
import { mockDepartments } from "@/lib/mock-data/departments";
import { mockAttendanceRecords } from "@/lib/mock-data/attendance";
import { mockLeaveRequests, mockLeaveTypes } from "@/lib/mock-data/leaves";
import { mockTasks } from "@/lib/mock-data/tasks";
import { mockDocuments, mockDocumentCategories } from "@/lib/mock-data/documents";
import type { AttendanceRecord, LeaveRequest, Task } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { segmentedTabsListClass, segmentedTabsTriggerClass } from "@/lib/segmented-tab-styles";

function ProfileEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-8 text-center">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const user = getUserById(params.id);
  const [editing, setEditing] = useState(false);

  const attendanceCols = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "checkIn", header: "Check-in" },
      { accessorKey: "checkOut", header: "Check-out" },
      { accessorKey: "status", header: "Status" },
    ],
    [],
  );

  const leaveCols = useMemo<ColumnDef<LeaveRequest>[]>(
    () => [
      { accessorKey: "startDate", header: "From" },
      { accessorKey: "endDate", header: "To" },
      { accessorKey: "daysCount", header: "Days" },
      { accessorKey: "status", header: "Status" },
    ],
    [],
  );

  const taskCols = useMemo<ColumnDef<Task>[]>(
    () => [
      { accessorKey: "title", header: "Task" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "dueDate", header: "Due" },
    ],
    [],
  );

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">User not found.</p>
        <Link
          href="/users"
          className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex items-center justify-center")}
        >
          Back to users
        </Link>
      </div>
    );
  }

  const dept = mockDepartments.find((d) => d.id === user.departmentId)?.name ?? "—";
  const attendance = mockAttendanceRecords.filter((a) => a.userId === user.id).slice(0, 20);
  const leaves = mockLeaveRequests.filter((l) => l.userId === user.id);
  const tasks = mockTasks.filter((t) => t.assigneeId === user.id);
  const docs = mockDocuments.filter((d) => d.ownerId === user.id);

  return (
    <RequireRole allow="admin">
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description="Employee profile (mock)."
        fallbackHref="/users"
        action={
          <Button variant="outline" className="min-h-11" onClick={() => setEditing((e) => !e)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
        }
      />
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <UserAvatar firstName={user.firstName} lastName={user.lastName} size="lg" />
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              {user.firstName} {user.lastName}
              <Badge className="capitalize">{user.role}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.phone ?? "—"}</p>
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form
              className="grid max-w-xl gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Mock: profile saved");
                setEditing(false);
              }}
            >
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" defaultValue={user.phone} className="min-h-11" />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input name="designation" defaultValue={user.designation} className="min-h-11" />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit" className="min-h-11">
                  Save
                </Button>
                <Button type="button" variant="outline" className="min-h-11" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Department:</span> {dept}
              </p>
              <p>
                <span className="text-muted-foreground">Designation:</span> {user.designation ?? "—"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className={segmentedTabsListClass}>
          <TabsTrigger value="overview" className={segmentedTabsTriggerClass}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="documents" className={segmentedTabsTriggerClass}>
            Documents
          </TabsTrigger>
          <TabsTrigger value="attendance" className={segmentedTabsTriggerClass}>
            Attendance
          </TabsTrigger>
          <TabsTrigger value="leave" className={segmentedTabsTriggerClass}>
            Leave
          </TabsTrigger>
          <TabsTrigger value="tasks" className={segmentedTabsTriggerClass}>
            Tasks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-3 text-sm">
          {user.address || user.isActive !== undefined ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-card/40 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Address</p>
                <p className="mt-2 font-medium">{user.address ?? "Not on file"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-card/40 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
                <p className="mt-2 font-medium">{user.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          ) : (
            <ProfileEmptyState
              title="No overview details"
              description="This profile does not have address or status information yet."
            />
          )}
        </TabsContent>
        <TabsContent value="documents" className="mt-6 space-y-4">
          {docs.length ? (
            <ul className="space-y-2 text-sm">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="rounded-xl border border-white/10 bg-card/40 px-4 py-3 shadow-sm backdrop-blur-xl"
                >
                  <p className="font-medium">{d.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {mockDocumentCategories.find((c) => c.id === d.categoryId)?.name ?? d.categoryId}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <ProfileEmptyState
              title="No documents uploaded"
              description="Upload a document to start building this employee's file."
            />
          )}
          <Button className="mt-4 min-h-11" variant="secondary" onClick={() => toast.message("Mock upload")}>
            Upload document
          </Button>
        </TabsContent>
        <TabsContent value="attendance" className="mt-6">
          <DataTable
            columns={attendanceCols}
            data={attendance}
            searchPlaceholder="Search attendance records…"
            emptyTitle="No attendance records"
            emptyDescription="This employee does not have attendance entries in the mock data yet."
          />
        </TabsContent>
        <TabsContent value="leave" className="mt-6 space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {mockLeaveTypes.map((lt) => (
              <Card key={lt.id}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{lt.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Policy days: {lt.daysAllowed}
                </CardContent>
              </Card>
            ))}
          </div>
          <DataTable
            columns={leaveCols}
            data={leaves}
            searchPlaceholder="Search leave records…"
            emptyTitle="No leave requests"
            emptyDescription="This employee has not submitted leave requests in the mock data."
          />
        </TabsContent>
        <TabsContent value="tasks" className="mt-6">
          <DataTable
            columns={taskCols}
            data={tasks}
            searchPlaceholder="Search assigned tasks…"
            emptyTitle="No assigned tasks"
            emptyDescription="There are no tasks assigned to this employee in the mock data."
          />
        </TabsContent>
      </Tabs>
    </RequireRole>
  );
}
