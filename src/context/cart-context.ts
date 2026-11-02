import { createContext } from "react";
import type { Product } from "../lib/types";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  category: string;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  /** Returns the quantity actually added (limited by stock). */
  addItem: (product: Product, quantity?: number) => number;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
