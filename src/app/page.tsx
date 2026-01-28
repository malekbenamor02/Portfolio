import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { SkillsShowcase } from "@/components/home/skills-showcase";
import { Testimonials } from "@/components/sections/testimonials";
import { ScrollProgress } from "@/components/common/enhanced-animations";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <FeaturedProjects />
      <SkillsShowcase />
      <Testimonials />
    </>
  );
}