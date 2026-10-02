import prisma from "@/lib/db";
import { ArenaCard } from "@/components/arena-card";
import { BidModal } from "@/components/bid-modal";
import { LiveFeed } from "@/components/live-feed";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
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
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </main>
    );
  }

  const season = category.seasons[0];
  const listings = season?.listings ?? [];

  return (
    <main className="min-h-screen">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <a href="/" className="text-sm text-muted-foreground hover:text-white">
              &larr; All Arenas
            </a>
            <h1 className="mt-1 text-2xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            )}
          </div>
          {season && (
            <div className="text-right">
              <span className="rounded-full bg-arena-live/10 px-3 py-1 text-xs font-medium text-arena-live">
                Season {season.number}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Leaderboard</h2>
            <div className="space-y-3">
              {listings.map((listing, index) => (
                <ArenaCard
                  key={listing.id}
                  listing={{
                    ...listing,
                    totalAmount: Number(listing.totalAmount),
                  }}
                  rank={index + 1}
                />
              ))}
              {listings.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No listings yet in this arena.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <LiveFeed channelName={`category:${params.slug}`} />
          </div>
        </div>
      </div>
    </main>
  );
}

</content>