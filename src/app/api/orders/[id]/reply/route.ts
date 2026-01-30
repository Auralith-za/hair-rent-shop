import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { sendOrderReplyEmail } from "@/lib/email-templates";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const { id } = params;
        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json(
                { error: "Message content is required" },
                { status: 400 }
            );
        }

        // Verify order exists
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) }
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                content,
                sender: "ADMIN",
                orderId: parseInt(id)
            }
        });

        // Send email notification to customer
        try {
            await sendOrderReplyEmail({
                customerEmail: order.customerEmail,
                customerName: order.customerName,
                orderNumber: order.orderNumber,
                message: content
            });
            console.log("Reply email sent to:", order.customerEmail);
        } catch (emailError) {
            console.error("Failed to send reply email:", emailError);
            // We don't fail the request if email fails, but we log it
        }

        return NextResponse.json({
            success: true,
            message
        });

    } catch (error) {
        console.error("Failed to send reply:", error);
        return NextResponse.json(
            { error: "Failed to send reply" },
            { status: 500 }
        );
    }
}
