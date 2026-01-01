"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ANIMATION_VARIANTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LazyStarsBackground } from "@/components/3d/lazy-stars";
import { 
  Typewriter, 
  GradientText,
  MagneticButton,
  FloatingParticles
} from "@/components/animations";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <LazyStarsBackground />
      
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-transparent to-teal/10" />
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={ANIMATION_VARIANTS.fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Greeting */}
          <motion.p
            variants={ANIMATION_VARIANTS.fadeDown}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-4"
          >
            Hello, I&apos;m
          </motion.p>
          {/* Name with gradient */}
          <motion.h1
            variants={ANIMATION_VARIANTS.scaleIn}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display text-3xl md:text-4xl lg:text-8xl font-bold mb-6 leading-tight"
            style={{ 
              background: "none",
              WebkitTextFillColor: "unset"
            }}
          >
            <GradientText className="font-display">
              Malek Ben Amor
            </GradientText>
          </motion.h1>

          {/* Tagline */}
          <motion.div
            variants={ANIMATION_VARIANTS.fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            <b>Junior Full Stack Developer</b> (Student & Open to Internships / Freelance)
            <span className="block mt-2">
              <Typewriter 
                words={[
                  "Junior Full Stack Developer",
                  "React & Next.js Developer",
                  "Node.js & Express Backend",
                  "Supabase & PostgreSQL",
                  "UI/UX Oriented Developer"
                ]}
                className="text-primary font-semibold"
              />
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={ANIMATION_VARIANTS.fadeUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <MagneticButton>
              <Button asChild size="lg" className="text-sm sm:text-base px-4 sm:px-8">
                <Link href="/projects">View Projects</Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild size="lg" variant="outline" className="text-sm sm:text-base px-4 sm:px-8 hover:bg-accent hover:text-gray-900 hover:border-accent transition-colors">
                <Link href="/contact">Contact Me</Link>
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
      