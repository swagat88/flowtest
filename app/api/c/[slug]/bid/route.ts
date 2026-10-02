import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { bidQueue } from "@/lib/queue";

export const dynamic = "force-dynamic";

const bidSchema = z.object({
  amount: z.number().positive(),
  listingId: z.string(),
  userEmail: z.string().email().optional(),
  userName: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const parsed = bidSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const listing = await prisma.listing.findFirst({
      where: {
        slug: params.slug,
        status: "APPROVED",
        season: { status: "ACTIVE" },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found or not active" }, { status: 404 });
    }

    const bid = await prisma.bid.create({
      data: {
        listingId: listing.id,
        amount: parsed.data.amount,
        userId: parsed.data.userEmail ?? "anonymous",
        userEmail: parsed.data.userEmail,
        userName: parsed.data.userName,
        status: "PENDING",
      },
    });

    await bidQueue.add("process-bid", {
      bidId: bid.id,
      listingId: listing.id,
      amount: parsed.data.amount,
    });

    return NextResponse.json({ bidId: bid.id, status: "PENDING" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

</content>