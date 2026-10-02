interface ArenaCardProps {
  listing: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    totalBids: number;
    totalAmount: number | string;
  };
  rank: number;
}

function formatAmount(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function ArenaCard({ listing, rank }: ArenaCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-elevated p-4 transition-colors hover:bg-surface-overlay">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-overlay font-bold">
        {rank <= 3 ? (
          <span
            className={
              rank === 1
                ? "text-arena-gold"
                : rank === 2
                  ? "text-arena-silver"
                  : "text-arena-bronze"
            }
          >
            #{rank}
          </span>
        ) : (
          <span className="text-muted-foreground">#{rank}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-medium">{listing.name}</h4>
        {listing.description && (
          <p className="truncate text-sm text-muted-foreground">
            {listing.description}
          </p>
        )}
      </div>

      <div className="text-right">
        <div className="font-mono text-sm font-semibold text-brand-400">
          {formatAmount(listing.totalAmount)}
        </div>
        <div className="text-xs text-muted-foreground">
          {listing.totalBids} {listing.totalBids === 1 ? "bid" : "bids"}
        </div>
      </div>
    </div>
  );
}

</content>