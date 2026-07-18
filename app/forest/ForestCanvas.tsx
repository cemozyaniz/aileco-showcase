"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import LoginModal from "@/app/components/LoginModal";
import ReservationPanel from "./ReservationPanel";
import ClaimForm from "./ClaimForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

// --- Constants ---
const PLOT_SIZE = 4;
const GRID_COLOR = "rgba(255,255,255,0.03)";
const GRID_MAJOR_COLOR = "rgba(255,255,255,0.06)";
const PLOT_AVAILABLE_COLOR = "rgba(255,255,255,0.08)";
const PLOT_CLAIMED_COLOR = "#E8B33A";
const BG_COLOR = "#0B0B0B";
const MAJOR_GRID_INTERVAL = 10;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 64;
const MAX_VIEWPORT_SPAN = 200;
const MAX_TILES_PER_VIEWPORT = 6;
const FETCH_DEBOUNCE_MS = 150;

// --- Types ---
interface Viewport {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

interface Reservation {
  publicId: string;
  expiresAt: string;
  xCoord: number;
  yCoord: number;
}

function hashToIndex(publicId: string): number {
  let h = 0;
  for (let i = 0; i < publicId.length; i++) {
    h = (h * 31 + publicId.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 9;
}

type Phase = "browsing" | "reserving" | "claiming";

export default function ForestCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const claimedRef = useRef<Map<string, { publicId: string; ownerName: string | null }>>(new Map());
  const viewportRef = useRef<Viewport>({ x: 0, y: 0, zoom: 8, width: 0, height: 0 });
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAuthenticated, token, user } = useAuth();

  // Sprite preloader
  const spritesRef = useRef<HTMLImageElement[] | null>(null);
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < 9; i++) {
      const img = new Image();
      img.src = `/images/forest/trees/trees-set1-64_${i}.png`;
      imgs.push(img);
    }
    spritesRef.current = imgs;
  }, []);

  const [claimedPlots, setClaimedPlots] = useState<Set<string>>(new Set());
  const [selectedPlot, setSelectedPlot] = useState<{ x: number; y: number } | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<{ x: number; y: number } | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [phase, setPhase] = useState<Phase>("browsing");
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  // --- Viewport Fetching ---
  const fetchViewport = useCallback(async (vp: Viewport) => {
    const scale = vp.zoom * PLOT_SIZE;
    const halfW = vp.width / (2 * scale);
    const halfH = vp.height / (2 * scale);

    // Break large viewports into multiple requests if needed
    const chunks: Array<{ mx: number; Mx: number; my: number; My: number }> = [];
    for (let cx = Math.floor(vp.x - halfW); cx < vp.x + halfW; cx += MAX_VIEWPORT_SPAN) {
      for (let cy = Math.floor(vp.y - halfH); cy < vp.y + halfH; cy += MAX_VIEWPORT_SPAN) {
        chunks.push({
          mx: cx,
          Mx: Math.min(cx + MAX_VIEWPORT_SPAN, Math.ceil(vp.x + halfW)),
          my: cy,
          My: Math.min(cy + MAX_VIEWPORT_SPAN, Math.ceil(vp.y + halfH)),
        });
      }
    }

    const newClaimed = new Map(claimedRef.current);

    // Cap tiles and fetch sequentially to avoid rate-limiting
    const capped = chunks.slice(0, MAX_TILES_PER_VIEWPORT);
    for (const chunk of capped) {
      try {
        const resp = await fetch(
          `${API_URL}/forest/plots?min_x=${chunk.mx}&max_x=${chunk.Mx}&min_y=${chunk.my}&max_y=${chunk.My}`
        );
        if (!resp.ok) continue;
        const data = await resp.json();
        for (const plot of data.plots) {
          newClaimed.set(`${plot.xCoord},${plot.yCoord}`, {
            publicId: plot.publicId,
            ownerName: plot.ownerDisplayName || null,
          });
        }
      } catch {
        // Network error — keep stale data
      }
    }

    claimedRef.current = newClaimed;
    setClaimedPlots(new Set(newClaimed.keys()));
  }, []);

  const scheduleFetch = useCallback(
    (vp: Viewport) => {
      if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
      fetchTimerRef.current = setTimeout(() => fetchViewport(vp), FETCH_DEBOUNCE_MS);
    },
    [fetchViewport]
  );

  // --- Coordinate Conversion ---
  const screenToWorld = useCallback(
    (sx: number, sy: number): { x: number; y: number } => {
      const vp = viewportRef.current;
      const scale = vp.zoom * PLOT_SIZE;
      const wx = Math.round(vp.x + (sx - vp.width / 2) / scale);
      const wy = Math.round(vp.y + (sy - vp.height / 2) / scale);
      return { x: wx, y: wy };
    },
    []
  );

  // --- Drawing ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const vp = viewportRef.current;
    const { width, height } = vp;

    // Clear
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    const scale = vp.zoom * PLOT_SIZE;
    const offsetX = width / 2 - vp.x * scale;
    const offsetY = height / 2 - vp.y * scale;

    // Visible world bounds
    const worldMinX = Math.floor(vp.x - width / (2 * scale)) - 1;
    const worldMaxX = Math.ceil(vp.x + width / (2 * scale)) + 1;
    const worldMinY = Math.floor(vp.y - height / (2 * scale)) - 1;
    const worldMaxY = Math.ceil(vp.y + height / (2 * scale)) + 1;

    // Grid lines (only draw when zoomed in enough)
    if (scale >= 2) {
      const gridStep = scale >= 32 ? 1 : scale >= 8 ? MAJOR_GRID_INTERVAL : MAJOR_GRID_INTERVAL * 5;
      ctx.lineWidth = 0.5;
      for (let gx = Math.floor(worldMinX / gridStep) * gridStep; gx <= worldMaxX; gx += gridStep) {
        const sx = gx * scale + offsetX;
        ctx.strokeStyle = gx % MAJOR_GRID_INTERVAL === 0 ? GRID_MAJOR_COLOR : GRID_COLOR;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
      }
      for (let gy = Math.floor(worldMinY / gridStep) * gridStep; gy <= worldMaxY; gy += gridStep) {
        const sy = gy * scale + offsetY;
        ctx.strokeStyle = gy % MAJOR_GRID_INTERVAL === 0 ? GRID_MAJOR_COLOR : GRID_COLOR;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();
      }
    }

    // Origin crosshair
    const originSX = offsetX;
    const originSY = offsetY;
    if (originSX >= -20 && originSX <= width + 20) {
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(originSX, 0);
      ctx.lineTo(originSX, height);
      ctx.stroke();
    }
    if (originSY >= -20 && originSY <= height + 20) {
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, originSY);
      ctx.lineTo(width, originSY);
      ctx.stroke();
    }

    // Plot dots
    const dotRadius = Math.max(1.5, Math.min(scale * 0.4, 4));
    const claimed = claimedRef.current;

    for (let wx = worldMinX; wx <= worldMaxX; wx++) {
      for (let wy = worldMinY; wy <= worldMaxY; wy++) {
        const sx = wx * scale + offsetX;
        const sy = wy * scale + offsetY;

        // Skip if off-screen
        if (sx < -dotRadius || sx > width + dotRadius || sy < -dotRadius || sy > height + dotRadius) continue;

        const key = `${wx},${wy}`;
        const isClaimed = claimed.has(key);
        const isSelected = selectedPlot?.x === wx && selectedPlot?.y === wy;
        const isHovered = hoveredPlot?.x === wx && hoveredPlot?.y === wy;

        if (isClaimed) {
          if (scale >= 16 && spritesRef.current) {
            // Pixel art sprite at high zoom
            const tree = claimed.get(key)!;
            const idx = hashToIndex(tree.publicId);
            const sprite = spritesRef.current[idx];
            if (sprite && sprite.complete) {
              const size = scale * 0.7;
              ctx.drawImage(sprite, sx - size / 2, sy - size * 0.8, size, size);
              if (isHovered) {
                ctx.strokeStyle = "rgba(255,255,255,0.3)";
                ctx.lineWidth = 1;
                ctx.strokeRect(sx - size / 2, sy - size * 0.8, size, size);
              }
              continue;
            }
          }
          // Gold circle fallback
          ctx.fillStyle = isSelected || isHovered ? "#FFFBF0" : PLOT_CLAIMED_COLOR;
          ctx.beginPath();
          ctx.arc(sx, sy, dotRadius + (isHovered ? 1 : 0), 0, Math.PI * 2);
          ctx.fill();
        } else if (scale >= 4) {
          // Subtle dot for available (only when zoomed in)
          ctx.fillStyle = isSelected || isHovered ? "rgba(255,255,255,0.4)" : PLOT_AVAILABLE_COLOR;
          ctx.beginPath();
          ctx.arc(sx, sy, isHovered ? dotRadius + 1 : dotRadius * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [selectedPlot, hoveredPlot]);

  // --- Animation Loop ---
  useEffect(() => {
    function loop() {
      draw();
      animFrameRef.current = requestAnimationFrame(loop);
    }
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  // --- Resize Handler ---
  useEffect(() => {
    function handleResize() {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      viewportRef.current.width = rect.width;
      viewportRef.current.height = rect.height;
      scheduleFetch(viewportRef.current);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scheduleFetch]);

  // --- Initial Data Load ---
  useEffect(() => {
    scheduleFetch(viewportRef.current);
  }, [scheduleFetch]);

  // --- Pan/Zoom Handlers ---
  const interactionState = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    pinchDist: number;
  }>({ dragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0, pinchDist: 0 });

  function handleMouseDown(e: React.MouseEvent) {
    interactionState.current.dragging = true;
    interactionState.current.startX = e.clientX;
    interactionState.current.startY = e.clientY;
    interactionState.current.lastX = e.clientX;
    interactionState.current.lastY = e.clientY;
  }

  function handleMouseMove(e: React.MouseEvent) {
    const is = interactionState.current;

    if (is.dragging) {
      const dx = e.clientX - is.lastX;
      const dy = e.clientY - is.lastY;
      is.lastX = e.clientX;
      is.lastY = e.clientY;

      const vp = viewportRef.current;
      const scale = vp.zoom * PLOT_SIZE;
      vp.x -= dx / scale;
      vp.y -= dy / scale;
      viewportRef.current = { ...vp };
      scheduleFetch(vp);
      return;
    }

    // Hover tracking
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    setHoveredPlot(world);
  }

  function handleMouseUp() {
    interactionState.current.dragging = false;
  }

  function handleClick(e: React.MouseEvent) {
    const is = interactionState.current;
    // Only treat as click if we didn't drag (check against start position)
    const dx = Math.abs(e.clientX - is.startX);
    const dy = Math.abs(e.clientY - is.startY);
    if (dx > 5 || dy > 5) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);

    const key = `${world.x},${world.y}`;
    const tree = claimedRef.current.get(key);
    if (tree) {
      // Navigate to tree detail page
      window.open(`/forest/tree/${tree.publicId}`, "_blank");
      return;
    }

    setSelectedPlot(world);
    setPhase("reserving");
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const vp = viewportRef.current;
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, vp.zoom * factor));
    if (newZoom === vp.zoom) return;

    // Zoom toward cursor
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const oldScale = vp.zoom * PLOT_SIZE;
      const newScale = newZoom * PLOT_SIZE;
      vp.x += (mx - vp.width / 2) * (1 / oldScale - 1 / newScale);
      vp.y += (my - vp.height / 2) * (1 / oldScale - 1 / newScale);
    }

    vp.zoom = newZoom;
    viewportRef.current = { ...vp };
    scheduleFetch(vp);
  }

  // Touch handlers
  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      interactionState.current.dragging = true;
      interactionState.current.lastX = e.touches[0].clientX;
      interactionState.current.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      interactionState.current.dragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      interactionState.current.pinchDist = Math.hypot(dx, dy);
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    const is = interactionState.current;

    if (e.touches.length === 1 && is.dragging) {
      const dx = e.touches[0].clientX - is.lastX;
      const dy = e.touches[0].clientY - is.lastY;
      is.lastX = e.touches[0].clientX;
      is.lastY = e.touches[0].clientY;

      const vp = viewportRef.current;
      const scale = vp.zoom * PLOT_SIZE;
      vp.x -= dx / scale;
      vp.y -= dy / scale;
      viewportRef.current = { ...vp };
      scheduleFetch(vp);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      if (is.pinchDist > 0) {
        const factor = newDist / is.pinchDist;
        const vp = viewportRef.current;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, vp.zoom * factor));
        vp.zoom = newZoom;
        viewportRef.current = { ...vp };
        scheduleFetch(vp);
      }
      is.pinchDist = newDist;
    }
  }

  function handleTouchEnd() {
    interactionState.current.dragging = false;
    interactionState.current.pinchDist = 0;
  }

  // --- Close panel and reset ---
  function handleClosePanel() {
    setSelectedPlot(null);
    setReservation(null);
    setPhase("browsing");
  }

  function handleReserved(r: Reservation) {
    setReservation(r);
    setPhase("claiming");
  }

  function handleClaimed() {
    setSelectedPlot(null);
    setReservation(null);
    setPhase("browsing");
    // Refresh viewport to show the new tree
    scheduleFetch(viewportRef.current);
  }

  function handleLoginRequired() {
    setShowLogin(true);
  }

  // --- Auto-dismiss toast ---
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // --- Keyboard: Escape to close panel ---
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClosePanel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="block cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* --- UI Overlay --- */}

      {/* Top-left: Title */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <h1 className="font-heading text-xl uppercase tracking-[0.3em] text-[#FFFBF0]">
          Digital Forest
        </h1>
        <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase mt-1 font-body">
          AileCo SmartChain
        </p>
      </div>

      {/* Top-right: Zoom + Auth */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <span className="text-white/30 text-[10px] font-body tabular-nums">
          {Math.round(viewportRef.current.zoom * 100)}%
        </span>
        {isAuthenticated ? (
          <span className="text-[#D4A853]/70 text-[10px] uppercase tracking-widest font-body">
            {user?.name?.split(" ")[0] || "User"}
          </span>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="text-white/40 hover:text-[#D4A853] text-[10px] uppercase tracking-widest transition-colors font-body"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Bottom-center: Coordinate readout */}
      {hoveredPlot && (() => {
        const key = `${hoveredPlot.x},${hoveredPlot.y}`;
        const tree = claimedRef.current.get(key);
        return (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-center">
            <span className="text-white/20 text-[10px] tracking-[0.2em] font-body tabular-nums">
              X: {hoveredPlot.x.toString().padStart(4, "0")} &nbsp; Y:{" "}
              {hoveredPlot.y.toString().padStart(4, "0")}
            </span>
            {tree && (
              <div className="mt-1">
                <span className="text-[#D4A853]/60 text-[9px] tracking-wider font-body">
                  {tree.ownerName || "Unknown"}
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Reservation Panel */}
      {phase === "reserving" && selectedPlot && (
        <ReservationPanel
          x={selectedPlot.x}
          y={selectedPlot.y}
          token={token}
          isAuthenticated={isAuthenticated}
          onReserved={handleReserved}
          onLoginRequired={handleLoginRequired}
          onClose={handleClosePanel}
          onPlotTaken={() => {
            setSelectedPlot(null);
            setPhase("browsing");
            scheduleFetch(viewportRef.current);
          }}
        />
      )}

      {/* Claim Form */}
      {phase === "claiming" && reservation && (
        <ClaimForm
          reservation={reservation}
          token={token!}
          onClaimed={handleClaimed}
          onClose={handleClosePanel}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        message="Sign in to reserve plots and plant trees."
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 text-xs font-body
            ${toast.type === "error" ? "bg-red-900/80 text-red-200 border-red-700/40" : "bg-green-900/80 text-green-200 border-green-700/40"}
            border`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
