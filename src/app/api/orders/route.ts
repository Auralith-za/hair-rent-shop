import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendOrderReceivedEmail, sendAdminOrderNotification, sendOrderApprovedEmail } from "@/lib/email-templates";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            notes,
            paymentMethod,
            items,
            total
        } = body;

        // Validate required fields
        if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate unique order number
        const orderNumber = `HR${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create order in database
        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerName,
                customerEmail,
                customerPhone,
                customerAddress,
                notes: notes || "",
                paymentMethod: paymentMethod || "EFT",
                items: JSON.stringify(items),
                total: total || "0",
                status: "PENDING"
            }
        });

        // Send confirmation email to customer (without EFT details - sent on approval)
        /* 
        try {
            await sendOrderReceivedEmail({
                customerEmail,
                customerName,
                orderNumber,
                items,
                total
            });
        } catch (emailError) {
            console.error("Failed to send customer email:", emailError);
        }
        */

        // Send notification to admin
        /*
        try {
            await sendAdminOrderNotification({
                orderNumber,
                customerName,
                customerEmail,
                customerPhone,
                items,
                total
            });
        } catch (emailError) {
            console.error("Failed to send admin email:", emailError);
        }
        */

        return NextResponse.json({
            success: true,
            orderNumber,
            orderId: order.id
        });

    } catch (error: any) {
        console.error("Order creation error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            {
                error: "Failed to create order",
                details: error.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const orderNumber = searchParams.get("orderNumber");

        let where: any = {};

        if (status) {
            where.status = status;
        }

        if (orderNumber) {
            where.orderNumber = orderNumber;
        }

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
