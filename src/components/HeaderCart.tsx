"use client";

import { useCart } from "@/context/CartContext";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";

export default function HeaderCart() {
    const { items, openCart } = useCart();
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const count = items.length;

    return (
        <button
            onClick={openCart}
            className={styles.cartIcon}
            aria-label="Open shopping cart"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {count > 0 && <span className={styles.cartCount}>{count}</span>}
        </button>
    );
}
