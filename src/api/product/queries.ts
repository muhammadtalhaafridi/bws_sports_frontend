import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { cleanParams } from "../params";
import { getProduct, getProducts, type ProductListParams } from "./fetcher";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) => ["products", cleanParams(params)] as const,
  /** Product pages ("product") are kept apart from lists ("products"). */
  details: ["product"] as const,
  detail: (id: number | string) => ["product", String(id)] as const,
};

/** A page of products. The previous page stays on screen while the next one loads. */
export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  });
}

/** One product with related products. A missing product (404) is not retried. */
export function useProduct(id: number | string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: () => getProduct(id!),
    enabled: Boolean(id),
    retry: (count, err) => !(err instanceof AxiosError && err.response?.status === 404) && count < 2,
  });
}
