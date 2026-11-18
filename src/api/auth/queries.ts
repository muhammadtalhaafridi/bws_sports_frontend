import { useQuery } from "@tanstack/react-query";
import { getMe } from "./fetcher";

export const authKeys = {
  all: ["me"] as const,
  me: (token: string | null) => ["me", token] as const,
};

/** The logged-in user for this token. Only runs when there is a token. */
export function useMe(token: string | null) {
  return useQuery({
    queryKey: authKeys.me(token),
    queryFn: getMe,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
