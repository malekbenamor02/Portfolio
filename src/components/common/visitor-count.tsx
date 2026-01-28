"use client";

import { useEffect, useState } from "react";

export function VisitorCount({ pollMs = 8000 }: { pollMs?: number }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/public/visitors", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { totalVisitors?: number };
        if (!cancelled && typeof data.totalVisitors === "number") {
          setCount(data.totalVisitors);
        }
      } catch {
        // ignore
      }
    };

    void fetchCount();
    const id = window.setInterval(fetchCount, pollMs);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [pollMs]);

  if (count === null) return null;

  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Visitors: <span className="font-medium text-foreground">{count.toLocaleString()}</span>
    </p>
  );
}

