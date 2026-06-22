"use client";

import { motion } from "framer-motion";

export default function AilecoHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="text-white text-sm font-extralight tracking-[0.3em] uppercase opacity-50"
    >
      aileco.
    </motion.div>
  );
}
