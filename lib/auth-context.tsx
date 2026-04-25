"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Role, User } from "@/lib/types";
import { getUserByEmail, mockUsers } from "@/lib/mock-data/users";

const MOCK_PASSWORD = "password";

const DEMO_EMAILS: Record<string, Role> = {
  "admin@company.com": "admin",
  "manager@company.com": "manager",
  "employee@company.com": "employee",
};

type AuthState = {
  user: User | null;
};

type AuthAction =
  | { type: "LOGIN"; user: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; user: Partial<User> };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { user: action.user };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_PROFILE":
      if (!state.user) return state;
      return { user: { ...state.user, ...action.user } };
    default:
      return state;
  }
}

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  /** All users for admin pickers / mock lookups */
  users: User[];
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (password !== MOCK_PASSWORD) {
      return { ok: false as const, error: "Invalid email or password." };
    }
    const roleFromDemo = DEMO_EMAILS[normalized];
    const user =
      getUserByEmail(normalized) ??
      (roleFromDemo
        ? mockUsers.find((u) => u.role === roleFromDemo && u.email.toLowerCase() === normalized)
        : undefined);
    if (!user) {
      return { ok: false as const, error: "Invalid email or password." };
    }
    dispatch({ type: "LOGIN", user });
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  const updateProfile = useCallback((patch: Partial<User>) => {
    dispatch({ type: "UPDATE_PROFILE", user: patch });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      role: state.user?.role ?? null,
      login,
      logout,
      updateProfile,
      users: mockUsers,
    }),
    [state.user, login, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
