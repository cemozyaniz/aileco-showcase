"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";
import StatusBadge from "./StatusBadge";

interface Card3DProps {
  uniqueCode: string;
  attachedName?: string;
  attachedToType?: string | null;
  createdAt?: string | null;
  mode?: string | null;
  isRevealed: boolean;
  cardScale: number;
  ownerName?: string | null;
  isProfilePublic?: boolean | null;
  onViewContact?: () => void;
  children: React.ReactNode;
}

const CARD_THICKNESS = 6;

const typeLabels: Record<string, string> = {
  product: "Product",
  luggage: "Luggage",
  vehicle: "Vehicle",
  human: "Personal",
  pet: "Pet",
};

function toBadgeStatus(mode?: string | null): "active" | "lost" | "stolen" {
  if (mode === "lost") return "lost";
  if (mode === "stolen") return "stolen";
  return "active";
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function Card3D({
  uniqueCode,
  attachedName,
  attachedToType,
  createdAt,
  mode,
  isRevealed,
  cardScale,
  ownerName,
  isProfilePublic,
  onViewContact,
  children,
}: Card3DProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const peekControls = useAnimation();

  // Drag-to-rotate
  const [dragRotation, setDragRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartRot = useRef(0);

  // Mouse vertical tilt (only when NOT dragging + interactive)
  const [tiltX, setTiltX] = useState(0);

  // Interactive after peek completes
  const [isInteractive, setIsInteractive] = useState(false);

  // Trigger peek animation after card is revealed
  useEffect(() => {
    if (!isRevealed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsInteractive(true);
      return;
    }
    let cancelled = false;
    const run = async () => {
      await new Promise((r) => setTimeout(r, 500));
      if (cancelled) return;
      // Peek: tilt ~40° to hint the back side, then return
      await peekControls.start({
        rotateY: [0, 40, 0],
        transition: { duration: 1.6, times: [0, 0.35, 1], ease: "easeInOut" },
      });
      if (cancelled) return;
      setIsInteractive(true);
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed]);

  // Pointer handlers — active only when interactive
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteractive) return;
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartRot.current = dragRotation;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isInteractive, dragRotation],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !isInteractive) return;
      const delta = e.clientX - dragStartX.current;
      setDragRotation(clamp(dragStartRot.current + delta * 0.8, 0, 180));
    },
    [isDragging, isInteractive],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest face
    setDragRotation((prev) => (prev < 90 ? 0 : 180));
  }, [isDragging]);

  // Mouse hover tilt (vertical, when not dragging + interactive)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging || !isInteractive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltX(y * -8);
    },
    [isDragging, isInteractive],
  );

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) setTiltX(0);
  }, [isDragging]);

  // Derived labels
  const badgeStatus = toBadgeStatus(mode);
  const badgeLabel =
    mode === "lost"
      ? t("smartchain.status.lost")
      : mode === "stolen"
        ? t("smartchain.status.stolen")
        : t("smartchain.status.active");

  const copiableCode = uniqueCode.startsWith("http")
    ? uniqueCode.split("/").pop() || uniqueCode
    : uniqueCode;
  const typeLabel =
    attachedToType && typeLabels[attachedToType] ? typeLabels[attachedToType] : null;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // Gold-tinted shadow (replaced blue glow)
  const cardShadow = isRevealed
    ? "0 20px 50px -10px rgba(212,168,83,0.1), 0 0 40px rgba(212,168,83,0.05)"
    : "0 25px 50px -12px rgba(0,0,0,0.5)";

  return (
    <div className="relative">
      <motion.div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={
          !isInteractive
            ? peekControls
            : {
                rotateX: isDragging ? 0 : tiltX,
                rotateY: dragRotation,
                scale: cardScale,
              }
        }
        transition={
          !isInteractive
            ? {}
            : isDragging
              ? {
                  rotateY: { duration: 0 },
                  rotateX: { duration: 0.15 },
                  scale: { type: "spring", stiffness: 100, damping: 20 },
                }
              : {
                  rotateY: { type: "spring", stiffness: 70, damping: 16 },
                  rotateX: { duration: 0.3, ease: "easeOut" },
                  scale: { type: "spring", stiffness: 100, damping: 20 },
                }
        }
        style={{
          transformStyle: "preserve-3d",
          boxShadow: cardShadow,
          touchAction: "pan-y",
        }}
        className="relative cursor-grab active:cursor-grabbing select-none
          w-[280px] h-[440px] sm:w-[320px] sm:h-[480px] lg:w-[340px] lg:h-[500px]"
      >
        {/* ═══════ FRONT FACE ═══════ */}
        <div
          style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }}
          className="rounded-2xl overflow-hidden"
        >
          {children}
        </div>

        {/* ═══════ BACK FACE — Product Info + Owner Name ═══════ */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
          }}
          className="rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800"
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-5">
            {/* Status Badge — top right */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
              <StatusBadge status={badgeStatus} isVisible={true} label={badgeLabel} />
            </div>

            {/* Product name */}
            <h2 className="text-base sm:text-lg font-medium text-white text-center px-4 leading-tight">
              {attachedName || t("smartchain.defaultName")}
            </h2>

            {/* Code + copy button */}
            <div className="flex items-center gap-2 mt-2">
              <code className="text-[10px] font-mono text-zinc-500 tracking-wider">
                {copiableCode}
              </code>
              <button
                className="text-zinc-600 hover:text-zinc-400 transition-colors"
                title="Copy code"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(copiableCode).catch(() => {});
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Owner name */}
            <div className="mt-3 text-center">
              {ownerName ? (
                <p className="text-white/50 text-xs font-body">{ownerName}</p>
              ) : (
                <p className="text-zinc-600 text-xs italic font-body">
                  {t("smartchain.defaultName")}
                </p>
              )}
            </div>

            {/* Type label + date */}
            <div className="flex items-center gap-2 mt-2">
              {typeLabel && (
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                  {typeLabel}
                </span>
              )}
              {formattedDate && (
                <span className="text-[10px] text-zinc-600">{formattedDate}</span>
              )}
            </div>

            {/* View Contact button — only if owner has public vCard */}
            {ownerName && isProfilePublic && onViewContact && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewContact();
                }}
                className="mt-5 bg-[#D4A853] text-black font-semibold px-5 py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-[#E8B33A] active:bg-[#C49A3A] transition-colors rounded-lg touch-manipulation font-body"
              >
                {t("smartchain.viewContact")}
              </button>
            )}
          </div>
        </div>

        {/* ═══════ CARD THICKNESS EDGES ═══════ */}
        <div
          style={{
            transform: `rotateY(-90deg) translateZ(${-CARD_THICKNESS / 2}px)`,
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: `${CARD_THICKNESS}px`,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
          }}
        />
        <div
          style={{
            transform: `rotateY(90deg) translateZ(calc(100% - ${CARD_THICKNESS / 2}px))`,
            position: "absolute",
            right: 0, top: 0, bottom: 0,
            width: `${CARD_THICKNESS}px`,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))",
          }}
        />
        <div
          style={{
            transform: `rotateX(90deg) translateZ(${-CARD_THICKNESS / 2}px)`,
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: `${CARD_THICKNESS}px`,
            background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
          }}
        />
        <div
          style={{
            transform: `rotateX(-90deg) translateZ(calc(100% - ${CARD_THICKNESS / 2}px))`,
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: `${CARD_THICKNESS}px`,
            background: "linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.6))",
          }}
        />

        {/* ═══════ SHINE EFFECT ═══════ */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 2.5,
            delay: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 4,
          }}
          className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </motion.div>
      </motion.div>

      {/* Rotation hint — fades in after peek completes */}
      {isInteractive && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 pointer-events-none"
        >
          <motion.span
            className="inline-flex items-center gap-1.5 text-white/25 text-[10px] font-body tracking-widest uppercase"
            animate={{ opacity: [0.2, 0.55, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span
              className="inline-block text-sm"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ↻
            </motion.span>
            rotate
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}
