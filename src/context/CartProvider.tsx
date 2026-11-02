import { useEffect, useState, type ReactNode } from "react";
import type { Product } from "../lib/types";
import { CartContext, type CartItem } from "./cart-context";

const CART_KEY = "bws_cart";

function loadCart(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

/** The cart lives in the browser so customers can shop before logging in. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(loadCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = (product: Product, quantity = 1) => {
    const inCart = items.find((i) => i.id === product.id)?.quantity ?? 0;
    const added = Math.max(0, Math.min(quantity, product.stock - inCart));
    if (added === 0) return 0;

    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + added, price: product.price, stock: product.stock } : i,
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          category: product.category.name,
          quantity: added,
        },
      ];
    });
    return added;
  };

  const updateQuantity = (id: number, quantity: number) =>
    setItems((current) =>
      current.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i)),
    );

  const removeItem = (id: number) => setItems((current) => current.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, updateQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}
