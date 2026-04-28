"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShiftForm, type ShiftFormValues } from "@/components/forms/ShiftForm";
import { mockShifts } from "@/lib/mock-data/shifts";
import { mockUsers } from "@/lib/mock-data/users";
import { mockDepartments } from "@/lib/mock-data/departments";
import { mockTeams } from "@/lib/mock-data/teams";
import { useAuth } from "@/lib/auth-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequireRole } from "@/components/role-gates";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ShiftsPage() {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState(mockShifts[0]?.id ?? "");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [search, setSearch] = useState("");

  const selectedShift = mockShifts.find((shift) => shift.id === selectedShiftId);
  const visibleTeams = mockTeams.filter((team) =>
    departmentFilter === "all" ? true : team.departmentId === departmentFilter,
  );
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const selectedTeam = teamFilter === "all" ? undefined : mockTeams.find((team) => team.id === teamFilter);

    return mockUsers.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const departmentMatches = departmentFilter === "all" || u.departmentId === departmentFilter;
      const teamMatches = !selectedTeam || selectedTeam.memberIds.includes(u.id);
      const queryMatches =
        !query ||
        fullName.includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.designation ?? "").toLowerCase().includes(query);

      return u.isActive && departmentMatches && teamMatches && queryMatches;
    });
  }, [departmentFilter, search, teamFilter]);

  const selectedDepartmentName =
    mockDepartments.find((department) => department.id === departmentFilter)?.name ?? "All departments";

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

  function toggleUser(userId: string, checked: boolean) {
    setSelectedUserIds((current) =>
      checked ? Array.from(new Set([...current, userId])) : current.filter((id) => id !== userId),
    );
  }

  function handleAssignShift() {
    if (!selectedShift) {
      toast.error("Select a saved shift first");
      return;
    }

    if (selectedUserIds.length === 0) {
      toast.error("Select at least one person");
      return;
    }

    toast.success(`Mock: assigned ${selectedShift.name} shift to ${selectedUserIds.length} people`);
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
          <Card
            key={s.id}
            role="button"
            tabIndex={0}
            aria-pressed={selectedShiftId === s.id}
            className={cn(
              "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg",
              selectedShiftId === s.id && "border-emerald-400/70 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 ring-2 ring-emerald-400/30",
            )}
            onClick={() => setSelectedShiftId(s.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedShiftId(s.id);
              }
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{s.name}</CardTitle>
                {selectedShiftId === s.id ? (
                  <span className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-2 py-0.5 text-xs font-semibold text-white">
                    Selected
                  </span>
                ) : null}
              </div>
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
          <p className="text-sm text-muted-foreground">
            {selectedShift
              ? `Assigning ${selectedShift.name} shift. Filter people by department, team, or search.`
              : "Select a saved shift template before assigning people."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.5fr]">
            <div className="space-y-2">
              <Label htmlFor="shift-department-filter">Department</Label>
              <Select
                value={departmentFilter}
                onValueChange={(value) => {
                  setDepartmentFilter(value ?? "all");
                  setTeamFilter("all");
                }}
              >
                <SelectTrigger id="shift-department-filter" className="min-h-11 w-full">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {mockDepartments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift-team-filter">Team</Label>
              <Select value={teamFilter} onValueChange={(value) => setTeamFilter(value ?? "all")}>
                <SelectTrigger id="shift-team-filter" className="min-h-11 w-full">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All teams</SelectItem>
                  {visibleTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift-person-search">Search</Label>
              <Input
                id="shift-person-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, or designation..."
                className="min-h-11"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Showing {filteredUsers.length} people in {selectedDepartmentName}
            </span>
            <span>{selectedUserIds.length} selected</span>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-card/40 p-3 shadow-sm backdrop-blur-xl">
            {filteredUsers.length ? (
              filteredUsers.map((u) => {
                const departmentName = mockDepartments.find((department) => department.id === u.departmentId)?.name ?? "No department";
                const teams = mockTeams.filter((team) => team.memberIds.includes(u.id));
                return (
                  <label
                    key={u.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-3 text-sm transition-colors hover:border-white/10 hover:bg-muted/40"
                  >
                    <Checkbox
                      checked={selectedUserIds.includes(u.id)}
                      onCheckedChange={(checked) => toggleUser(u.id, checked === true)}
                    />
                    <span className="min-w-0">
                      <span className="block font-medium text-foreground">
                        {u.firstName} {u.lastName}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {departmentName} · {teams.map((team) => team.name).join(", ") || "No team"} · {u.designation ?? "No designation"}
                      </span>
                    </span>
                  </label>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-8 text-center">
                <p className="font-medium text-foreground">No people match these filters</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different department, team, or search term.
                </p>
              </div>
            )}
          </div>
          <Button className="min-h-11" onClick={handleAssignShift} disabled={!selectedShift || selectedUserIds.length === 0}>
            Assign {selectedShift ? selectedShift.name : "shift"}
          </Button>
        </CardContent>
      </Card>
    </RequireRole>
  );
}
