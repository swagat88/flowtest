import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const moderationSchema = z.object({
  targetType: z.enum(["listing", "bid"]),
  targetId: z.string(),
  action: z.enum(["APPROVE", "REJECT", "FLAG", "HIDE", "RESTORE"]),
  reason: z.string().optional(),
  reviewerId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = moderationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const review = await prisma.moderationReview.create({
      data: {
        listingId: parsed.data.targetType === "listing" ? parsed.data.targetId : null,
        bidId: parsed.data.targetType === "bid" ? parsed.data.targetId : null,
        action: parsed.data.action as any,
        reason: parsed.data.reason,
        reviewerId: parsed.data.reviewerId,
      },
    });

    if (parsed.data.targetType === "listing") {
      const status = parsed.data.action === "APPROVE" ? "APPROVED" : parsed.data.action === "REJECT" ? "REJECTED" : undefined;
      if (status) {
        await prisma.listing.update({
          where: { id: parsed.data.targetId },
          data: { status: status as any },
        });
      }
    }

    return NextResponse.json({ reviewId: review.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

</content>