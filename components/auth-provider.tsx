"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

import type { User } from "@/app/data";

export type { User };

type AuthContextValue = {
  user: User | null;
  login: (user: User | null) => void;
  signOut: () => void;
};

const STORAGE_KEY = "av_user";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStored(user: User | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
  listeners.forEach((l) => l());
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const user = useMemo<User | null>(() => {
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }, [raw]);

  const login = useCallback((u: User | null) => setStored(u), []);
  const signOut = useCallback(() => setStored(null), []);
  const value = useMemo(() => ({ user, login, signOut }), [user, login, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
