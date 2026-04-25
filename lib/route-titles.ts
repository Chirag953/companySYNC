const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/teams": "Teams",
  "/tasks": "Tasks",
  "/leave": "Leave",
  "/leave/requests": "Leave requests",
  "/attendance": "Attendance",
  "/shifts": "Shifts",
  "/performance": "Performance",
  "/documents": "Documents",
  "/documents/categories": "Document categories",
  "/notes": "Notes",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/login": "Sign in",
};

export function titleForPath(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/users/")) return "User profile";
  if (pathname.startsWith("/tasks/")) return "Task detail";
  return "companySYNC";
}

export function breadcrumbsForPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { href: string; label: string }[] = [];
  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    crumbs.push({
      href: acc,
      label: titles[acc] ?? seg.replace(/-/g, " "),
    });
  }
  return crumbs;
}
