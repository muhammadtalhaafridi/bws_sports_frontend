import { api } from "../../lib/api";
import type { Order } from "../../lib/types";

export interface CreateOrderInput {
  phone: string;
  address: string;
  description?: string;
  items: { productId: number; quantity: number }[];
}

export async function createOrder(input: CreateOrderInput) {
  return (await api.post<{ order: Order }>("/orders", input)).data.order;
}

export async function getMyOrders() {
  return (await api.get<{ orders: Order[] }>("/orders/my")).data.orders;
}

export async function getOrder(id: number | string) {
  return (await api.get<{ order: Order }>(`/orders/${id}`)).data.order;
}

export async function cancelOrder(id: number | string) {
  return (await api.patch<{ order: Order }>(`/orders/${id}/cancel`)).data.order;
}
