"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitorCounter() {
  const pathname = usePathname();

  useEffect(() => {
    // Track visitor
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_path: pathname,
        referrer: document.referrer || undefined,
      }),
    }).catch(() => {
      // Silently fail - don't break user experience
    });
  }, [pathname]);

  return null;
}
