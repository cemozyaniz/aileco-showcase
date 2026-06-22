"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "AileCo Smartchain",
          url: window.location.href,
        });
      } catch {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-white/[0.06] transition-colors text-zinc-500 hover:text-zinc-300"
      title="Share"
    >
      {copied ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7.217 10.907a2.25 2.25 0 100 2.186 5.379m2.186-5.379a2.25 2.25 0 013.072-1.076l2.582-1.063a4.5 4.5 0 005.789.796l.576.311V21l-.576-.311a4.5 4.5 0 00-5.789-.796l-2.582-1.063z"
          />
        </svg>
      )}
    </button>
  );
}
