"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FloatingSocials } from "@/components/common/floating-socials";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { SiteIntro } from "@/components/common/site-intro";
import { useRouteChange } from "@/hooks/use-route-change";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Handle route changes
  useRouteChange();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if intro was shown in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    
    if (hasSeenIntro) {
      // If intro was already shown, show content immediately
      setShowContent(true);
    } else {
      // If intro is showing, wait for it to start fading before showing content
      // This creates a smooth crossfade effect
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 2500); // Start fade-in at 2.5s (intro starts fading at 2.5s, finishes at 3.2s) - Trigger deployment
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <>
      <SiteIntro />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative"
      >
        {children}
        <FloatingSocials />
        <ScrollToTop />
      </motion.div>
    </>
  );
}