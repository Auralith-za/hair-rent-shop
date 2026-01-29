"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./OrderTracking.module.css";

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: string;
    total: string;
    status: string;
    proofOfPayment: string | null;
    popUploadedAt: string | null;
    createdAt: string;
}

export default function OrderTrackingPage({ params }: { params: Promise<{ orderNumber: string }> }) {
    const { orderNumber } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrder();
    }, [orderNumber]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/orders?orderNumber=${orderNumber}`);
            const data = await response.json();

            if (data.orders && data.orders.length > 0) {
                setOrder(data.orders[0]);
            } else {
                setError("Order not found");
            }
        } catch (err) {
            console.error("Failed to fetch order:", err);
            setError("Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setUploadSuccess(false);

        const formData = new FormData(e.currentTarget);
        const file = formData.get("file") as File;

        if (!file) {
            setError("Please select a file");
            return;
        }

        setUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const response = await fetch(`/api/orders/${order?.id}/upload-pop`, {
                method: "POST",
                body: uploadFormData
            });

            const data = await response.json();

            if (response.ok) {
                setUploadSuccess(true);
                fetchOrder(); // Refresh order data
            } else {
                setError(data.error || "Upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Loading order...</h1>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className={styles.container}>
                <h1>Order Not Found</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!order) return null;

    const items = JSON.parse(order.items);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Order Tracking</h1>
                <p className={styles.orderNumber}>Order #{order.orderNumber}</p>
            </div>

            <div className={styles.statusSection}>
                <h2>Order Status</h2>
                <div className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>
                    {order.status}
                </div>
                <p className={styles.date}>
                    Ordered: {new Date(order.createdAt).toLocaleDateString()}
                </p>
            </div>

            <div className={styles.section}>
                <h2>Order Items</h2>
                <table className={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{item.productName}</td>
                                <td>R {parseFloat(item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr className={styles.totalRow}>
                            <td><strong>Total:</strong></td>
                            <td><strong>R {parseFloat(order.total).toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {order.status === "APPROVED" && (
                <div className={styles.paymentSection}>
                    <h2>Payment Details</h2>
                    <div className={styles.bankingDetails}>
                        <p><strong>Bank:</strong> FNB</p>
                        <p><strong>Account Name:</strong> HR-SMP</p>
                        <p><strong>Account Type:</strong> Cheque</p>
                        <p><strong>Account Number:</strong> 6301 3876 529</p>
                        <p><strong>Branch Code:</strong> 200 607</p>
                        <p><strong>Reference:</strong> {order.customerName}</p>
                    </div>

                    {!order.proofOfPayment ? (
                        <div className={styles.uploadSection}>
                            <h3>Upload Proof of Payment</h3>
                            <p>Please upload your proof of payment after making the EFT transfer.</p>

                            <form onSubmit={handleFileUpload} className={styles.uploadForm}>
                                <input
                                    type="file"
                                    name="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    required
                                    className={styles.fileInput}
                                />
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className={styles.uploadButton}
                                >
                                    {uploading ? "Uploading..." : "Upload Proof of Payment"}
                                </button>
                            </form>

                            {error && <p className={styles.error}>{error}</p>}
                            {uploadSuccess && (
                                <p className={styles.success}>
                                    ✓ Proof of payment uploaded successfully! We'll review it shortly.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className={styles.uploadedSection}>
                            <h3>✓ Proof of Payment Received</h3>
                            <p>Thank you! We received your proof of payment on {new Date(order.popUploadedAt!).toLocaleString()}.</p>
                            <p>We're reviewing your payment and will update your order status soon.</p>
                        </div>
                    )}
                </div>
            )}

            {order.status === "PAID" && (
                <div className={styles.paidSection}>
                    <h2>✓ Payment Confirmed</h2>
                    <p>Your payment has been confirmed! We're now processing your order.</p>
                </div>
            )}
        </div>
    );
}
