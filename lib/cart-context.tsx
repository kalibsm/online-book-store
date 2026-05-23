"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { cartApi, Cart } from "./api";
import { useAuth } from "./auth-context";

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (bookId: string, quantity?: number) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function syncCart() {
      if (!token) {
        setCart(null);
        return;
      }
      setIsLoading(true);
      try {
        const data = await cartApi.get(token);
        setCart(data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    syncCart();
  }, [token]);

  async function addToCart(bookId: string, quantity = 1) {
    if (!token) throw new Error("Must be logged in to add to cart");
    const updated = await cartApi.add(token, bookId, quantity);
    setCart(updated);
  }

  async function updateQuantity(bookId: string, quantity: number) {
    if (!token) throw new Error("Must be logged in");
    const updated = await cartApi.update(token, bookId, quantity);
    setCart(updated);
  }

  async function removeFromCart(bookId: string) {
    if (!token) throw new Error("Must be logged in");
    const updated = await cartApi.remove(token, bookId);
    setCart(updated);
  }

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
