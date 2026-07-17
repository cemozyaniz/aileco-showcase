"use client";

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

interface Reservation {
  publicId: string;
  expiresAt: string;
  xCoord: number;
  yCoord: number;
}

interface Props {
  x: number;
  y: number;
  token: string | null;
  isAuthenticated: boolean;
  onReserved: (r: Reservation) => void;
  onLoginRequired: () => void;
  onClose: () => void;
  onPlotTaken: () => void;
}

export default function ReservationPanel({
  x,
  y,
  token,
  isAuthenticated,
  onReserved,
  onLoginRequired,
  onClose,
  onPlotTaken,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserve = useCallback(async () => {
    if (!isAuthenticated || !token) {
      onLoginRequired();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idempotencyKey = crypto.randomUUID();
      const resp = await fetch(`${API_URL}/forest/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ x, y, idempotencyKey }),
      });

      if (resp.status === 409) {
        onPlotTaken();
        return;
      }

      if (resp.status === 503) {
        setError("Reservations are temporarily unavailable. Please try again.");
        return;
      }

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || `Failed (${resp.status})`);
      }

      const data = await resp.json();
      onReserved({
        publicId: data.publicId,
        expiresAt: data.expiresAt,
        xCoord: data.xCoord,
        yCoord: data.yCoord,
      });
    } catch (err: any) {
      setError(err.message || "Reservation failed");
    } finally {
      setLoading(false);
    }
  }, [x, y, token, isAuthenticated, onReserved, onLoginRequired, onPlotTaken]);

  // Auto-reserve if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      reserve();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-xl border-t border-[#D4A853]/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-lg text-[#FFFBF0] tracking-wide">
              PLOT {String(x).padStart(3, "0")}:{String(y).padStart(3, "0")}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xs uppercase tracking-widest">
            Cancel
          </button>
        </div>
        <div className="flex items-center gap-3 text-white/40 text-sm font-body">
          <div className="w-4 h-4 border border-[#D4A853]/40 border-t-[#D4A853] rounded-full animate-spin" />
          Reserving plot…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-xl border-t border-[#D4A853]/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg text-[#FFFBF0] tracking-wide">
            PLOT {String(x).padStart(3, "0")}:{String(y).padStart(3, "0")}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xs uppercase tracking-widest">
            Cancel
          </button>
        </div>
        <p className="text-white/40 text-xs font-body mb-4">
          Sign in to reserve this plot and plant your tree.
        </p>
        <button
          onClick={onLoginRequired}
          className="w-full bg-[#D4A853] text-black font-semibold py-2.5 text-sm uppercase tracking-[0.15em] hover:bg-[#E8B33A] transition-colors font-body"
        >
          Sign In to Reserve
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-xl border-t border-red-900/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg text-red-400 tracking-wide">Error</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xs uppercase tracking-widest">
            Close
          </button>
        </div>
        <p className="text-red-300/70 text-xs font-body mb-4">{error}</p>
        <button
          onClick={reserve}
          className="w-full bg-white/5 border border-white/10 text-white/70 py-2 text-xs uppercase tracking-widest hover:bg-white/10 transition-colors font-body"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
