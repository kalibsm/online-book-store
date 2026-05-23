"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authApi, User, AuthResponse } from "./api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    password2: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "username" | "phone" | "address" | "avatar">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const stored = localStorage.getItem("auth_token");
      if (!stored) {
        setIsLoading(false);
        return;
      }
      setToken(stored);
      try {
        const profile = await authApi.getProfile(stored);
        setUser(profile);
      } catch {
        localStorage.removeItem("auth_token");
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  function applyAuth(res: AuthResponse) {
    localStorage.setItem("auth_token", res.token);
    setToken(res.token);
    setUser(res.user);
  }

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    applyAuth(res);
  }

  async function register(data: {
    email: string;
    username: string;
    password: string;
    password2: string;
    phone?: string;
    address?: string;
  }) {
    const res = await authApi.register(data);
    applyAuth(res);
  }

  function logout() {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  }

  async function updateProfile(data: Partial<Pick<User, "username" | "phone" | "address" | "avatar">>) {
    if (!token) throw new Error("Not authenticated");
    const updated = await authApi.updateProfile(token, data);
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
