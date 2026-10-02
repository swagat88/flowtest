import { prisma } from "@/lib/db";

interface CategoryBoardProps {
  category: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
  };
  season: {
    id: string;
    number: number;
    endDate: Date;
  } | null;
}

export function CategoryBoard({ category, season }: CategoryBoardProps) {
  return (
    <a
      href={`/c/${category.slug}`}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface-elevated p-6 transition-all hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold group-hover:text-brand-400">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>
        {season && (
          <span className="rounded-full bg-arena-live/10 px-2 py-0.5 text-xs font-medium text-arena-live">
            Season {season.number}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block h-2 w-2 rounded-full bg-arena-live animate-pulse" />
        Live
      </div>
    </a>
  );
}

</content>