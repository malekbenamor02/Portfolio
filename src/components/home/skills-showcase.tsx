"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { skillsData } from "@/data/skills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TiltCard, MagneticButton } from "@/components/animations";

export function SkillsShowcase() {
  // Get first 2 categories (Programming Languages and Frontend Development) for homepage display
  const showcaseSkills = skillsData.slice(0, 2);

  const categoryDescriptions: Record<string, string> = {
    "Programming Languages": "Proficient in multiple paradigms including OOP, functional, and procedural programming",
    "Frontend Development": "Creating responsive, interactive, and performant user interfaces with modern frameworks"
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Proficient in modern web technologies and programming languages
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 mb-12 max-w-5xl mx-auto">
          {showcaseSkills.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <TiltCard className="h-full">
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-3xl mr-3">{category.icon}</span>
                      <CardTitle className="text-lg sm:text-xl">{category.title}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {categoryDescriptions[category.title]}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: categoryIndex * 0.1 + skillIndex * 0.05,
                            ease: "easeOut"
                          }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-3 py-1.5 bg-muted/50 hover:bg-muted transition-colors duration-200 border border-border/50 hover:border-primary/30"
                          >
                            {skill.icon && <span className="mr-1.5">{skill.icon}</span>}
                            {skill.name}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-6">
            Also proficient in backend development, cloud platforms, databases, and more
          </p>
          <MagneticButton>
            <Link href="/about#technical-skills">
              <Button variant="outline" size="lg" className="group">
                View All Skills
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}