import { api } from "../../lib/api";
import type { Category } from "../../lib/types";

export async function getCategories() {
  return (await api.get<{ categories: Category[] }>("/categories")).data.categories;
}
