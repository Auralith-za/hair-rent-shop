import { NextRequest, NextResponse } from "next/server";
import {
    sendOrderApprovedEmail,
    sendPaymentConfirmedEmail,
    sendOrderWaitlistedEmail,
    sendOrderRejectedEmail
} from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";

// Disable caching for this route to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const { id } = params;
        const body = await request.json();
        const { status, adminNotes } = body;

        // Get the order
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) }
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                status,
                adminNotes: adminNotes || order.adminNotes
            }
        });

        let emailSent = false;
        let emailError = null;

        try {
            const items = JSON.parse(order.items);

            // Handle email sending based on status
            if (status === "APPROVED") {
                await sendOrderApprovedEmail({
                    customerEmail: order.customerEmail,
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    items,
                    total: order.total
                });
                emailSent = true;
            } else if (status === "PAID") {
                await sendPaymentConfirmedEmail({
                    customerEmail: order.customerEmail,
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    items,
                    total: order.total
                });
                emailSent = true;
            } else if (status === "WAITLISTED") {
                await sendOrderWaitlistedEmail({
                    customerEmail: order.customerEmail,
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    items
                });
                emailSent = true;
            } else if (status === "REJECTED") {
                await sendOrderRejectedEmail({
                    customerEmail: order.customerEmail,
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    items
                });
                emailSent = true;
            }
        } catch (error: any) {
            console.error(`Failed to send email for status ${status}:`, error);
            emailError = error.message || "Unknown email error";
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder,
            emailSent,
            emailError
        });

    } catch (error: any) {
        console.error("Order update error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            {
                error: "Failed to update order",
                details: error.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const { id } = params;

        const parsedId = parseInt(id);
        let order = null;

        if (!isNaN(parsedId)) {
            // Try fetching by ID first
            order = await prisma.order.findUnique({
                where: { id: parsedId },
                include: { messages: true }
            });
        }

        // If not found by ID, try fetching by orderNumber
        if (!order) {
            order = await prisma.order.findUnique({
                where: { orderNumber: id },
                include: { messages: true }
            });
        }

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}
