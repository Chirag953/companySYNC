import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(firstName: string, lastName: string) {
  const a = firstName?.charAt(0) ?? "";
  const b = lastName?.charAt(0) ?? "";
  return `${a}${b}`.toUpperCase() || "?";
}
