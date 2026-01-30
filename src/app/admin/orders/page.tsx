"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: string;
    status: string;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders");
            const data = await response.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = filter === "all"
        ? orders
        : filter === "PRE-ORDER"
            ? orders.filter((order: any) => order.orderType === "PRE-ORDER")
            : orders.filter(order => {
                if (filter === "ACCEPTED") return order.status === "APPROVED" || order.status === "ACCEPTED";
                return order.status === filter;
            });

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "PENDING": return styles.statusPending;
            case "APPROVED": return styles.statusApproved;
            case "ACCEPTED": return styles.statusApproved;
            case "PAID": return styles.statusPaid;
            case "REJECTED": return styles.statusRejected;
            case "WAITLISTED": return styles.statusPending; // Reusing pending style or we can add new one
            default: return "";
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Orders</h1>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Orders</h1>
                <Link href="/admin" className={styles.backLink}>
                    ← Back to Dashboard
                </Link>
            </div>

            <div className={styles.filters}>
                <button
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? styles.activeFilter : ""}
                >
                    All ({orders.length})
                </button>
                <button
                    onClick={() => setFilter("PENDING")}
                    className={filter === "PENDING" ? styles.activeFilter : ""}
                >
                    Pending ({orders.filter(o => o.status === "PENDING").length})
                </button>
                <button
                    onClick={() => setFilter("APPROVED")}
                    className={filter === "APPROVED" ? styles.activeFilter : ""}
                >
                    Approved ({orders.filter(o => o.status === "APPROVED").length})
                </button>
                <button
                    onClick={() => setFilter("ACCEPTED")}
                    className={filter === "ACCEPTED" ? styles.activeFilter : ""}
                >
                    Accepted ({orders.filter(o => o.status === "APPROVED" || o.status === "ACCEPTED").length})
                </button>
                <button
                    onClick={() => setFilter("WAITLISTED")}
                    className={filter === "WAITLISTED" ? styles.activeFilter : ""}
                >
                    Waitlisted ({orders.filter(o => o.status === "WAITLISTED").length})
                </button>
                <button
                    onClick={() => setFilter("PRE-ORDER")}
                    className={filter === "PRE-ORDER" ? styles.activeFilter : ""}
                >
                    Pre-Orders ({orders.filter((o: any) => o.orderType === "PRE-ORDER").length})
                </button>
                <button
                    onClick={() => setFilter("PAID")}
                    className={filter === "PAID" ? styles.activeFilter : ""}
                >
                    Paid ({orders.filter(o => o.status === "PAID").length})
                </button>
            </div>

            {filteredOrders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.orderNumber}</td>
                                <td>{order.customerName}</td>
                                <td>{order.customerEmail}</td>
                                <td>R {parseFloat(order.total).toFixed(2)}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                    {/* POP Indicator - Manual check for proofOfPayment property if it exists in data */}
                                    {(order as any).proofOfPayment && (
                                        <span style={{
                                            marginLeft: "8px",
                                            fontSize: "10px",
                                            background: "#28a745",
                                            color: "white",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                            verticalAlign: "middle"
                                        }}>
                                            POP
                                        </span>
                                    )}
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Link href={`/admin/orders/${order.id}`} className={styles.viewButton}>
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
