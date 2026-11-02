export type Role = "CUSTOMER" | "ADMIN";
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  image: string | null;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  productCount?: number;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  size: string | null;
  weight: string | null;
  willow: string | null;
  image: string | null;
  stock: number;
  featured: boolean;
  createdAt: string;
  category: Category;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: { id: number; name: string; image: string | null; category: { name: string } };
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: OrderStatus;
  phone: string;
  address: string;
  description: string | null;
  paymentMethod: string;
  orderDate: string;
  user: { id: number; name: string; email: string; phone: string };
  items: OrderItem[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
