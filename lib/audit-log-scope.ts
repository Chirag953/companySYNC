import type { AuditLogEntry, User } from "@/lib/types";
import { mockTeams } from "@/lib/mock-data/teams";
import { getUserById } from "@/lib/mock-data/users";

const scopedRoles = new Set(["admin", "manager", "employee"] as const);

function userIdInScope(userId: string): boolean {
  const u = getUserById(userId);
  return u ? scopedRoles.has(u.role) : false;
}

/**
 * Manager’s team: self + employees listed on teams they manage.
 * Reused for other manager-scoped views (e.g. performance).
 */
export function managerVisibleUserIds(managerId: string): Set<string> {
  const ids = new Set<string>([managerId]);
  for (const team of mockTeams) {
    if (team.managerId !== managerId) continue;
    for (const memberId of team.memberIds) {
      const u = getUserById(memberId);
      if (u?.role === "employee") ids.add(memberId);
    }
  }
  return ids;
}

/**
 * Admin: activities involving any admin, manager, or employee (company-wide mock).
 * Manager: own + team employees (same managed teams as leave/attendance mocks).
 * Employee: rows where they are actor or subject.
 */
export function filterAuditLogsForCurrentUser(user: User, logs: AuditLogEntry[]): AuditLogEntry[] {
  if (user.role === "admin") {
    return logs.filter(
      (e) => userIdInScope(e.actorUserId) || userIdInScope(e.subjectUserId),
    );
  }

  if (user.role === "manager") {
    const allowed = managerVisibleUserIds(user.id);
    return logs.filter(
      (e) => allowed.has(e.actorUserId) || allowed.has(e.subjectUserId),
    );
  }

  return logs.filter((e) => e.actorUserId === user.id || e.subjectUserId === user.id);
}

export function auditLogActorLabel(userId: string): string {
  const u = getUserById(userId);
  return u ? `${u.firstName} ${u.lastName}` : userId;
}

export function auditLogSubjectLabel(userId: string): string {
  return auditLogActorLabel(userId);
}
