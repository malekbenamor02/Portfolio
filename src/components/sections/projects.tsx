"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { ANIMATION_VARIANTS } from "@/lib/constants";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LavenderBadge } from "@/components/ui/lavender-badge";

function ProjectTechStack({ technologies }: { technologies: string[] }) {
  const [showAllTech, setShowAllTech] = useState(false);
  const techToShow = showAllTech ? technologies : technologies.slice(0, 4);
  const hasMoreTech = technologies.length > 4;

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {techToShow.map((tech) => (
        <LavenderBadge key={tech}>
          {tech}
        </LavenderBadge>
      ))}
      {hasMoreTech && (
        <button
          onClick={() => setShowAllTech(!showAllTech)}
          className="inline-flex items-center"
        >
          <LavenderBadge 
            variant="outline" 
            className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
          >
            {showAllTech 
              ? "Show less" 
              : `+${technologies.length - 4} more`
            }
          </LavenderBadge>
        </button>
      )}
    </div>
  );
}

export function Projects() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={ANIMATION_VARIANTS.fadeUp}
          className="text-center mb-12 w-full"
        >
          <h2 className=" text-4xl md:text-5xl font-display font-bold mb-4">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Showcasing my innovative solutions from streaming platforms to AI chatbots,
           
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={ANIMATION_VARIANTS.fadeUp}
              transition={{ delay: index * 0.1 }}
              className="w-full max-w-md"
            >
              <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50">
                {/* Project Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        console.error(`Failed to load image: ${project.image}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-20">💻</span>
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 text-left">
                    {project.title}
                  </h3>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed text-left">
                    {project.description}
                  </p>
                  
                  {/* Key Features */}
                  <div className="space-y-1 mb-4">
                    {project.features.slice(0, 2).map((feature, i) => (
                      <p key={i} className="text-xs text-muted-foreground/80 flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span className="line-clamp-2">{feature}</span>
                      </p>
                    ))}
                  </div>
                  
                  {/* Technologies */}
                  <ProjectTechStack technologies={project.technologies} />
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-border/50">
                    {project.demoUrl && (
                      <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Deployed
                        </Button>
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
                        >
                          <Github className="h-4 w-4" />
                          Source Code
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}