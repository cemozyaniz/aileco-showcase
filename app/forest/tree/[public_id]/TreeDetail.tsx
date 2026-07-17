"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

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

const CANVAS_SIZE = 360;

function drawTree(ctx: CanvasRenderingContext2D, stage: string) {
  const cx = CANVAS_SIZE / 2;
  const cy = CANVAS_SIZE - 60;
  const dpr = window.devicePixelRatio || 1;

  ctx.save();
  ctx.scale(dpr, dpr);

  // Ground
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, cy + 5, CANVAS_SIZE, CANVAS_SIZE - cy);

  // Ground line
  ctx.strokeStyle = "rgba(212,168,83,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, cy + 5);
  ctx.lineTo(CANVAS_SIZE - 40, cy + 5);
  ctx.stroke();

  switch (stage) {
    case "seed":
      drawSeed(ctx, cx, cy);
      break;
    case "sprout":
      drawSprout(ctx, cx, cy);
      break;
    case "sapling":
      drawSapling(ctx, cx, cy);
      break;
    case "young":
      drawYoung(ctx, cx, cy);
      break;
    case "mature":
      drawMature(ctx, cx, cy);
      break;
    case "ancient":
      drawAncient(ctx, cx, cy);
      break;
  }

  ctx.restore();
}

function drawSeed(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Soil mound
  ctx.fillStyle = "#1a1510";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Seed glow
  const gradient = ctx.createRadialGradient(cx, cy - 3, 0, cx, cy - 3, 12);
  gradient.addColorStop(0, "rgba(232,179,58,0.9)");
  gradient.addColorStop(0.4, "rgba(212,168,83,0.5)");
  gradient.addColorStop(1, "rgba(212,168,83,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy - 3, 12, 0, Math.PI * 2);
  ctx.fill();

  // Seed dot
  ctx.fillStyle = "#E8B33A";
  ctx.beginPath();
  ctx.arc(cx, cy - 3, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSprout(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Soil
  ctx.fillStyle = "#1a1510";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 35, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  ctx.strokeStyle = "#4a7c3f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.quadraticCurveTo(cx + 2, cy - 30, cx, cy - 50);
  ctx.stroke();

  // Leaves
  ctx.fillStyle = "#5a9e4b";
  ctx.beginPath();
  ctx.ellipse(cx - 10, cy - 40, 10, 5, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 10, cy - 45, 10, 5, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Gold sparkle at tip
  ctx.fillStyle = "#E8B33A";
  ctx.beginPath();
  ctx.arc(cx, cy - 50, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSapling(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Soil
  ctx.fillStyle = "#1a1510";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 40, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Trunk
  ctx.strokeStyle = "#5c4033";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - 80);
  ctx.stroke();

  // Branches
  ctx.strokeStyle = "#6b4d3c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 50);
  ctx.quadraticCurveTo(cx - 15, cy - 60, cx - 20, cy - 70);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - 60);
  ctx.quadraticCurveTo(cx + 12, cy - 70, cx + 18, cy - 80);
  ctx.stroke();

  // Small canopy
  for (let i = 0; i < 3; i++) {
    const rx = 14 + i * 4;
    const ry = 10 + i * 2;
    ctx.fillStyle = `hsl(${100 + i * 15}, 45%, ${30 + i * 5}%)`;
    ctx.beginPath();
    ctx.ellipse(cx - 5 + i * 5, cy - 85, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawYoung(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Trunk
  ctx.strokeStyle = "#5c4033";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - 140);
  ctx.stroke();

  // Main branches
  const branches = [
    { angle: -0.5, len: 40, startY: -90 },
    { angle: 0.4, len: 35, startY: -100 },
    { angle: -0.3, len: 30, startY: -120 },
    { angle: 0.5, len: 38, startY: -110 },
    { angle: -0.6, len: 32, startY: -70 },
    { angle: 0.3, len: 28, startY: -80 },
  ];

  ctx.strokeStyle = "#6b4d3c";
  ctx.lineWidth = 2.5;
  for (const b of branches) {
    const bx = cx + Math.sin(b.angle) * 10;
    const by = cy + b.startY;
    ctx.beginPath();
    ctx.moveTo(cx, cy + b.startY);
    ctx.lineTo(bx + Math.sin(b.angle) * b.len, by - Math.cos(b.angle) * b.len * 0.5);
    ctx.stroke();
  }

  // Full canopy (multiple layered ellipses)
  for (let layer = 0; layer < 4; layer++) {
    const ox = cx - 5 + layer * 3;
    const oy = cy - 145 + layer * 5;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `hsla(${95 + layer * 10 + i * 8}, ${40 + layer * 8}%, ${25 + layer * 6}%, 0.9)`;
      ctx.beginPath();
      ctx.ellipse(
        ox + (i - 2) * 14,
        oy + Math.sin(i * 0.8) * 8,
        16 + layer * 2,
        12 + layer,
        (i - 2) * 0.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}

function drawMature(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Wide trunk with taper
  ctx.fillStyle = "#5c4033";
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy);
  ctx.lineTo(cx - 2, cy - 160);
  ctx.lineTo(cx + 2, cy - 160);
  ctx.lineTo(cx + 5, cy);
  ctx.closePath();
  ctx.fill();

  // Bark texture
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 0.5;
  for (let y = cy - 15; y > cy - 155; y -= 12) {
    ctx.beginPath();
    ctx.moveTo(cx - 3 + Math.sin(y * 0.1) * 2, y);
    ctx.quadraticCurveTo(cx, y - 3, cx + 2 + Math.sin(y * 0.1) * 2, y);
    ctx.stroke();
  }

  // Branches
  const branchDefs = [
    { y: -40, angle: -0.6, len: 55 },
    { y: -55, angle: 0.55, len: 50 },
    { y: -70, angle: -0.5, len: 48 },
    { y: -85, angle: 0.6, len: 52 },
    { y: -100, angle: -0.7, len: 42 },
    { y: -110, angle: 0.45, len: 44 },
    { y: -125, angle: -0.55, len: 36 },
    { y: -135, angle: 0.5, len: 34 },
  ];

  for (const b of branchDefs) {
    ctx.strokeStyle = "#6b4d3c";
    ctx.lineWidth = 2 + Math.abs(b.y) * 0.01;
    ctx.beginPath();
    const bx = cx + (cy + b.y - cy) * 0.02;
    ctx.moveTo(cx, cy + b.y);
    const ex = cx + Math.sin(b.angle) * b.len;
    const ey = cy + b.y - Math.abs(Math.cos(b.angle)) * b.len * 0.5;
    ctx.quadraticCurveTo(cx + Math.sin(b.angle) * b.len * 0.5, cy + b.y - 15, ex, ey);
    ctx.stroke();
  }

  // Rich canopy
  for (let layer = 0; layer < 6; layer++) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + layer * 0.3;
      const dist = 12 + layer * 4;
      const ox = cx + Math.cos(angle) * dist;
      const oy = cy - 165 + Math.sin(angle) * dist * 0.6 + layer * 4;
      ctx.fillStyle = `hsla(${90 + layer * 12 + i * 6}, ${45 + layer * 5}%, ${22 + layer * 5}%, 0.85)`;
      ctx.beginPath();
      ctx.ellipse(ox, oy, 15 + layer, 11 + layer * 0.5, angle * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Gold particles floating
  for (let i = 0; i < 8; i++) {
    const px = cx + Math.sin(i * 1.5 + Date.now() * 0.001) * 50;
    const py = cy - 180 + Math.cos(i * 2 + Date.now() * 0.0015) * 30;
    ctx.fillStyle = `rgba(232,179,58,${0.3 + Math.sin(Date.now() * 0.002 + i) * 0.2})`;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAncient(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Massive trunk
  ctx.fillStyle = "#4a3528";
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy);
  ctx.quadraticCurveTo(cx - 8, cy - 100, cx - 3, cy - 200);
  ctx.lineTo(cx + 3, cy - 200);
  ctx.quadraticCurveTo(cx + 8, cy - 100, cx + 10, cy);
  ctx.closePath();
  ctx.fill();

  // Deep roots visible
  ctx.strokeStyle = "#4a3528";
  ctx.lineWidth = 3;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + dir * 8, cy - 5);
    ctx.quadraticCurveTo(cx + dir * 25, cy + 10, cx + dir * 40, cy + 5);
    ctx.stroke();
  }

  // Bark texture
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 0.5;
  for (let y = cy - 20; y > cy - 195; y -= 15) {
    ctx.beginPath();
    const wobble = Math.sin(y * 0.05) * 4;
    ctx.moveTo(cx - 6 + wobble, y);
    ctx.quadraticCurveTo(cx, y - 4, cx + 6 - wobble, y);
    ctx.stroke();
  }

  // Many branches
  for (let y = cy - 30; y > cy - 190; y -= 20) {
    const angle = (Math.sin(y * 0.04) * 0.8 + (y % 40 === 0 ? 0.3 : -0.3));
    ctx.strokeStyle = "rgba(107,77,60,0.8)";
    ctx.lineWidth = 2 + (1 - (y + cy) / (cy - 200 + cy)) * 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    const ex = cx + Math.sin(angle) * (40 + Math.random() * 20);
    const ey = y - 20;
    ctx.quadraticCurveTo(cx + Math.sin(angle) * 20, y - 10, ex, ey);
    ctx.stroke();
  }

  // Massive layered canopy
  for (let layer = 0; layer < 8; layer++) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + layer * 0.25;
      const dist = 15 + layer * 5;
      const ox = cx + Math.cos(angle) * dist;
      const oy = cy - 205 + Math.sin(angle) * dist * 0.5 + layer * 5;
      ctx.fillStyle = `hsla(${85 + layer * 10 + i * 5}, ${40 + layer * 4}%, ${20 + layer * 4}%, 0.85)`;
      ctx.beginPath();
      ctx.ellipse(ox, oy, 18 + layer * 1.5, 13 + layer, angle * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Golden glow aura
  const glow = ctx.createRadialGradient(cx, cy - 200, 30, cx, cy - 200, 100);
  glow.addColorStop(0, "rgba(232,179,58,0.15)");
  glow.addColorStop(0.5, "rgba(212,168,83,0.05)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy - 200, 100, 0, Math.PI * 2);
  ctx.fill();

  // Floating gold particles
  for (let i = 0; i < 20; i++) {
    const px = cx + Math.sin(i * 0.8 + Date.now() * 0.0008) * 70;
    const py = cy - 210 + Math.cos(i * 1.1 + Date.now() * 0.001) * 50;
    const alpha = 0.2 + Math.sin(Date.now() * 0.002 + i) * 0.15;
    const size = 1 + (i % 3);
    ctx.fillStyle = `rgba(232,179,58,${Math.max(0, alpha)})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function TreeDetail({ tree }: { tree: TreeData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [copied, setCopied] = useState(false);
  const [hasShare, setHasShare] = useState(false);

  useEffect(() => {
    setHasShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx; // stable reference for closure

    function loop() {
      c.clearRect(0, 0, canvas!.width, canvas!.height);
      drawTree(c, tree.growthStage);
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [tree.growthStage]);

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
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/forest"
          className="inline-flex items-center gap-2 text-white/30 hover:text-[#D4A853] text-xs uppercase tracking-[0.15em] transition-colors mb-12"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-current">
            <path d="M7 1L3 5l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Digital Forest
        </Link>

        {/* Tree Canvas */}
        <div className="flex justify-center mb-10">
          <canvas ref={canvasRef} className="rounded-sm" />
        </div>

        {/* Info */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl text-[#FFFBF0] tracking-wide mb-1">
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
        <div className="grid grid-cols-2 gap-px bg-white/5 mb-8">
          {[
            { label: "Stage", value: STAGE_LABELS[tree.growthStage] || tree.growthStage },
            { label: "Planted", value: planted },
            { label: "Coordinates", value: `(${tree.xCoord}, ${tree.yCoord})` },
            { label: "ID", value: tree.publicId.slice(0, 8) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#111111] p-4">
              <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] mb-1 font-body">
                {label}
              </p>
              <p className="text-white/70 text-sm font-body">{value}</p>
            </div>
          ))}
        </div>

        {/* Growth bar */}
        <div className="mb-8">
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
                className={`text-[8px] uppercase tracking-widest font-body ${
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
          <div className="mb-8 p-4 bg-[#111111] border border-white/5 text-center">
            <p className="text-white/40 text-xs italic font-body">&ldquo;{tree.message}&rdquo;</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleShare}
            className="bg-[#D4A853] text-black font-semibold px-6 py-2.5 text-sm uppercase tracking-[0.15em] hover:bg-[#E8B33A] transition-colors font-body"
          >
            {hasShare ? "Share" : copied ? "Copied!" : "Copy Link"}
          </button>
          <Link
            href="/forest"
            className="bg-white/5 border border-white/10 text-white/60 px-6 py-2.5 text-sm uppercase tracking-[0.15em] hover:bg-white/10 transition-colors font-body"
          >
            Explore Forest
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/10 text-[9px] mt-12 font-body">
          Part of the AileCo Digital Forest. Every tree is backed by a verified Smartchain.
        </p>
      </div>
    </main>
  );
}
