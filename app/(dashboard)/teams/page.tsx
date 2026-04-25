"use client";

import { useState } from "react";
import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { mockTeams } from "@/lib/mock-data/teams";
import { mockUsers } from "@/lib/mock-data/users";
import { mockDepartments } from "@/lib/mock-data/departments";
import { getUserById } from "@/lib/mock-data/users";
import { toast } from "sonner";

export default function TeamsPage() {
  const [open, setOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const team = mockTeams.find((t) => t.id === selectedTeamId);

  return (
    <RequireRole allow="admin">
      <PageHeader
        title="Teams"
        description="Create teams, assign managers, and members."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={cn(buttonVariants(), "min-h-11")}>Create team</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New team</DialogTitle>
              </DialogHeader>
              <form
                className="grid gap-4 pt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Mock: team created");
                  setOpen(false);
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team name</Label>
                  <Input id="team-name" className="min-h-11" required />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input defaultValue={mockDepartments[0]?.name} className="min-h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Manager</Label>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2">
                    {mockUsers
                      .filter((u) => u.role === "manager")
                      .map((u) => (
                        <label key={u.id} className="flex items-center gap-2 text-sm">
                          <Checkbox name="manager" value={u.id} />
                          {u.firstName} {u.lastName}
                        </label>
                      ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Members (multi-select)</Label>
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-2">
                    {mockUsers
                      .filter((u) => u.role === "employee")
                      .map((u) => (
                        <label key={u.id} className="flex items-center gap-2 text-sm">
                          <Checkbox name="member" value={u.id} />
                          {u.firstName} {u.lastName}
                        </label>
                      ))}
                  </div>
                </div>
                <Button type="submit" className="min-h-11">
                  Save team
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockTeams.map((t) => {
          const mgr = getUserById(t.managerId);
          const dept = mockDepartments.find((d) => d.id === t.departmentId)?.name ?? "—";
          return (
            <Card key={t.id} className="shadow-sm">
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
                <CardDescription>{dept}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Manager:</span>{" "}
                  {mgr ? `${mgr.firstName} ${mgr.lastName}` : "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Members:</span> {t.memberIds.length}
                </p>
                <Button variant="outline" className="mt-2 min-h-11 w-full" onClick={() => setSelectedTeamId(t.id)}>
                  View details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Sheet open={!!team} onOpenChange={(o) => !o && setSelectedTeamId(null)}>
        <SheetContent>
          {team ? (
            <>
              <SheetHeader>
                <SheetTitle>{team.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm">
                <p className="font-medium">Members</p>
                <ul className="list-disc pl-5">
                  {team.memberIds.map((id) => {
                    const u = getUserById(id);
                    return (
                      <li key={id}>
                        {u ? `${u.firstName} ${u.lastName}` : id}
                      </li>
                    );
                  })}
                </ul>
                <p className="text-muted-foreground">Task summary: mock aggregate.</p>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </RequireRole>
  );
}
