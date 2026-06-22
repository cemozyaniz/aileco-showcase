"use client";

import { motion } from "framer-motion";

interface ProductInfoProps {
  attachedName: string;
  uniqueCode: string;
  attachedToType: string | null;
  createdAt: string | null;
  isVisible: boolean;
}

const typeLabels: Record<string, string> = {
  product: "Product",
  luggage: "Luggage",
  vehicle: "Vehicle",
  human: "Personal",
  pet: "Pet",
};

export default function ProductInfo({
  attachedName,
  uniqueCode,
  attachedToType,
  createdAt,
  isVisible,
}: ProductInfoProps) {
  if (!isVisible) return null;

  const displayName = attachedName || "Unnamed";
  const typeLabel =
    attachedToType && typeLabels[attachedToType]
      ? typeLabels[attachedToType]
      : null;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="w-full backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 sm:p-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 leading-tight">
        {displayName}
      </h2>

      <div className="flex items-center gap-2 mb-3">
        <code className="text-xs text-zinc-500 font-mono">{uniqueCode}</code>
        <button
          className="text-zinc-600 hover:text-zinc-400 transition-colors"
          title="Copy code"
          onClick={() => {
            navigator.clipboard.writeText(uniqueCode).catch(() => {});
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {typeLabel && (
          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
            {typeLabel}
          </span>
        )}
        {formattedDate && (
          <span className="text-[11px] text-zinc-600">{formattedDate}</span>
        )}
      </div>
    </motion.div>
  );
}
