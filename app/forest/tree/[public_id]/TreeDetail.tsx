"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { calculateTreeImpact, formatImpactKg } from "@/lib/forest-impact";

interface TreeData {
  publicId: string;
  treeName: string | null;
  ownerDisplayName: string | null;
  xCoord: number;
  yCoord: number;
  activationAt: string | null;
  growthStage: string;
  message: string | null;
}

const STAGE_LABELS: Record<string, string> = {
  seed: "Seed",
  sprout: "Sprout",
  sapling: "Sapling",
  young: "Young Tree",
  mature: "Mature Tree",
  ancient: "Ancient Tree",
};

const STAGE_TO_SPRITE: Record<string, number> = {
  seed: 8, sprout: 0, sapling: 3, young: 5, mature: 5, ancient: 7,
};
export default function TreeDetail({ tree }: { tree: TreeData }) {
  const [copied, setCopied] = useState(false);
  const [hasShare, setHasShare] = useState(false);

  useEffect(() => {
    setHasShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const spriteIdx = STAGE_TO_SPRITE[tree.growthStage] || 5;
  const impact = calculateTreeImpact(tree.activationAt, tree.growthStage);

  const planted = tree.activationAt
    ? new Date(tree.activationAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  async function handleShare() {
    if (hasShare) {
      try {
        await navigator.share({
          title: `${tree.treeName || "A Tree"} — AileCo Digital Forest`,
          text: `A ${tree.growthStage} tree planted by ${tree.ownerDisplayName || "Anonymous"}`,
          url: shareUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white font-body">
      <div className="max-w-lg mx-auto px-5 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/forest"
          className="inline-flex items-center gap-2 text-white/30 hover:text-[#D4A853] text-xs uppercase tracking-[0.15em] transition-colors mb-8 sm:mb-12 touch-manipulation"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-current shrink-0">
            <path d="M7 1L3 5l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Digital Forest
        </Link>

        {/* Pixel Art Tree Sprite — 64px source at 2× (128px) / 3× (192px) integer scales */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <img
            src={`/images/forest/trees/trees-set1-64_${spriteIdx}.png`}
            alt={tree.growthStage}
            className="w-32 h-32 sm:w-48 sm:h-48"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Info */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-heading text-xl sm:text-2xl text-[#FFFBF0] tracking-wide mb-1">
            {tree.treeName || "Unnamed Tree"}
          </h1>
          <p className="text-white/30 text-xs font-body">
            Planted by{" "}
            <span className="text-white/50">
              {tree.ownerDisplayName || "Anonymous"}
            </span>
          </p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-px bg-white/5 mb-6 sm:mb-8">
          {[
            { label: "Stage", value: STAGE_LABELS[tree.growthStage] || tree.growthStage },
            { label: "Planted", value: planted },
            { label: "Coordinates", value: `(${tree.xCoord}, ${tree.yCoord})` },
            { label: "ID", value: tree.publicId.slice(0, 8) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#111111] p-3 sm:p-4">
              <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] mb-1 font-body">
                {label}
              </p>
              <p className="text-white/70 text-xs sm:text-sm font-body">{value}</p>
            </div>
          ))}
        </div>

        {/* Environmental Impact */}
        {impact.oxygenKg > 0 && (
          <div className="mb-6 sm:mb-8 p-4 bg-[#111111] border border-[#D4A853]/10">
            <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] mb-3 font-body">
              Environmental Impact
            </p>
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              <div className="text-center">
                <p className="text-[#D4A853] text-lg sm:text-xl font-heading">
                  {formatImpactKg(impact.oxygenKg)}
                </p>
                <p className="text-white/30 text-[9px] uppercase tracking-wider mt-0.5 font-body">
                  O₂ Produced
                </p>
              </div>
              <div className="w-px h-10 bg-white/5" />
              <div className="text-center">
                <p className="text-[#D4A853] text-lg sm:text-xl font-heading">
                  {formatImpactKg(impact.co2Kg)}
                </p>
                <p className="text-white/30 text-[9px] uppercase tracking-wider mt-0.5 font-body">
                  CO₂ Absorbed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Growth bar */}
        <div className="mb-6 sm:mb-8">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] mb-2 font-body">
            Growth Progress
          </p>
          <div className="h-0.5 bg-white/5">
            <div
              className="h-full bg-[#D4A853] transition-all duration-1000"
              style={{
                width: `${
                  ["seed","sprout","sapling","young","mature","ancient"].indexOf(tree.growthStage) * 20 + 10
                }%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {["seed", "sprout", "sapling", "young", "mature", "ancient"].map((s) => (
              <span
                key={s}
                className={`text-[7px] sm:text-[8px] uppercase tracking-widest font-body ${
                  s === tree.growthStage ? "text-[#D4A853]" : "text-white/15"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Message */}
        {tree.message && (
          <div className="mb-6 sm:mb-8 p-4 bg-[#111111] border border-white/5 text-center">
            <p className="text-white/40 text-xs italic font-body">&ldquo;{tree.message}&rdquo;</p>
          </div>
        )}

        {/* Actions — stack on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-3">
          <button
            onClick={handleShare}
            className="bg-[#D4A853] text-black font-semibold px-6 py-3 text-sm uppercase tracking-[0.15em] hover:bg-[#E8B33A] transition-colors font-body touch-manipulation active:bg-[#C49A3A]"
          >
            {hasShare ? "Share" : copied ? "Copied!" : "Copy Link"}
          </button>
          <Link
            href="/forest"
            className="bg-white/5 border border-white/10 text-white/60 px-6 py-3 text-sm uppercase tracking-[0.15em] hover:bg-white/10 transition-colors font-body text-center touch-manipulation"
          >
            Explore Forest
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/10 text-[9px] mt-10 sm:mt-12 font-body">
          Part of the AileCo Digital Forest. Every tree is backed by a verified Smartchain.
        </p>
      </div>
    </main>
  );
}
