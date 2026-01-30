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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/orders", {
                cache: 'no-store', // Prevent caching
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}: Failed to fetch orders`);
            }

            const data = await response.json();
            setOrders(data.orders || []);
        } catch (err: any) {
            console.error("Failed to fetch orders:", err);
            setError(err.message || "Failed to load orders. Please try refreshing.");
        } finally {
            setLoading(false);
        }
    };

    // ... (filter logic remains same)

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Orders</h1>
                <p>Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Orders</h1>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={fetchOrders} className={styles.viewButton}>
                            🔄 Retry
                        </button>
                        <Link href="/admin" className={styles.backLink}>
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
                <div style={{
                    padding: "20px",
                    backgroundColor: "#ffebee",
                    color: "#c62828",
                    borderRadius: "8px",
                    marginTop: "20px"
                }}>
                    <h3>Error loading orders</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Orders</h1>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={fetchOrders}
                        className={styles.viewButton}
                        disabled={loading}
                    >
                        {loading ? "Refreshing..." : "🔄 Refresh"}
                    </button>
                    <Link href="/admin" className={styles.backLink}>
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className={styles.filters}>
                {/* ... filters ... */}
            </div>

            {filteredOrders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className={styles.table}>
                    {/* ... table content ... */}
                </table>
            )}
        </div>
    );
}
