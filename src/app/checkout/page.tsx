"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Checkout.module.css";
import EFTModal from "@/components/EFTModal";

export default function CheckoutPage() {
    const { items, clearCart, getCartTotal } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("EFT");
    const [deliveryMethod, setDeliveryMethod] = useState("PICKUP"); // PICKUP or NATIONWIDE
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showEFTModal, setShowEFTModal] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");

    const cartTotal = getCartTotal();
    const deliveryCost = deliveryMethod === "NATIONWIDE" ? 150 : 0;
    const finalTotal = cartTotal + deliveryCost;

    // Redirect if cart is empty
    if (items.length === 0) {
        router.push("/cart");
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const confirmOrder = async () => {
        setShowConfirmation(false);
        setIsSubmitting(true);

        try {
            // Create order
            // Detect if cart contains pre-order items
            const hasPreOrderItems = items.some(item =>
                item.categories?.some((cat: any) => cat.slug === 'pre-order')
            );

            const orderData = {
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                customerAddress: formData.address,
                notes: formData.notes,
                paymentMethod,
                deliveryMethod,
                deliveryCost: deliveryCost.toString(),
                orderType: hasPreOrderItems ? 'PRE-ORDER' : 'REGULAR',
                items: items.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    productSlug: item.slug,
                    productImage: item.images[0]?.src || "",
                    price: item.regular_price || item.price || "0",
                    quantity: item.quantity
                })),
                total: finalTotal.toString()
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || errorData.error || "Failed to create order");
            }

            const data = await res.json();
            setOrderNumber(data.orderNumber);

            // Show EFT modal (Success)
            setShowEFTModal(true);

            // Clear cart after successful order
            clearCart();

            // Redirect after modal closes
            setTimeout(() => {
                router.push("/checkout/success");
            }, 3000);

        } catch (error: any) {
            console.error("Order submission error:", error);
            alert(`Failed to submit order: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Request Purchase</h1>

            <div className={styles.content}>
                {/* Order Summary */}
                <div className={styles.orderSummary}>
                    <h2 className={styles.sectionTitle}>Order Request Summary</h2>
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
                                </div>
                            </div>
                        ))}
                    </div>
                    {cartTotal > 0 && (
                        <div className={styles.totalSection}>
                            <div className={styles.totalRow}>
                                <span>Subtotal:</span>
                                <span>R {cartTotal.toFixed(2)}</span>
                            </div>

                            {/* Delivery Section */}
                            <div className={styles.deliverySection} style={{ margin: "15px 0", padding: "15px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}>
                                <p style={{ marginBottom: "10px", fontWeight: "bold" }}>Delivery Method:</p>

                                <label className={styles.radioLabel} style={{ display: "flex", alignItems: "center", marginBottom: "8px", cursor: "pointer" }}>
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value="PICKUP"
                                        checked={deliveryMethod === "PICKUP"}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        style={{ marginRight: "10px" }}
                                    />
                                    <span>Pick-up in Fourways (Free)</span>
                                </label>

                                <label className={styles.radioLabel} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value="NATIONWIDE"
                                        checked={deliveryMethod === "NATIONWIDE"}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        style={{ marginRight: "10px" }}
                                    />
                                    <span>Nationwide Delivery (R 150.00)</span>
                                </label>
                            </div>

                            <div className={styles.totalRow}>
                                <span>Delivery Cost:</span>
                                <span>R {deliveryCost.toFixed(2)}</span>
                            </div>

                            <div className={styles.totalRow} style={{ marginTop: "15px", fontSize: "1.2rem" }}>
                                <strong>Total:</strong>
                                <strong>R {finalTotal.toFixed(2)}</strong>
                            </div>
                        </div>
                    )}
                </div>

                {/* Checkout Form */}
                <div className={styles.checkoutForm}>
                    <h2 className={styles.sectionTitle}>Your Details</h2>
                    <form onSubmit={handleInitialSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className={styles.input}
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Delivery Address *</label>
                            <input
                                type="text"
                                name="address"
                                required
                                className={styles.input}
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Order Notes (Optional)</label>
                            <textarea
                                name="notes"
                                className={styles.textarea}
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Special requests, delivery instructions, etc."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Payment Method</label>
                            <div className={styles.paymentOptions}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="EFT"
                                        checked={paymentMethod === "EFT"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>EFT / Bank Transfer</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.submitBtn}
                        >
                            {isSubmitting ? "Processing..." : "Request Purchase"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className={styles.overlay} onClick={() => setShowConfirmation(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.title}>Confirm Purchase Request</h2>
                        <div className={styles.content}>
                            <p className={styles.message}>
                                Do you want to submit a request for this purchase?
                            </p>
                            <p className={styles.note}>
                                We will check if the items are still available and notify you shortly with payment details.
                            </p>
                            <div className={styles.actions}>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className={styles.secondaryButton}
                                    style={{
                                        padding: "12px 24px",
                                        background: "transparent",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        marginRight: "10px"
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmOrder}
                                    className={styles.submitBtn}
                                    style={{ width: "auto" }}
                                >
                                    Yes, Request Purchase
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEFTModal && (
                <EFTModal
                    orderNumber={orderNumber}
                    onClose={() => setShowEFTModal(false)}
                />
            )}
        </main>
    );
}
