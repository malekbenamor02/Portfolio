"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientText } from "@/components/animations";
import { LazyStarsBackground } from "@/components/3d/lazy-stars";

export function SiteIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if intro has been shown in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    
    if (!hasSeenIntro) {
      setIsVisible(true);
      sessionStorage.setItem("hasSeenIntro", "true");
      
      // Show content after a brief delay
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 300);

      // Hide intro after animation sequence
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Total duration: 3 seconds

      return () => {
        clearTimeout(contentTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
        >
          {/* Stars Background */}
          <div className="absolute inset-0">
            <LazyStarsBackground />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-transparent to-teal/10" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            {/* Main Name Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={showContent ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6"
            >
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <div className="block">
                  <GradientText className="font-display">
                    Malek
                  </GradientText>
                </div>
                <div className="block mt-2 md:mt-3 lg:mt-4">
                  <GradientText className="font-display">
                    Ben Amor
                  </GradientText>
                </div>
              </h1>
            </motion.div>

            {/* Tagline with typewriter effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="space-y-2"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-lg md:text-xl text-muted-foreground font-medium"
              >
                Building Real-World Web Platforms
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={showContent ? { width: "100%" } : {}}
                transition={{ duration: 0.6, delay: 1.2, ease: "easeInOut" }}
                className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto max-w-xs"
              />
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="mt-8 flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-2 w-2 rounded-full bg-primary"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
                className="h-2 w-2 rounded-full bg-primary"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
                className="h-2 w-2 rounded-full bg-primary"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

