import { prisma } from "@/lib/prisma";
import RequestDetailClient from "@/components/admin/RequestDetailClient";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const reqId = parseInt(id);

    if (isNaN(reqId)) return notFound();

    const request = await prisma.request.findUnique({
        where: { id: reqId },
        include: { messages: true },
    });

    if (!request) return notFound();

    // Serializing dates for Client Component
    const serializableRequest = {
        ...request,
        customerPhone: request.customerPhone || "",
        message: request.message || "",
        productImage: request.productImage || "",
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
        messages: request.messages.map(m => ({
            ...m,
            createdAt: m.createdAt.toISOString()
        }))
    };

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href="/admin" style={{ textDecoration: "none", color: "#666", display: "flex", alignItems: "center" }}>
                    &larr; Back to Dashboard
                </Link>
                <span style={{ color: "#ccc" }}>|</span>
                <h1 style={{ margin: 0 }}>Request #{request.id}</h1>
            </div>

            <RequestDetailClient initialData={serializableRequest} />
        </div>
    );
}
