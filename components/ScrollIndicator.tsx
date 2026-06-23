"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

interface ScrollIndicatorProps {
  fixed?: boolean;
}

export default function ScrollIndicator({ fixed = true }: ScrollIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setHidden(latest > 0.1);
  });

  if (!fixed || hidden) return null;

  return (
    <motion.button
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center cursor-pointer bg-transparent border-none p-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.6, behavior: "smooth" })}
    >
      <svg width="20" height="50" viewBox="0 0 20 50" fill="none" className="scroll-indicator-svg">
        <line x1="4" y1="0" x2="16" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="4" x2="10" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <motion.circle
          cx="10"
          cy="8"
          r="2"
          fill="#D4A853"
          initial={{ cy: 8 }}
          animate={{ cy: 42 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M5 40L10 46L15 40"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.button>
  );
}
