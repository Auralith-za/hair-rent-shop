"use client";

import { useCart } from "@/context/CartContext";
import styles from "./SideCart.module.css";
import Image from "next/image";
import Link from "next/link";

export default function SideCart() {
    const { items, removeFromCart, isCartOpen, closeCart, getCartTotal } = useCart();

    if (!isCartOpen) return null;

    const total = getCartTotal();

    return (
        <>
            {/* Overlay */}
            <div className={styles.overlay} onClick={closeCart} />

            {/* Drawer */}
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Shopping Cart</h2>
                    <button className={styles.closeButton} onClick={closeCart} aria-label="Close cart">
                        ×
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className={styles.emptyCart}>
                        <p>Your cart is empty</p>
                        <Link href="/" onClick={closeCart} className={styles.browseLink}>
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className={styles.items}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemImage}>
                                        <Image
                                            src={item.images && item.images.length > 0 ? item.images[0].src : "/images/placeholder.jpg"}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        {item.regular_price && (
                                            <p className={styles.itemPrice}>R {parseFloat(item.regular_price).toFixed(2)}</p>
                                        )}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className={styles.removeButton}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.footer}>
                            {total > 0 && (
                                <div className={styles.total}>
                                    <span>Subtotal:</span>
                                    <span className={styles.totalAmount}>R {total.toFixed(2)}</span>
                                </div>
                            )}
                            <div className={styles.actions}>
                                <Link href="/cart" onClick={closeCart} className={styles.viewCartButton}>
                                    View Cart
                                </Link>
                                <Link href="/checkout" onClick={closeCart} className={styles.checkoutButton}>
                                    Checkout
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
