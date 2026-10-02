import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getRazorpay } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

const createOrderSchema = z.object({
  bidId: z.string(),
  amount: z.number().positive(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const bid = await prisma.bid.findUnique({
      where: { id: parsed.data.bidId },
    });

    if (!bid || bid.status !== "PENDING") {
      return NextResponse.json({ error: "Bid not found or invalid" }, { status: 404 });
    }

    const razorpay = getRazorpay();
    const amountInPaise = Math.round(parsed.data.amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `bid_${bid.id}`,
      notes: {
        bidId: bid.id,
        listingSlug: params.slug,
      },
    });

    await prisma.bid.update({
      where: { id: bid.id },
      data: { paymentId: order.id },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

</content>