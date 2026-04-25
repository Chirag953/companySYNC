import type { Notification } from "@/lib/types";

const userIds = [
  "user-admin-1",
  "user-mgr-1",
  "user-emp-1",
  "user-emp-2",
  "user-emp-3",
];

export const mockNotifications: Notification[] = userIds.flatMap((userId, ui) =>
  Array.from({ length: 5 }).map((_, j) => ({
    id: `notif-${userId}-${j}`,
    userId,
    type: (["task", "leave", "attendance", "document", "general"] as const)[
      (ui + j) % 5
    ],
    title:
      j === 0
        ? "New task assigned"
        : j === 1
          ? "Leave request update"
          : j === 2
            ? "Check-in reminder"
            : j === 3
              ? "Document expiring soon"
              : "Company announcement",
    body: "This is a mock notification for Phase 1 UI.",
    isRead: (ui + j) % 3 === 0,
    createdAt: `2026-04-${String((j + ui + 1) % 28 + 1).padStart(2, "0")}T10:00:00.000Z`,
  })),
);
