import type { Priority, Task, TaskStatus } from "@/lib/types";

const statuses: TaskStatus[] = ["todo", "in_progress", "completed"];
const priorities: Priority[] = ["high", "medium", "low"];

const titles = [
  "Ship onboarding checklist",
  "Fix login redirect bug",
  "Draft Q2 roadmap",
  "Review vendor contracts",
  "Update API documentation",
  "Migrate legacy reports",
  "Interview panel prep",
  "Customer escalation follow-up",
  "Design system audit",
  "Automate leave accrual",
  "Security patch rollout",
  "Performance tuning sprint",
  "Marketing site refresh",
  "Data cleanup script",
  "Mobile nav polish",
  "Accessibility fixes",
  "Shift swap approvals",
  "Holiday calendar import",
  "Payroll export validation",
  "Team retro notes",
  "Incident postmortem",
  "Budget variance review",
  "Partner integration spike",
  "Employee handbook update",
  "Office Wi-Fi upgrade",
];

const assignees = [
  "user-emp-1",
  "user-emp-2",
  "user-emp-3",
  "user-emp-4",
  "user-emp-5",
  "user-mgr-1",
  "user-mgr-4",
];

const creators = ["user-mgr-1", "user-mgr-2", "user-mgr-3", "user-mgr-4", "user-admin-1"];

function buildTasks(): Task[] {
  return titles.map((title, i) => {
    const status = statuses[i % statuses.length];
    const priority = priorities[i % priorities.length];
    const assigneeId = assignees[i % assignees.length];
    const createdById = creators[i % creators.length];
    const id = `task-${i + 1}`;
    const day = String((i % 28) + 1).padStart(2, "0");
    return {
      id,
      title,
      description: `Details for ${title.toLowerCase()}.`,
      priority,
      status,
      dueDate: `2026-05-${day}T12:00:00.000Z`,
      assigneeId,
      createdById,
      createdAt: `2026-04-${day}T09:00:00.000Z`,
      updatedAt: `2026-04-${day}T15:00:00.000Z`,
      subtasks: [
        { id: `${id}-s1`, title: "Clarify scope", isCompleted: i % 3 !== 0 },
        { id: `${id}-s2`, title: "Stakeholder sign-off", isCompleted: status === "completed" },
      ],
      comments: [
        {
          id: `${id}-c1`,
          userId: createdById,
          content: "Kicking this off — ping me with blockers.",
          createdAt: `2026-04-10T10:00:00.000Z`,
        },
      ],
      attachments: [
        {
          id: `${id}-a1`,
          fileName: `spec-${i + 1}.pdf`,
          uploadedById: createdById,
          createdAt: `2026-04-11T11:00:00.000Z`,
        },
      ],
      history: [
        {
          id: `${id}-h1`,
          fieldChanged: "status",
          oldValue: "todo",
          newValue: status,
          changedById: assigneeId,
          changedAt: `2026-04-12T12:00:00.000Z`,
        },
      ],
    };
  });
}

export const mockTasks: Task[] = buildTasks();

export function getTaskById(id: string) {
  return mockTasks.find((t) => t.id === id);
}
