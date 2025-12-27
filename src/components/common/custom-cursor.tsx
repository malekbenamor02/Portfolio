"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over interactive elements
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.role === "button" ||
        target.classList.contains("magnetic-button")
      ) {
        setIsHovering(true);
        setCursorVariant("button");
      } else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setIsHovering(true);
        setCursorVariant("text");
      } else {
        setIsHovering(false);
        setCursorVariant("default");
      }
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Hide default cursor
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const cursorVariants = {
    default: {
      scale: 1,
      backgroundColor: "rgb(139, 92, 246)",
      mixBlendMode: "difference" as const,
    },
    button: {
      scale: 1.5,
      backgroundColor: "rgb(6, 182, 212)",
      mixBlendMode: "difference" as const,
    },
    text: {
      scale: 0.8,
      backgroundColor: "rgb(34, 197, 94)",
      mixBlendMode: "difference" as const,
    },
  };

  return (
    <motion.div
      className="custom-cursor"
      variants={cursorVariants}
      animate={cursorVariant}
      initial="default"
      transition={{
        duration: 0.15,
        ease: "easeOut",
      }}
      whileHover={{
        scale: isClicking ? 0.8 : isHovering ? 1.8 : 1.2,
      }}
      style={{
        position: "fixed",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        left: cursorXSpring,
        top: cursorYSpring,
      }}
    />
  );
}
