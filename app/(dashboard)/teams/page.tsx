"use client";

import { useState } from "react";
import { UsersRound } from "lucide-react";
import { RequireRole } from "@/components/role-gates";
import { PageHeader } from "@/components/shared/PageHeader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
  const teamDeptName = team ? mockDepartments.find((d) => d.id === team.departmentId)?.name ?? "—" : "";
  const teamManager = team ? getUserById(team.managerId) : undefined;

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
                <Button className="mt-2 min-h-11 w-full" onClick={() => setSelectedTeamId(t.id)}>
                  View details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Sheet open={!!team} onOpenChange={(o) => !o && setSelectedTeamId(null)}>
        <SheetContent className="flex h-[100dvh] max-h-[100dvh] w-full flex-col gap-0 border-l border-white/10 bg-popover/95 p-0 shadow-2xl backdrop-blur-xl data-[side=right]:sm:max-w-md dark:border-white/5 dark:bg-popover/95">
          {team ? (
            <>
              <div className="relative shrink-0 border-b border-white/10 bg-gradient-to-br from-emerald-500/[0.14] via-card/80 to-cyan-500/[0.14] px-6 pb-5 pt-14">
                <SheetHeader className="gap-3 space-y-0 p-0">
                  <div className="flex items-start gap-4">
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 text-primary shadow-sm"
                      aria-hidden
                    >
                      <UsersRound className="size-6" />
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <SheetTitle className="text-xl leading-tight">{team.name}</SheetTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="font-normal">
                          {teamDeptName}
                        </Badge>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {team.memberIds.length} member{team.memberIds.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <SheetDescription>
                        {teamManager
                          ? `Led by ${teamManager.firstName} ${teamManager.lastName}.`
                          : "No manager assigned in mock data."}
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Manager</p>
                    {teamManager ? (
                      <div className="mt-3 flex items-center gap-3">
                        <UserAvatar
                          firstName={teamManager.firstName}
                          lastName={teamManager.lastName}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold leading-tight">
                            {teamManager.firstName} {teamManager.lastName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{teamManager.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                  <div className="rounded-xl border border-white/10 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Tasks (mock)</p>
                    <p className="mt-3 text-2xl font-bold tabular-nums text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">Open / active this sprint</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold tracking-tight">Members</h3>
                    <span className="text-xs text-muted-foreground">{team.memberIds.length} total</span>
                  </div>
                  <Separator className="my-3" />
                  <ul className="space-y-2">
                    {team.memberIds.map((id) => {
                      const u = getUserById(id);
                      return (
                        <li
                          key={id}
                          className="flex items-center gap-3 rounded-lg border border-white/10 bg-card/40 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-card/60"
                        >
                          {u ? (
                            <UserAvatar firstName={u.firstName} lastName={u.lastName} size="sm" />
                          ) : (
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 text-xs text-muted-foreground">
                              ?
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium leading-tight">
                              {u ? `${u.firstName} ${u.lastName}` : id}
                            </p>
                            {u?.designation ? (
                              <p className="truncate text-xs text-muted-foreground">{u.designation}</p>
                            ) : null}
                          </div>
                          {u?.role ? (
                            <Badge variant="outline" className="shrink-0 capitalize">
                              {u.role}
                            </Badge>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <SheetFooter className="shrink-0 border-t border-white/10 bg-muted/30 p-4 backdrop-blur-sm dark:bg-muted/20">
                <Button className="min-h-11 w-full sm:w-auto" type="button" onClick={() => setSelectedTeamId(null)}>
                  Done
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </RequireRole>
  );
}
