"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

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

const STAGE_TO_SPRITE: Record<string, number> = {
  seed: 8, sprout: 0, sapling: 3, young: 5, mature: 5, ancient: 7,
};

const STAGE_LABELS: Record<string, string> = {
  seed: "Seed", sprout: "Sprout", sapling: "Sapling",
  young: "Young Tree", mature: "Mature Tree", ancient: "Ancient Tree",
};

interface Props {
  publicId: string;
  onClose: () => void;
}

export default function TreeModal({ publicId, onClose }: Props) {
  const [tree, setTree] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/forest/trees/${publicId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setTree)
      .catch(() => setTree(null))
      .finally(() => setLoading(false));
  }, [publicId]);

  const planted = tree?.activationAt
    ? new Date(tree.activationAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "Recently";

  const spriteIdx = STAGE_TO_SPRITE[tree?.growthStage || "seed"];

  return (
    <div className="absolute inset-0 z-40 flex items-end sm:items-center sm:justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-sm mx-auto bg-[#111111] border-t sm:border border-[#D4A853]/20 sm:rounded-none p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border border-[#D4A853]/40 border-t-[#D4A853] rounded-full animate-spin" />
          </div>
        ) : !tree ? (
          <div className="text-center py-12">
            <p className="text-white/40 text-sm font-body">Tree not found</p>
            <button onClick={onClose} className="text-[#D4A853] text-xs mt-3 uppercase tracking-widest font-body">Close</button>
          </div>
        ) : (
          <>
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white text-xs uppercase tracking-widest">✕</button>

            {/* Sprite */}
            <div className="flex justify-center mb-4">
              <img
                src={`/images/forest/trees/trees-set1-256_${spriteIdx}.png`}
                alt={tree.growthStage}
                className="w-32 h-32 pixelated"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            {/* Info */}
            <div className="text-center mb-6">
              <h2 className="font-heading text-xl text-[#FFFBF0] tracking-wide">
                {tree.treeName || "Unnamed Tree"}
              </h2>
              <p className="text-white/30 text-xs mt-1 font-body">
                Planted by {tree.ownerDisplayName || "Anonymous"}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-px bg-white/5 mb-6">
              {[
                { l: "Stage", v: STAGE_LABELS[tree.growthStage] || tree.growthStage },
                { l: "Planted", v: planted },
                { l: "Coords", v: `(${tree.xCoord}, ${tree.yCoord})` },
                { l: "ID", v: tree.publicId.slice(0, 8) },
              ].map(({ l, v }) => (
                <div key={l} className="bg-[#0B0B0B] p-3">
                  <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] font-body">{l}</p>
                  <p className="text-white/60 text-xs font-body mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            {/* Growth bar */}
            <div className="mb-6">
              <div className="h-0.5 bg-white/5">
                <div
                  className="h-full bg-[#D4A853] transition-all duration-500"
                  style={{ width: `${["seed","sprout","sapling","young","mature","ancient"].indexOf(tree.growthStage) * 20 + 10}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                {["seed","sprout","sapling","young","mature","ancient"].map((s) => (
                  <span key={s} className={`text-[7px] uppercase tracking-widest font-body ${s === tree.growthStage ? "text-[#D4A853]" : "text-white/15"}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href={`/forest/tree/${tree.publicId}`}
                className="flex-1 text-center bg-[#D4A853] text-black font-semibold py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-[#E8B33A] transition-colors font-body"
              >
                View Full Page
              </Link>
              <button
                onClick={onClose}
                className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-white/10 transition-colors font-body"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
