import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendOrderApprovedEmail, sendPaymentConfirmedEmail } from "@/lib/email-templates";

const prisma = new PrismaClient();

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

        // If order is approved, send email with EFT details
        if (status === "APPROVED") {
            try {
                const items = JSON.parse(order.items);
                await sendOrderApprovedEmail({
                    customerEmail: order.customerEmail,
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    items,
                    total: order.total
                });
                return NextResponse.json({
                    success: true,
                    order: updatedOrder,
                    emailSent: true
                });
            } catch (emailError: any) {
                console.error("Failed to send approval email:", emailError);
                return NextResponse.json({
                    success: true,
                    order: updatedOrder,
                    emailSent: false,
                    emailError: emailError.message || "Unknown email error"
                });
            }
        }

        // If order is marked as PAID, send payment confirmation email
        if (status === "PAID") {
            try {
                const items = JSON.parse(order.items);
                await sendPaymentConfirmedEmail({
                    customerEmail: order.customerEmail,
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    items,
                    total: order.total
                });
            } catch (emailError) {
                console.error("Failed to send payment confirmation email:", emailError);
            }
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder
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
        console.log("API: Fetching order with ID:", id); // DEBUG

        const parsedId = parseInt(id);
        console.log("API: Parsed ID:", parsedId); // DEBUG

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
            console.log("API: Not found by ID, trying orderNumber:", id);
            order = await prisma.order.findUnique({
                where: { orderNumber: id },
                include: { messages: true }
            });
        }

        console.log("API: Order found:", order ? "Yes" : "No"); // DEBUG

        /*
        // Previously strict integer check
        if (isNaN(parsedId)) {
            console.error("API: Invalid ID format");
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }
        */

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ order });

        console.log("API: Order found:", order ? "Yes" : "No"); // DEBUG

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
