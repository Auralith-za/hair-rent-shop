"use client";

import Link from "next/link";
import styles from "./Success.module.css";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <svg className={styles.checkIcon} viewBox="0 0 100 100">
                        <circle className={styles.checkCircle} cx="50" cy="50" r="40" />
                        <path className={styles.checkPath} d="M30 50 L45 65 L70 35" />
                    </svg>
                </div>

                <h1 className={styles.title}>Request Received!</h1>

                <p className={styles.message}>
                    Thank you for your purchase request.
                </p>

                <div className={styles.infoBox}>
                    <p>
                        We have received your request and will check availability for the selected items.
                    </p>
                    <p>
                        You will receive an email shortly with the status of your request and payment details if approved.
                    </p>
                </div>

                <Link href="/" className={styles.homeButton}>
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
