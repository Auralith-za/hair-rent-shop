"use client";

import { useState } from "react";
import styles from "./RequestModal.module.css";
import { Product } from "@/types/product";

interface RequestModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function RequestModal({ product, isOpen, onClose }: RequestModalProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            customerName: formData.get("name"),
            customerEmail: formData.get("email"),
            customerPhone: formData.get("phone"),
            message: formData.get("message"),
            productSlug: product.slug,
            productId: product.id,
            productName: product.name,
            productImage: product.images[0]?.src || ""
        };

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to submit request");

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>

                {success ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <h3 style={{ color: "green" }}>Request Sent!</h3>
                        <p>We will get back to you shortly.</p>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.title}>Request to Purchase</h2>
                        <p className={styles.productName}>{product.name}</p>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="name">Full Name</label>
                                <input required className={styles.input} name="name" id="name" type="text" placeholder="Jane Doe" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="email">Email Address</label>
                                <input required className={styles.input} name="email" id="email" type="email" placeholder="jane@example.com" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="phone">Phone Number</label>
                                <input required className={styles.input} name="phone" id="phone" type="tel" placeholder="+27 71 234 5678" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="message">Message (Optional)</label>
                                <textarea className={styles.textarea} name="message" id="message" rows={3} placeholder="I'm interested in this item..." />
                            </div>

                            {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

                            <button disabled={loading} className={styles.submitButton}>
                                {loading ? "Sending..." : "Send Request"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
