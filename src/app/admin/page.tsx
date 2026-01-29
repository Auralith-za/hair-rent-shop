import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    redirect("/admin/orders");

    const { status } = await searchParams;
    const currentStatus = status || "ALL";

    const where = currentStatus === "ALL" ? {} : { status: currentStatus };

    const requests = await prisma.request.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    const counts = await prisma.request.groupBy({
        by: ['status'],
        _count: { status: true },
    });

    // Calculate totals for tabs
    const statusCounts = counts.reduce((acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
    }, {} as Record<string, number>);

    const totalCount = await prisma.request.count();

    const tabs = [
        { id: "ALL", label: "All", count: totalCount },
        { id: "PENDING", label: "Pending", count: statusCounts["PENDING"] || 0 },
        { id: "WAITLISTED", label: "Waitlist", count: statusCounts["WAITLISTED"] || 0 },
        { id: "ACCEPTED", label: "Accepted", count: statusCounts["ACCEPTED"] || 0 },
        { id: "REJECTED", label: "Rejected", count: statusCounts["REJECTED"] || 0 },
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Purchase Requests</h1>
                <Link
                    href="/admin/orders"
                    style={{
                        padding: "10px 20px",
                        background: "#8B4513",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontWeight: "600"
                    }}
                >
                    View Orders
                </Link>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                {tabs.map(tab => (
                    <Link
                        key={tab.id}
                        href={tab.id === "ALL" ? "/admin" : `/admin?status=${tab.id}`}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            background: currentStatus === tab.id ? "#333" : "#f5f5f5",
                            color: currentStatus === tab.id ? "#fff" : "#666",
                            transition: "all 0.2s"
                        }}
                    >
                        {tab.label} <span style={{ opacity: 0.7, fontSize: "0.8em", marginLeft: "4px" }}>({tab.count})</span>
                    </Link>
                ))}
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                    <thead>
                        <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #eee", textAlign: "left" }}>
                            <th style={{ padding: "1rem" }}>ID</th>
                            <th style={{ padding: "1rem" }}>Product</th>
                            <th style={{ padding: "1rem" }}>Customer</th>
                            <th style={{ padding: "1rem" }}>Date</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "1rem" }}>#{req.id}</td>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: "500" }}>{req.productName}</div>
                                    <div style={{ fontSize: "0.85rem", color: "#666" }}>slug: {req.productSlug}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div>{req.customerName}</div>
                                    <div style={{ fontSize: "0.85rem", color: "#666" }}>{req.customerEmail}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        background: req.status === "PENDING" ? "#fff3cd" :
                                            req.status === "ACCEPTED" ? "#d4edda" :
                                                req.status === "REJECTED" ? "#f8d7da" :
                                                    req.status === "WAITLISTED" ? "#fff3cd" : "#eee",
                                        color: req.status === "PENDING" ? "#856404" :
                                            req.status === "ACCEPTED" ? "#155724" :
                                                req.status === "REJECTED" ? "#721c24" :
                                                    req.status === "WAITLISTED" ? "#856404" : "#333"
                                    }}>
                                        {req.status}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <Link
                                        href={`/admin/requests/${req.id}`}
                                        style={{
                                            padding: "6px 12px",
                                            background: "#0070f3",
                                            color: "white",
                                            textDecoration: "none",
                                            borderRadius: "4px",
                                            fontSize: "0.9rem"
                                        }}
                                    >
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: "4rem", textAlign: "center", color: "#888" }}>
                                    <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No requests found</div>
                                    <div style={{ fontSize: "0.9rem" }}>Try changing the filter or waiting for new requests.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
