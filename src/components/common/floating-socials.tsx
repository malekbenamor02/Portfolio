"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function FloatingSocials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const socials = [
    {
      icon: <FileText className="h-5 w-5" />,
      href: "/Resume.pdf",
      label: "Resume",
      isDownload: true,
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: SITE_CONFIG.links.github,
      label: "GitHub",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: SITE_CONFIG.links.linkedin,
      label: "LinkedIn",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: `mailto:${SITE_CONFIG.links.email}`,
      label: "Email",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-50"
      >
        {socials.map((social, index) => {
          const isHovered = hoveredIndex === index;
          
          return (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.isDownload ? "_blank" : "_blank"}
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
              }}
              transition={{ 
                delay: 1.2 + index * 0.1,
                opacity: { duration: 0.3 },
                x: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-3 rounded-full bg-background border shadow-lg hover:shadow-xl transition-all overflow-hidden"
              style={{ 
                width: isHovered ? "140px" : "48px",
                transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease"
              }}
              aria-label={social.label}
            >
              <span className="flex items-center justify-center w-12 h-12 flex-shrink-0 text-foreground group-hover:text-primary transition-colors duration-300">
                {social.icon}
              </span>
              
              <span
                className="whitespace-nowrap text-sm font-medium pr-3 text-foreground group-hover:text-primary transition-colors duration-300"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transitionDelay: isHovered ? "0.1s" : "0s"
                }}
              >
                {social.label}
              </span>
            </motion.a>
          );
        })}
      </motion.div>
      
      {/* Decorative line - separate fixed element */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="fixed left-[30px] hidden lg:block z-50 w-px h-20 bg-border"
        style={{ 
          top: "calc(50% + 140px)",
          originY: 0 
        }}
      />
    </>
  );
}