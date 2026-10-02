import { CategoryBoard } from "@/components/category-board";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HubPage() {
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

  return (
    <main className="min-h-screen">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Best of Best India
          </h1>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono text-arena-live">LIVE</span>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Active Arenas</h2>
          <p className="mt-2 text-muted-foreground">
            Vote for the best. Back your favorites. Watch the leaderboard move in real-time.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryBoard
              key={category.id}
              category={category}
              season={category.seasons[0] ?? null}
            />
          ))}
        </div>

        {categories.length === 0 && (
          <div className="rounded-lg border border-border bg-surface-elevated p-12 text-center">
            <p className="text-muted-foreground">No active arenas yet. Check back soon.</p>
          </div>
        )}
      </section>
    </main>
  );
}
