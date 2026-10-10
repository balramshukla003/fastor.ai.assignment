import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = (product, quantity, size) => {
    const sizePrice = size?.price || 0;
    const cartKey = `${product.id}:${size?.id || "default"}`;
    setItems((current) => {
      const found = current.find((item) => item.cartKey === cartKey);
      if (found) return current.map((item) => item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { cartKey, productId: product.id, name: product.name, image: product.image, unitPrice: product.price + sizePrice, quantity, sizeLabel: size?.label || "Regular" }];
    });
  };
  const updateQuantity = (cartKey, quantity) => {
    setItems((current) => quantity <= 0
      ? current.filter((item) => item.cartKey !== cartKey)
      : current.map((item) => item.cartKey === cartKey ? { ...item, quantity: Math.min(20, quantity) } : item));
  };
  const removeItem = (cartKey) => setItems((current) => current.filter((item) => item.cartKey !== cartKey));
  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }), [items, totalItems, totalPrice]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}