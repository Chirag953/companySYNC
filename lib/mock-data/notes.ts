import type { Note, Priority } from "@/lib/types";

const priorities: Priority[] = ["high", "medium", "low"];
const users = [
  "user-admin-1",
  "user-mgr-1",
  "user-emp-1",
  "user-emp-2",
  "user-emp-3",
];

export const mockNotes: Note[] = users.flatMap((userId, ui) =>
  [1, 2, 3].map((n) => ({
    id: `note-${userId}-${n}`,
    userId,
    title: `Note ${n} for ${userId}`,
    content: `Personal reminder ${n}. Follow up on tasks and calendar.`,
    priority: priorities[(ui + n) % priorities.length],
    createdAt: `2026-04-${String(n + ui).padStart(2, "0")}T08:00:00.000Z`,
    updatedAt: `2026-04-${String(n + ui).padStart(2, "0")}T09:00:00.000Z`,
  })),
);
