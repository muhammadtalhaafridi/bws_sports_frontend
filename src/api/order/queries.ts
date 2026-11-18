import { useQuery } from "@tanstack/react-query";
import { getMyOrders, getOrder } from "./fetcher";

export const orderKeys = {
  all: ["orders"] as const,
  mine: ["orders", "mine"] as const,
  detail: (id: number | string) => ["orders", String(id)] as const,
};

/** Orders of the logged-in customer. */
export function useMyOrders() {
  return useQuery({ queryKey: orderKeys.mine, queryFn: getMyOrders });
}

/** One order. Not retried, so "not found" and "not yours" show straight away. */
export function useOrder(id: number | string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: () => getOrder(id!),
    enabled: Boolean(id),
    retry: false,
  });
}
