"use client";

import { motion } from "framer-motion";
import { skillsData } from "@/data/skills";
import { ANIMATION_VARIANTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/animations";

const categoryDescriptions: Record<string, string> = {
  "Programming Languages": "Proficient in multiple paradigms including OOP, functional, and procedural programming",
  "Frontend Development": "Creating responsive, interactive, and performant user interfaces with modern frameworks",
  "Backend & Databases": "Building scalable server-side applications and managing both SQL and NoSQL databases"
};

export function Skills() {
  return (
    <section className="py-20 px-4 bg-muted/30" id="technical-skills">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={ANIMATION_VARIANTS.fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            A comprehensive toolkit spanning cloud computing, full-stack development,
            machine learning, and blockchain technologies. Continuously learning and adapting to new technologies.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {skillsData.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={ANIMATION_VARIANTS.fadeUp}
              transition={{ delay: categoryIndex * 0.1 }}
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

        {/* Additional Skills Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Also experienced with: Git, REST APIs, Agile/Scrum, Unit Testing and Technical Documentation
          </p>
        </motion.div>
      </div>
    </section>
  );
}