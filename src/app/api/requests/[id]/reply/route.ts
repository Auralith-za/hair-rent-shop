import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { content, subject } = body; // content is the message body

        const reqId = parseInt(id);

        // Fetch original request to get email
        const originalRequest = await prisma.request.findUnique({
            where: { id: reqId },
        });

        if (!originalRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // Send Email
        // Generate HTML content
        const { getEmailTemplate } = await import("@/lib/email-templates");
        const html = getEmailTemplate('REPLY', {
            customerName: originalRequest.customerName,
            productName: originalRequest.productName,
            message: content,
        });

        // Send Email
        await sendEmail({
            to: originalRequest.customerEmail,
            subject: subject || `Re: Purchase Request for ${originalRequest.productName}`,
            // text: content, // Fallback text?
            html,
        });

        // Save Message to DB
        const message = await prisma.message.create({
            data: {
                requestId: reqId,
                content,
                sender: "ADMIN",
            },
        });

        // Optionally update status to REPLIED (if we had that status) or keep current
        // For now, let's strictly stick to schema statuses

        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error("Error sending reply:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
