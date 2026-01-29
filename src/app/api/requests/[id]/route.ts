import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, adminNotes } = body;

        const reqId = parseInt(id);

        const updated = await prisma.request.update({
            where: { id: reqId },
            data: {
                status,
                adminNotes
            },
        });

        // Send email notification for status changes
        if (status === "ACCEPTED" || status === "REJECTED" || status === "WAITLISTED") {
            try {
                // We need to fetch the request again or use the updated return, 
                // but we need the customer email which might not be in the update return if we didn't select it?
                // actually update returns the whole object by default.

                // Import getEmailTemplate dynamically or at top (will add import)
                const { getEmailTemplate } = await import("@/lib/email-templates");
                const { sendEmail } = await import("@/lib/email");

                const html = getEmailTemplate(status as "ACCEPTED" | "REJECTED" | "WAITLISTED", {
                    customerName: updated.customerName,
                    productName: updated.productName,
                    message: adminNotes || undefined,
                });

                await sendEmail({
                    to: updated.customerEmail,
                    subject: `Request Update: ${updated.productName} - ${status}`,
                    html,
                });
            } catch (emailError) {
                console.error("Failed to send status update email:", emailError);
                // Don't fail the request if email fails, just log it
            }
        }

        return NextResponse.json({ success: true, request: updated });
    } catch (error) {
        console.error("Error updating request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const reqId = parseInt(id);
        const reqData = await prisma.request.findUnique({
            where: { id: reqId },
            include: { messages: true }
        });

        if (!reqData) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(reqData);
    } catch (error) {
        console.error("Error fetching request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
