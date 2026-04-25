"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShiftForm, type ShiftFormValues } from "@/components/forms/ShiftForm";
import { mockShifts } from "@/lib/mock-data/shifts";
import { mockUsers } from "@/lib/mock-data/users";
import { useAuth } from "@/lib/auth-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RequireRole } from "@/components/role-gates";
import { toast } from "sonner";

export default function ShiftsPage() {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);

  if (role === "employee") {
    const shift = mockShifts[0];
    return (
      <>
        <PageHeader title="My shifts" description="Weekly schedule (mock)." />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{shift.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              {shift.startTime} – {shift.endTime}
            </p>
            <p className="mt-2">Days: {shift.days.join(", ")}</p>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div
                  key={d}
                  className={`rounded-md border py-3 ${shift.days.includes(d) ? "bg-primary/10 font-semibold" : "opacity-40"}`}
                >
                  {d}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <RequireRole allow="admin">
      <PageHeader
        title="Shifts"
        description="Define templates and assign employees."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={cn(buttonVariants(), "min-h-11")}>Create shift</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New shift template</DialogTitle>
              </DialogHeader>
              <ShiftForm
                onCancel={() => setOpen(false)}
                onSubmit={(v: ShiftFormValues) => {
                  toast.success(`Mock: saved shift “${v.name}”`);
                  setOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {mockShifts.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                {s.startTime} – {s.endTime}
              </p>
              <p>Days: {s.days.join(", ")}</p>
              <p>Assigned: {s.assignedUserIds.length}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assign shift</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
            {mockUsers.map((u) => (
              <label key={u.id} className="flex items-center gap-2 text-sm">
                <Checkbox />
                {u.firstName} {u.lastName}
              </label>
            ))}
          </div>
          <Label>Select shift template</Label>
          <Button className="min-h-11" onClick={() => toast.message("Mock: shift assigned")}>
            Assign
          </Button>
        </CardContent>
      </Card>
    </RequireRole>
  );
}
