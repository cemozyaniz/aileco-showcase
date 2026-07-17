"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/providers/AuthProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  message?: string;
}

export default function LoginModal({ isOpen, onClose, onSuccess, message }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 bg-[#111111] border border-[#D4A853]/30 rounded-none p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest"
        >
          ✕
        </button>

        <h2 className="font-heading text-2xl text-[#FFFBF0] mb-1 tracking-wide">
          SIGN IN
        </h2>
        <p className="text-white/30 text-xs mb-6 font-body">
          {message || "Sign in to reserve and plant trees in the Digital Forest."}
        </p>

        {error && (
          <div className="mb-4 p-3 border border-red-900/40 bg-red-900/10 text-red-400 text-xs font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5 font-body">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-3 py-2.5 text-sm text-white font-body
                         focus:border-[#D4A853]/50 focus:outline-none transition-colors
                         placeholder:text-white/20"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5 font-body">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-3 py-2.5 text-sm text-white font-body
                         focus:border-[#D4A853]/50 focus:outline-none transition-colors
                         placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4A853] text-black font-semibold py-2.5 text-sm uppercase tracking-[0.15em]
                       hover:bg-[#E8B33A] transition-colors disabled:opacity-50 font-body"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-white/20 text-[10px] mt-6 text-center font-body">
          Powered by AileCo SmartChain
        </p>
      </div>
    </div>
  );
}
