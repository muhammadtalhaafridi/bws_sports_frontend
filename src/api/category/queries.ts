import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./fetcher";

export const categoryKeys = {
  all: ["categories"] as const,
};

/** All categories with their image and product count. */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
}
