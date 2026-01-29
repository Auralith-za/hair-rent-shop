"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Message {
    id: number;
    content: string;
    sender: string;
    createdAt: string;
}

interface RequestData {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    message: string;
    productName: string;
    productSlug: string;
    productImage: string;
    status: string;
    messages: Message[];
}

export default function RequestDetailClient({ initialData }: { initialData: RequestData }) {
    const router = useRouter();
    const [request, setRequest] = useState(initialData);
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);

    const templates = {
        accept: `Hi ${request.customerName},

Great news! The ${request.productName} is available.
Please use the following link to complete your purchase: [LINK]

Regards,
Hair Rent Shop`,
        reject: `Hi ${request.customerName},

Thank you for your interest in ${request.productName}.
Unfortunately, this item has already been sold. Please check our other listings for similar items.

Regards,
Hair Rent Shop`,
        waiting: `Hi ${request.customerName},

We have received your request for ${request.productName}. We are currently checking availability and will get back to you shortly.

Regards,
Hair Rent Shop`
    };

    async function updateStatus(newStatus: string) {
        if (!confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/requests/${request.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                const data = await res.json();
                setRequest({ ...request, status: data.request.status });
                router.refresh();
            }
        } catch (e) {
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    }

    async function sendReply() {
        if (!reply.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/requests/${request.id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: reply }),
            });
            if (res.ok) {
                const data = await res.json();
                // Optimistically add message
                const newMsg = {
                    id: data.message.id,
                    content: data.message.content,
                    sender: "ADMIN",
                    createdAt: new Date().toISOString()
                };
                setRequest({
                    ...request,
                    messages: [...request.messages, newMsg]
                });
                setReply("");
                alert("Reply sent!");
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to send reply"}`);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to send reply (Network Error)");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
            {/* Left: Details & Chat */}
            <div>
                <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
                    <h2 style={{ marginTop: 0 }}>Customer Request</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                            <strong>Name:</strong> {request.customerName}
                        </div>
                        <div>
                            <strong>Email:</strong> {request.customerEmail}
                        </div>
                        <div>
                            <strong>Phone:</strong> {request.customerPhone || "N/A"}
                        </div>
                    </div>
                    <div style={{ background: "#fff", padding: "1rem", borderRadius: "4px", border: "1px solid #eee" }}>
                        <strong>Message:</strong>
                        <p style={{ margin: "0.5rem 0 0", color: "#555" }}>{request.message || "No message provided."}</p>
                    </div>
                </div>

                <div>
                    <h3>Conversation History</h3>
                    <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "1rem", minHeight: "200px", maxHeight: "400px", overflowY: "auto", marginBottom: "1rem" }}>
                        {request.messages.length === 0 ? (
                            <p style={{ color: "#999", textAlign: "center", fontStyle: "italic" }}>No replies yet.</p>
                        ) : (
                            request.messages.map((msg) => (
                                <div key={msg.id} style={{
                                    marginBottom: "1rem",
                                    padding: "0.8rem",
                                    borderRadius: "6px",
                                    background: msg.sender === "ADMIN" ? "#e3f2fd" : "#f5f5f5",
                                    marginLeft: msg.sender === "ADMIN" ? "2rem" : "0",
                                    marginRight: msg.sender === "ADMIN" ? "0" : "2rem"
                                }}>
                                    <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                                        {msg.sender === "ADMIN" ? "You" : request.customerName} • {new Date(msg.createdAt).toLocaleString()}
                                    </div>
                                    <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: "bold", marginRight: "1rem" }}>Load Template:</span>
                        <button onClick={() => setReply(templates.accept)} style={templateBtnStyle}>Available</button>
                        <button onClick={() => setReply(templates.reject)} style={templateBtnStyle}>Sold</button>
                        <button onClick={() => setReply(templates.waiting)} style={templateBtnStyle}>Waiting List</button>
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
                        disabled={loading || !reply.trim()}
                        style={{
                            padding: "10px 20px",
                            background: "#0070f3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Sending..." : "Send Reply"}
                    </button>
                </div>
            </div>

            {/* Right: Actions & Status */}
            <div>
                <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem" }}>
                    <h3 style={{ marginTop: 0 }}>Status Management</h3>
                    <div style={{
                        padding: "0.5rem",
                        borderRadius: "4px",
                        textAlign: "center",
                        marginBottom: "1.5rem",
                        fontWeight: "bold",
                        background: request.status === "PENDING" ? "#fff3cd" :
                            request.status === "ACCEPTED" ? "#d4edda" :
                                request.status === "REJECTED" ? "#f8d7da" :
                                    request.status === "WAITLISTED" ? "#fff3cd" : "#eee",
                        color: request.status === "PENDING" ? "#856404" :
                            request.status === "ACCEPTED" ? "#155724" :
                                request.status === "REJECTED" ? "#721c24" :
                                    request.status === "WAITLISTED" ? "#856404" : "#333"
                    }}>
                        Current: {request.status}
                    </div>

                    <button
                        onClick={() => updateStatus("ACCEPTED")}
                        disabled={loading}
                        style={{ ...actionBtnStyle, background: "#28a745", color: "white" }}
                    >
                        Accept Request
                    </button>
                    <button
                        onClick={() => updateStatus("WAITLISTED")}
                        disabled={loading}
                        style={{ ...actionBtnStyle, background: "#ffc107", color: "black" }}
                    >
                        Add to Waitlist
                    </button>
                    <button
                        onClick={() => updateStatus("REJECTED")}
                        disabled={loading}
                        style={{ ...actionBtnStyle, background: "#dc3545", color: "white" }}
                    >
                        Reject / Sold
                    </button>
                    <button
                        onClick={() => updateStatus("ARCHIVED")}
                        disabled={loading}
                        style={{ ...actionBtnStyle, background: "#6c757d", color: "white" }}
                    >
                        Archive
                    </button>

                    <hr style={{ margin: "2rem 0", borderTop: "1px solid #eee" }} />

                    <h3>Product Info</h3>
                    <div style={{ fontSize: "0.9rem" }}>
                        <p><strong>Product:</strong> {request.productName}</p>
                        <p><strong>Slug:</strong> {request.productSlug}</p>
                        <a href={`/product/${request.productSlug}`} target="_blank" style={{ color: "#0070f3", textDecoration: "underline" }}>View Product Page</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

const templateBtnStyle = {
    padding: "4px 8px",
    marginRight: "8px",
    background: "#eee",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "0.8rem",
    cursor: "pointer"
};

const actionBtnStyle = {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center" as const
};
