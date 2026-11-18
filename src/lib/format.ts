import { API_URL } from "./api";
import type { OrderStatus } from "./types";

const currency = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 2 });

export const formatPrice = (value: number) => `Rs ${currency.format(value)}`;

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const orderNumber = (id: number) => `BWS-${String(id).padStart(6, "0")}`;

export function imageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}

export const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

/** "Visa •••• 4242 (exp 12/34)" for card orders, otherwise the payment method name. */
export function paymentSummary(order: {
  paymentMethod: string;
  cardBrand: string | null;
  cardLast4: string | null;
  cardExpMonth: number | null;
  cardExpYear: number | null;
}) {
  if (!order.cardLast4) return order.paymentMethod;
  const brand = order.cardBrand ? order.cardBrand.charAt(0).toUpperCase() + order.cardBrand.slice(1) : "Card";
  const exp =
    order.cardExpMonth && order.cardExpYear
      ? ` (exp ${String(order.cardExpMonth).padStart(2, "0")}/${String(order.cardExpYear).slice(-2)})`
      : "";
  return `${brand} •••• ${order.cardLast4}${exp}`;
}
