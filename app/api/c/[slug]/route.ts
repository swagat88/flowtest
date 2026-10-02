import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cacheGet, cacheSet, categoryBoardKey } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const cacheKey = categoryBoardKey(slug);

    const cached = await cacheGet<{ category: any; listings: any[] }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        seasons: {
          where: { status: "ACTIVE" },
          take: 1,
          include: {
            listings: {
              where: { status: "APPROVED" },
              orderBy: { totalAmount: "desc" },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const listings = category.seasons[0]?.listings ?? [];
    const payload = { category, listings };
    await cacheSet(cacheKey, payload, 15);

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

</content>