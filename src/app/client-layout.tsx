"use client";

import { FloatingSocials } from "@/components/common/floating-socials";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { SiteIntro } from "@/components/common/site-intro";
import { useRouteChange } from "@/hooks/use-route-change";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Handle route changes
  useRouteChange();
  
  return (
    <>
      <SiteIntro />
      {children}
      <FloatingSocials />
      <ScrollToTop />
    </>
  );
}