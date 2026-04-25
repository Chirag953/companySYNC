"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
    return <p className="text-sm text-muted-foreground">User not found.</p>;
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
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-2 text-sm">
          <p>Address: {user.address ?? "Not on file"}</p>
          <p>Status: {user.isActive ? "Active" : "Inactive"}</p>
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <ul className="list-inside list-disc text-sm">
            {docs.map((d) => (
              <li key={d.id}>
                {d.fileName} —{" "}
                {mockDocumentCategories.find((c) => c.id === d.categoryId)?.name ?? d.categoryId}
              </li>
            ))}
          </ul>
          <Button className="mt-4 min-h-11" variant="secondary" onClick={() => toast.message("Mock upload")}>
            Upload document
          </Button>
        </TabsContent>
        <TabsContent value="attendance" className="mt-4">
          <DataTable columns={attendanceCols} data={attendance} />
        </TabsContent>
        <TabsContent value="leave" className="mt-4 space-y-4">
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
          <DataTable columns={leaveCols} data={leaves} />
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <DataTable columns={taskCols} data={tasks} />
        </TabsContent>
      </Tabs>
    </RequireRole>
  );
}
