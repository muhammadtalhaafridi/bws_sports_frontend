import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Category } from "../lib/types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get<{ categories: Category[] }>("/categories")).data.categories,
    staleTime: 5 * 60 * 1000,
  });
}
