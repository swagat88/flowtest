import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cacheGet, cacheSet, categoryBoardKey } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cached = await cacheGet<{ categories: any[] }>("hub:categories");
    if (cached) {
      return NextResponse.json(cached);
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        seasons: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    const payload = { categories };
    await cacheSet("hub:categories", payload, 30);

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

</content>