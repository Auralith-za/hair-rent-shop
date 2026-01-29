"use client";

import { useCart } from "@/context/CartContext";
import styles from "./Cart.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items, removeFromCart, getCartTotal } = useCart();
    const router = useRouter();

    const total = getCartTotal();

    if (items.length === 0) {
        return (
            <main className={styles.container}>
                <h1 className={styles.title}>Shopping Cart</h1>
                <div className={styles.emptyCart}>
                    <p>Your cart is empty.</p>
                    <Link href="/" style={{ textDecoration: "underline", color: "var(--color-primary)" }}>Browse Products</Link>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Shopping Cart</h1>

            <div className={styles.content}>
                {/* Items List */}
                <div className={styles.items}>
                    {items.map((item) => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.itemImageWrapper}>
                                <Image
                                    src={item.images && item.images.length > 0 ? item.images[0].src : "/images/placeholder.jpg"}
                                    alt={item.name}
                                    fill
                                    className={styles.image}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={styles.itemDetails}>
                                <h3 className={styles.itemTitle}>{item.name}</h3>
                                {item.short_description && (
                                    <p className={styles.itemDescription} dangerouslySetInnerHTML={{ __html: item.short_description }} />
                                )}
                                {item.regular_price && (
                                    <p className={styles.itemPrice}>R {parseFloat(item.regular_price).toFixed(2)}</p>
                                )}
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className={styles.summary}>
                    <h2 className={styles.summaryTitle}>Cart Summary</h2>
                    <div className={styles.summaryRow}>
                        <span>Items:</span>
                        <span>{items.length}</span>
                    </div>
                    {total > 0 && (
                        <>
                            <div className={styles.summaryRow}>
                                <span>Subtotal:</span>
                                <span>R {total.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryTotal}>
                                <span>Total:</span>
                                <span>R {total.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                    <button
                        onClick={() => router.push('/checkout')}
                        className={styles.checkoutBtn}
                    >
                        Proceed to Checkout
                    </button>
                    <Link href="/" className={styles.continueShoppingLink}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}
