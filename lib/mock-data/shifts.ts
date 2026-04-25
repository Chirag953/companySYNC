import type { Shift } from "@/lib/types";

export const mockShifts: Shift[] = [
  {
    id: "shift-morning",
    name: "Morning",
    startTime: "09:00",
    endTime: "17:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    assignedUserIds: ["user-emp-1", "user-emp-2", "user-mgr-1"],
  },
  {
    id: "shift-evening",
    name: "Evening",
    startTime: "14:00",
    endTime: "22:00",
    days: ["Mon", "Tue", "Wed", "Thu"],
    assignedUserIds: ["user-emp-4", "user-mgr-3"],
  },
  {
    id: "shift-night",
    name: "Night",
    startTime: "22:00",
    endTime: "06:00",
    days: ["Mon", "Wed", "Fri"],
    assignedUserIds: ["user-emp-5"],
  },
];
