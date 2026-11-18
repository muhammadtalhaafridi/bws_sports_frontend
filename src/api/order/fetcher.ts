import { api } from "../../lib/api";
import type { Order } from "../../lib/types";

export interface CreateOrderInput {
  phone: string;
  address: string;
  description?: string;
  paymentMethod: "COD" | "CARD";
  items: { productId: number; quantity: number }[];
}

/** For card orders the response has checkoutUrl: the Stripe page to send the customer to. */
export async function createOrder(input: CreateOrderInput) {
  return (await api.post<{ order: Order; checkoutUrl?: string }>("/orders", input)).data;
}

export async function confirmPayment(id: number | string) {
  return (await api.post<{ order: Order }>(`/orders/${id}/confirm-payment`)).data.order;
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
