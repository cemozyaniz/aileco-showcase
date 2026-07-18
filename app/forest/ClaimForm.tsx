"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

interface Reservation {
  publicId: string;
  expiresAt: string;
  xCoord: number;
  yCoord: number;
}

interface Props {
  reservation: Reservation;
  token: string;
  onClaimed: () => void;
  onClose: () => void;
}

interface SmartchainOption {
  id: number;
  uniqueCode: string;
  productType: string;
  attachedName: string | null;
}

export default function ClaimForm({ reservation, token, onClaimed, onClose }: Props) {
  const router = useRouter();

  const [treeName, setTreeName] = useState("");
  const [message, setMessage] = useState("");
  const [smartchains, setSmartchains] = useState<SmartchainOption[]>([]);
  const [selectedSmartchain, setSelectedSmartchain] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    function tick() {
      const remaining = Math.max(
        0,
        Math.floor((new Date(reservation.expiresAt).getTime() - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reservation.expiresAt]);

  // Fetch user's smartchains
  useEffect(() => {
    async function fetchSmartchains() {
      try {
        const resp = await fetch(`${API_URL}/smartchains/forest-eligible`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) return;
        const data = await resp.json();
        const items = data.items || data;
        setSmartchains(Array.isArray(items) ? items : []);
      } catch {
        // Smartchain fetch failed — user can still submit without selecting one
      }
    }
    fetchSmartchains();
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const claimIdempotencyKey = crypto.randomUUID();
      const resp = await fetch(`${API_URL}/forest/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservationPublicId: reservation.publicId,
          smartchainId: selectedSmartchain || 0,
          claimIdempotencyKey,
          treeName: treeName || null,
          message: message || null,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (err.code === "ENTITLEMENT_ALREADY_CONSUMED") {
          setError("This Smartchain was already used to plant a tree. Please select another.");
          return;
        }
        throw new Error(err.detail || `Claim failed (${resp.status})`);
      }

      const tree = await resp.json();
      onClaimed();

      // Navigate to tree detail page
      if (tree.publicId) {
        router.push(`/forest/tree/${tree.publicId}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to plant tree");
    } finally {
      setLoading(false);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft <= 0;

  return (
    <div className="absolute inset-0 z-40 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-md sm:mx-4 bg-[#111111] border-t sm:border border-[#D4A853]/20 sm:rounded-none p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-body">
              Plot {String(reservation.xCoord).padStart(3, "0")}:{String(reservation.yCoord).padStart(3, "0")}
            </p>
            <h2 className="font-heading text-xl text-[#FFFBF0] tracking-wide mt-0.5">
              Plant Your Tree
            </h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xs uppercase tracking-widest">
            ✕
          </button>
        </div>

        {/* Countdown */}
        <div className="mb-6 p-3 bg-black border border-[#D4A853]/20 text-center">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] font-body mb-1">
            Reservation expires in
          </p>
          <p
            className={`font-body text-2xl tabular-nums tracking-widest ${
              timeLeft < 60 ? "text-red-400" : "text-[#D4A853]"
            }`}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
        </div>

        {isExpired ? (
          <div className="text-center">
            <p className="text-red-400 text-sm font-body mb-4">Reservation has expired.</p>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white text-xs uppercase tracking-widest font-body"
            >
              Choose Another Plot
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 border border-red-900/40 bg-red-900/10 text-red-400 text-xs font-body">
                {error}
              </div>
            )}

            {/* Tree Name */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5 font-body">
                Tree Name
              </label>
              <input
                type="text"
                value={treeName}
                onChange={(e) => setTreeName(e.target.value)}
                maxLength={40}
                placeholder="Give your tree a name…"
                className="w-full bg-black border border-white/10 px-3 py-2.5 text-sm text-white font-body
                           focus:border-[#D4A853]/50 focus:outline-none transition-colors
                           placeholder:text-white/20"
              />
            </div>

            {/* Dedication */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5 font-body">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
                rows={2}
                placeholder="A dedication or message…"
                className="w-full bg-black border border-white/10 px-3 py-2.5 text-sm text-white font-body
                           focus:border-[#D4A853]/50 focus:outline-none transition-colors
                           placeholder:text-white/20 resize-none"
              />
            </div>

            {/* Smartchain Selector */}
            {smartchains.length > 0 && (
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5 font-body">
                  Smartchain
                </label>
                <select
                  value={selectedSmartchain ?? ""}
                  onChange={(e) => setSelectedSmartchain(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-black border border-white/10 px-3 py-2.5 text-sm text-white font-body
                             focus:border-[#D4A853]/50 focus:outline-none transition-colors"
                >
                  <option value="">Select a Smartchain…</option>
                  {smartchains.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.attachedName || sc.uniqueCode}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4A853] text-black font-semibold py-3 text-sm uppercase tracking-[0.15em]
                         hover:bg-[#E8B33A] transition-colors disabled:opacity-50 font-body"
            >
              {loading ? "Planting…" : "Plant Tree"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
