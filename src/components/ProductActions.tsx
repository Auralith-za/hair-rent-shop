"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ product }: { product: Product }) {
    const { addToCart, items } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    const isInCart = items.some(item => item.id === product.id);

    const handleAddToCart = () => {
        if (!isInCart) {
            addToCart(product);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 2000);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isInCart}
            style={{
                width: "100%",
                padding: "18px",
                backgroundColor: isInCart ? "#999" : "#8B4513",
                color: "white",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: isInCart ? "not-allowed" : "pointer",
                borderRadius: "2px",
                transition: "background-color 0.3s",
                position: "relative"
            }}
        >
            {justAdded ? "✓ ADDED TO CART" : isInCart ? "IN CART" : "ADD TO CART"}
        </button>
    );
}
