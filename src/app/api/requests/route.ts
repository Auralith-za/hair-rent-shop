import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, customerEmail, customerPhone, message, productId, productName, productSlug, productImage } = body;

        if (!customerName || !customerEmail || !productId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newRequest = await prisma.request.create({
            data: {
                customerName,
                customerEmail,
                customerPhone,
                message,
                productId: Number(productId),
                productName,
                productSlug,
                productImage,
            },
        });

        return NextResponse.json({ success: true, request: newRequest });
    } catch (error) {
        console.error("Error creating request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        // In a real app, check for Auth/Admin session here
        const requests = await prisma.request.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
