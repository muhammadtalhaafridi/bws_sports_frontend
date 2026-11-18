import { api } from "../../lib/api";
import type { Pagination, Product } from "../../lib/types";
import { cleanParams } from "../params";

export interface ProductListParams {
  search?: string;
  category?: number | string;
  featured?: boolean;
  maxPrice?: number | string;
  sort?: "newest" | "price_asc" | "price_desc" | "name" | "popular";
  page?: number;
  limit?: number;
}

export interface ProductList {
  products: Product[];
  pagination: Pagination;
}

export interface ProductDetail {
  product: Product;
  related: Product[];
}

export async function getProducts(params: ProductListParams = {}) {
  return (await api.get<ProductList>("/products", { params: cleanParams(params) })).data;
}

export async function getProduct(id: number | string) {
  return (await api.get<ProductDetail>(`/products/${id}`)).data;
}
