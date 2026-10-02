"use client";

import { useEffect, useState } from "react";

interface LiveFeedItem {
  id: string;
  userName: string;
  listingName: string;
  amount: number;
  createdAt: string;
}

interface LiveFeedProps {
  channelName: string;
}

export function LiveFeed({ channelName }: LiveFeedProps) {
  const [items, setItems] = useState<LiveFeedItem[]>([]);

  useEffect(() => {
    const ablyKey = process.env.NEXT_PUBLIC_ABLY_KEY;
    if (!ablyKey) return;

    let realtime: any;
    let channel: any;

    async function init() {
      const Ably = await import("ably");
      realtime = new Ably.Realtime({ key: ablyKey });
      channel = realtime.channels.get(channelName);

      channel.subscribe("bid", (message: any) => {
        setItems((prev) => [message.data, ...prev].slice(0, 20));
      });
    }

    init();

    return () => {
      if (channel) channel.unsubscribe();
      if (realtime) realtime.close();
    };
  }, [channelName]);

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block h-2 w-2 rounded-full bg-arena-live animate-pulse" />
        <h3 className="text-sm font-semibold">Live Feed</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">Waiting for activity...</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="animate-slide-up text-xs">
            <span className="text-brand-400 font-medium">{item.userName}</span>
            {" bid "}
            <span className="text-arena-gold font-mono">₹{item.amount}</span>
            {" on "}
            <span className="text-white">{item.listingName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

</content>