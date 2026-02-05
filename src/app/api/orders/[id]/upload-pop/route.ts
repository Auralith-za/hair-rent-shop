import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const { id } = params;
        const orderId = parseInt(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid order ID" },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and PDF files are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Get order
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Only allow upload for APPROVED orders
        if (order.status !== "APPROVED") {
            return NextResponse.json(
                { error: "Can only upload proof of payment for approved orders" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `pop_${order.orderNumber}_${timestamp}.${extension}`;

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", "pop");
        try {
            await import("fs/promises").then(fs => fs.mkdir(uploadDir, { recursive: true }));
        } catch (err) {
            console.error("Failed to create directory:", err);
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Update order
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                proofOfPayment: `/uploads/pop/${filename}`,
                popUploadedAt: new Date()
            }
        });

        // Send notification to admin
        try {
            const { sendPOPUploadedNotification } = await import("@/lib/email-templates");
            await sendPOPUploadedNotification({
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                popUrl: `/uploads/pop/${filename}`
            });
        } catch (emailError) {
            console.error("Failed to send POP notification email:", emailError);
        }

        return NextResponse.json({
            success: true,
            message: "Proof of payment uploaded successfully",
            order: updatedOrder
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to upload proof of payment" },
            { status: 500 }
        );
    }
}
