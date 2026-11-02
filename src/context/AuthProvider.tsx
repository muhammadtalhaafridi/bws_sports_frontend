import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { api, TOKEN_KEY } from "../lib/api";
import type { User } from "../lib/types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const { data: user, isLoading } = useQuery({
    queryKey: ["me", token],
    queryFn: async () => (await api.get<{ user: User }>("/auth/me")).data.user,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    const onLogout = () => setToken(null);
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    queryClient.setQueryData(["me", newToken], newUser);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    queryClient.removeQueries({ queryKey: ["me"] });
    queryClient.removeQueries({ queryKey: ["orders"] });
  };

  const setUser = (updated: User) => queryClient.setQueryData(["me", token], updated);

  const current = token ? (user ?? null) : null;

  return (
    <AuthContext.Provider
      value={{
        user: current,
        isLoggedIn: Boolean(current),
        isLoading: Boolean(token) && isLoading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
