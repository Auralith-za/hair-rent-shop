"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../admin.module.css";
import Link from "next/link";

interface Message {
    id: number;
    content: string;
    sender: string;
    createdAt: string;
}

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    notes: string;
    items: string;
    total: string;
    status: string;
    adminNotes: string;
    proofOfPayment: string | null;
    popUploadedAt: string | null;
    createdAt: string;
    messages?: Message[];
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [reply, setReply] = useState("");

    const templates = {
        accept: `Hi ${order?.customerName},\n\nGreat news! Your order request has been accepted.\nPlease complete payment via EFT and email us the proof of payment to sales@hair-rent.co.za\n\nRegards,\nHair Rentals`,
        reject: `Hi ${order?.customerName},\n\nThank you for your order request.\nUnfortunately, the items you selected are no longer available.\n\nRegards,\nHair Rentals`,
        waiting: `Hi ${order?.customerName},\n\nWe have received your request. We are currently checking availability and will get back to you shortly.\n\nRegards,\nHair Rentals`
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/orders/${id}`, {
                cache: 'no-store', // Prevent caching
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });
            const data = await response.json();
            setOrder(data.order);
            setAdminNotes(data.order.adminNotes || "");
        } catch (error) {
            console.error("Failed to fetch order:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (newStatus: string) => {
        console.log("updateOrderStatus called with:", newStatus); // DEBUG
        if (!order) {
            console.error("Order or ID missing in updateOrderStatus");
            return;
        }

        // Removed native confirm for debugging/better UX
        // const confirmed = confirm(...);
        // if (!confirmed) return;

        setUpdating(true);
        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus, adminNotes })
            });

            if (response.ok) {
                const data = await response.json();

                let message = `Order updated to ${newStatus}`;

                if (data.emailSent) {
                    message += " and email sent successfully to customer.";
                } else if (data.emailError) {
                    message += ` but email failed to send: ${data.emailError}`;
                } else {
                    message += ".";
                }

                alert(message);
                fetchOrder();
            } else {
                const errorData = await response.json();
                alert(`Failed to update order: ${errorData.error || "Unknown error"}\nDetails: ${errorData.details || "No details provided"}`);
            }
        } catch (error) {
            console.error("Failed to update order:", error);
            alert("Failed to update order");
        } finally {
            setUpdating(false);
        }
    };

    const sendReply = async () => {
        if (!reply.trim() || !order) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${order.id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: reply }),
            });
            if (res.ok) {
                const data = await res.json();
                // Optimistic update or refetch
                fetchOrder();
                setReply("");
                alert("Reply sent!");
            } else {
                alert("Failed to send reply");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to send reply");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Loading order...</h1>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.container}>
                <h1>Order not found</h1>
                <button onClick={() => router.push("/admin/orders")}>
                    Back to Orders
                </button>
            </div>
        );
    }

    let items: any[] = [];
    try {
        items = JSON.parse(order.items);
    } catch (e) {
        console.error("Failed to parse items:", e);
        items = [];
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link href="/admin/orders" className={styles.backLink}>
                        ← Back to Orders
                    </Link>
                    <h1>Order #{order.orderNumber}</h1>
                </div>
            </div>

            <div className={styles.orderDetail} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
                {/* Left Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <div className={styles.section}>
                        <h2>Order Info</h2>
                        <table className={styles.itemsTable} style={{ marginBottom: "1rem" }}>
                            <tbody>
                                <tr>
                                    <td><strong>Status:</strong></td>
                                    <td><span className={styles.statusBadge}>{order.status}</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Date:</strong></td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td><strong>Customer:</strong></td>
                                    <td>{order.customerName} ({order.customerEmail})</td>
                                </tr>
                                <tr>
                                    <td><strong>Phone:</strong></td>
                                    <td>{order.customerPhone}</td>
                                </tr>
                                <tr>
                                    <td><strong>Address:</strong></td>
                                    <td>{order.customerAddress}</td>
                                </tr>
                            </tbody>
                        </table>
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

                    {order.proofOfPayment && (
                        <div className={styles.section}>
                            <h2>Proof of Payment</h2>
                            <p className={styles.date}>
                                Uploaded: {new Date(order.popUploadedAt!).toLocaleString()}
                            </p>
                            <div style={{ marginTop: "15px" }}>
                                {order.proofOfPayment.endsWith('.pdf') ? (
                                    <a href={order.proofOfPayment} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>View PDF</a>
                                ) : (
                                    <a href={order.proofOfPayment} target="_blank" rel="noopener noreferrer">
                                        <Image
                                            src={order.proofOfPayment}
                                            alt="Proof of Payment"
                                            width={400}
                                            height={300}
                                            style={{ border: "1px solid #ddd", borderRadius: "4px" }}
                                        />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={styles.section}>
                        <h2>Conversation History</h2>
                        <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "1rem", minHeight: "200px", maxHeight: "400px", overflowY: "auto", marginBottom: "1rem" }}>
                            {(!order.messages || order.messages.length === 0) ? (
                                <p style={{ color: "#999", textAlign: "center", fontStyle: "italic" }}>No replies yet.</p>
                            ) : (
                                order.messages.map((msg) => (
                                    <div key={msg.id} style={{
                                        marginBottom: "1rem",
                                        padding: "0.8rem",
                                        borderRadius: "6px",
                                        background: msg.sender === "ADMIN" ? "#e3f2fd" : "#f5f5f5",
                                        marginLeft: msg.sender === "ADMIN" ? "2rem" : "0",
                                        marginRight: msg.sender === "ADMIN" ? "0" : "2rem"
                                    }}>
                                        <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                                            {msg.sender === "ADMIN" ? "You" : order.customerName} • {new Date(msg.createdAt).toLocaleString()}
                                        </div>
                                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>Load Template:</span>
                            <button onClick={() => setReply(templates.accept)} className={styles.viewButton} style={{ fontSize: "0.8rem", padding: "4px 8px" }}>Available</button>
                            <button onClick={() => setReply(templates.reject)} className={styles.viewButton} style={{ fontSize: "0.8rem", padding: "4px 8px", background: "#dc3545" }}>Sold</button>
                            <button onClick={() => setReply(templates.waiting)} className={styles.viewButton} style={{ fontSize: "0.8rem", padding: "4px 8px", background: "#ffc107", color: "black" }}>Waitlist</button>
                        </div>
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={5}
                            placeholder="Write your reply here..."
                            style={{ width: "100%", padding: "1rem", borderRadius: "6px", border: "1px solid #ddd", marginBottom: "1rem" }}
                        />
                        <button
                            onClick={sendReply}
                            disabled={updating || !reply.trim()}
                            className={styles.paidButton} // Use nice blue gradient
                            style={{ width: "auto" }}
                        >
                            {updating ? "Sending..." : "Send Reply"}
                        </button>
                    </div>

                </div>

                {/* Right Column: Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <div className={styles.section}>
                        <h2>Status Management</h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <button
                                onClick={() => updateOrderStatus("APPROVED")}
                                disabled={updating}
                                className={styles.approveButton}
                            >
                                Accept / Approve
                            </button>
                            <button
                                onClick={() => updateOrderStatus("WAITLISTED")}
                                disabled={updating}
                                className={styles.waitlistButton}
                            >
                                Add to Waitlist
                            </button>
                            <button
                                onClick={() => updateOrderStatus("REJECTED")}
                                disabled={updating}
                                className={styles.rejectButton}
                            >
                                Reject / Sold
                            </button>
                            <button
                                onClick={() => updateOrderStatus("PAID")}
                                disabled={updating}
                                className={styles.paidButton}
                            >
                                Mark as Paid
                            </button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Internal Admin Notes</h2>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add internal notes..."
                            rows={6}
                            className={styles.textarea}
                        />
                        <button
                            onClick={() => updateOrderStatus(order.status)}
                            disabled={updating}
                            className={styles.viewButton}
                            style={{ marginTop: "1rem", width: "100%" }}
                        >
                            Save Notes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
