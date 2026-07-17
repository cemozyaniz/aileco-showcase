"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore token from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("aileco_forest_token");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.accessToken && parsed?.user) {
          setToken(parsed.accessToken);
          setUser(parsed.user);
        }
      }
    } catch {
      localStorage.removeItem("aileco_forest_token");
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.detail || "Login failed");
    }

    const data = await resp.json();
    const session = {
      accessToken: data.accessToken,
      user: data.user || { id: 0, name: email, email },
    };

    localStorage.setItem("aileco_forest_token", JSON.stringify(session));
    setToken(session.accessToken);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aileco_forest_token");
    localStorage.removeItem("forest_pending_reservation");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
