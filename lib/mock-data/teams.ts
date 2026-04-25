import type { Team } from "@/lib/types";

export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Platform Squad",
    departmentId: "dept-eng",
    managerId: "user-mgr-1",
    memberIds: [
      "user-emp-1",
      "user-emp-2",
      "user-emp-5",
      "user-mgr-1",
    ],
  },
  {
    id: "team-2",
    name: "People Ops",
    departmentId: "dept-hr",
    managerId: "user-mgr-2",
    memberIds: ["user-emp-3", "user-mgr-2"],
  },
  {
    id: "team-3",
    name: "Enterprise Sales",
    departmentId: "dept-sales",
    managerId: "user-mgr-3",
    memberIds: ["user-emp-4", "user-emp-6", "user-mgr-3"],
  },
  {
    id: "team-4",
    name: "Mobile Guild",
    departmentId: "dept-eng",
    managerId: "user-mgr-4",
    memberIds: ["user-emp-1", "user-emp-2", "user-mgr-4"],
  },
];
