"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";

export interface CartItem extends Product {
    quantity: number; // Placeholder if we need qty
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product) => {
        setItems((prev) => {
            // Check if exists
            const exists = prev.find((p) => p.id === product.id);
            if (exists) {
                return prev; // No duplicates for rental model
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Auto-open cart when item added
    };

    const removeFromCart = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setItems([]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const getCartTotal = () => {
        return items.reduce((total, item) => {
            const price = parseFloat(item.regular_price || item.price || "0");
            return total + price * item.quantity;
        }, 0);
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
