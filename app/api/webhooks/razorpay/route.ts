import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    if (!verifyWebhookSignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const eventType = payload.event as string;

    await prisma.webhookEvent.create({
      data: {
        provider: "razorpay",
        externalId: payload.payload?.payment?.entity?.id ?? `evt_${Date.now()}`,
        eventType,
        payload: payload as any,
      },
    });

    if (eventType === "payment.captured") {
      const paymentEntity = payload.payload?.payment?.entity;
      const bidId = paymentEntity?.notes?.bidId;

      if (bidId) {
        await prisma.bid.update({
          where: { id: bidId },
          data: {
            status: "CONFIRMED",
            paymentStatus: "CAPTURED",
          },
        });

        const bid = await prisma.bid.findUnique({ where: { id: bidId } });
        if (bid) {
          await prisma.listing.update({
            where: { id: bid.listingId },
            data: {
              totalBids: { increment: 1 },
              totalAmount: { increment: bid.amount as any },
            },
          });

          await prisma.ledger.create({
            data: {
              listingId: bid.listingId,
              eventType: "BID_CONFIRMED",
              eventData: { bidId: bid.id, amount: Number(bid.amount) } as any,
              amount: bid.amount,
              userId: bid.userId,
            },
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

</content>