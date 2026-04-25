import type { Holiday, LeaveBalance, LeaveRequest, LeaveType } from "@/lib/types";

export const mockLeaveTypes: LeaveType[] = [
  { id: "lt-sick", name: "Sick", daysAllowed: 10, isPaid: true },
  { id: "lt-casual", name: "Casual", daysAllowed: 12, isPaid: true },
  { id: "lt-paid", name: "Paid", daysAllowed: 18, isPaid: true },
  { id: "lt-unpaid", name: "Unpaid", daysAllowed: 5, isPaid: false },
];

export const mockLeaveBalances: LeaveBalance[] = mockLeaveTypes.flatMap((lt) =>
  ["user-emp-1", "user-emp-2", "user-emp-3", "user-emp-4"].map((userId) => ({
    userId,
    leaveTypeId: lt.id,
    allocated: lt.daysAllowed,
    used: userId === "user-emp-1" && lt.id === "lt-casual" ? 4 : lt.id === "lt-unpaid" ? 1 : 2,
  })),
);

const reqs: LeaveRequest[] = [
  {
    id: "lr-1",
    userId: "user-emp-1",
    leaveTypeId: "lt-casual",
    startDate: "2026-05-02",
    endDate: "2026-05-03",
    daysCount: 2,
    reason: "Family event",
    status: "pending",
    appliedAt: "2026-04-20T08:00:00.000Z",
  },
  {
    id: "lr-2",
    userId: "user-emp-2",
    leaveTypeId: "lt-sick",
    startDate: "2026-04-28",
    endDate: "2026-04-28",
    daysCount: 1,
    reason: "Flu",
    status: "pending",
    appliedAt: "2026-04-21T09:00:00.000Z",
  },
  {
    id: "lr-3",
    userId: "user-emp-4",
    leaveTypeId: "lt-paid",
    startDate: "2026-06-10",
    endDate: "2026-06-14",
    daysCount: 5,
    reason: "Vacation",
    status: "approved",
    reviewComment: "Enjoy!",
    appliedAt: "2026-04-10T10:00:00.000Z",
    reviewedAt: "2026-04-11T10:00:00.000Z",
    reviewedById: "user-mgr-3",
  },
  {
    id: "lr-4",
    userId: "user-emp-3",
    leaveTypeId: "lt-unpaid",
    startDate: "2026-05-20",
    endDate: "2026-05-22",
    daysCount: 3,
    status: "rejected",
    reviewComment: "Blackout dates — please reschedule.",
    appliedAt: "2026-04-05T11:00:00.000Z",
    reviewedAt: "2026-04-06T11:00:00.000Z",
    reviewedById: "user-mgr-2",
  },
  {
    id: "lr-5",
    userId: "user-emp-5",
    leaveTypeId: "lt-casual",
    startDate: "2026-04-15",
    endDate: "2026-04-16",
    daysCount: 2,
    status: "approved",
    appliedAt: "2026-04-01T12:00:00.000Z",
    reviewedAt: "2026-04-02T12:00:00.000Z",
    reviewedById: "user-mgr-1",
  },
];

for (let i = 6; i <= 18; i++) {
  reqs.push({
    id: `lr-${i}`,
    userId: i % 2 === 0 ? "user-emp-1" : "user-emp-2",
    leaveTypeId: i % 3 === 0 ? "lt-sick" : "lt-paid",
    startDate: `2026-07-${String((i % 27) + 1).padStart(2, "0")}`,
    endDate: `2026-07-${String((i % 27) + 2).padStart(2, "0")}`,
    daysCount: 2,
    reason: `Auto-generated request ${i}`,
    status: i % 4 === 0 ? "rejected" : i % 3 === 0 ? "pending" : "approved",
    appliedAt: `2026-04-${String((i % 28) + 1).padStart(2, "0")}T08:00:00.000Z`,
    reviewedAt:
      i % 3 === 0
        ? undefined
        : `2026-04-${String((i % 28) + 2).padStart(2, "0")}T09:00:00.000Z`,
    reviewedById: i % 3 === 0 ? undefined : "user-mgr-1",
  });
}

export const mockLeaveRequests: LeaveRequest[] = reqs;

export const mockHolidays: Holiday[] = [
  { id: "h-1", name: "New Year's Day", date: "2026-01-01" },
  { id: "h-2", name: "Independence Day", date: "2026-07-04" },
  { id: "h-3", name: "Thanksgiving", date: "2026-11-26" },
  { id: "h-4", name: "Winter Break", date: "2026-12-24" },
];
