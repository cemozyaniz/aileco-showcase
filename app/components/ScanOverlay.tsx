"use client";

import { motion } from "framer-motion";

interface ScanOverlayProps {
  isActive: boolean;
}

export default function ScanOverlay({ isActive }: ScanOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[5] pointer-events-none"
    >
      <div className="absolute inset-0 bg-black/80" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </motion.div>
  );
}
