"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";
import StatusBadge from "./StatusBadge";
import OwnerInfo from "./OwnerInfo";
import PrivacyMessage from "./PrivacyMessage";

interface VCardField {
  label: string;
  value: string;
  fieldType: string;
}

interface Card3DProps {
  uniqueCode: string;
  attachedName?: string;
  attachedToType?: string | null;
  createdAt?: string | null;
  mode?: string | null;
  isFlipped: boolean;
  isRevealed: boolean;
  cardScale: number;
  showTilt: boolean;
  ownerName?: string;
  ownerPhoneNumber?: string | null;
  ownerEmail?: string | null;
  ownerVCardFields?: VCardField[];
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

/** Map backend mode strings to StatusBadge status */
function toBadgeStatus(mode?: string | null): "active" | "lost" | "stolen" {
  if (mode === "lost") return "lost";
  if (mode === "stolen") return "stolen";
  return "active";
}

export default function Card3D({
  uniqueCode,
  attachedName,
  attachedToType,
  createdAt,
  mode,
  isFlipped,
  isRevealed,
  cardScale,
  showTilt,
  ownerName,
  ownerPhoneNumber,
  ownerEmail,
  ownerVCardFields,
  children,
}: Card3DProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!showTilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * -12, y: x * 12 });
    },
    [showTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const cardShadow = isFlipped
    ? "0 25px 60px -15px rgba(0,0,0,0.7)"
    : isRevealed
      ? "0 20px 50px -10px rgba(99,102,241,0.15), 0 0 30px rgba(99,102,241,0.08)"
      : "0 25px 50px -12px rgba(0,0,0,0.5)";

  const badgeStatus = toBadgeStatus(mode);
  const badgeLabel =
    mode === "lost"
      ? t("smartchain.status.lost")
      : mode === "stolen"
        ? t("smartchain.status.stolen")
        : t("smartchain.status.active");

  const copiableCode = uniqueCode.startsWith("http") ? uniqueCode.split("/").pop() || uniqueCode : uniqueCode;
  const typeLabel = attachedToType && typeLabels[attachedToType] ? typeLabels[attachedToType] : null;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: isFlipped ? 180 + tilt.y : tilt.y,
        scale: cardScale,
      }}
      transition={{
        rotateY: { duration: 1.3, ease: [0.4, 0, 0.2, 1] },
        rotateX: { duration: 0.3, ease: "easeOut" },
        scale: { type: "spring", stiffness: 100, damping: 20 },
      }}
      style={{
        transformStyle: "preserve-3d",
        boxShadow: cardShadow,
      }}
      className="relative cursor-default
        w-[280px] h-[440px] sm:w-[320px] sm:h-[480px] lg:w-[340px] lg:h-[500px]"
    >
      {/* ═══════ FRONT FACE ═══════ */}
      <div
        style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }}
        className="rounded-2xl overflow-hidden"
      >
        {children}
      </div>

      {/* ═══════ BACK FACE — Product + Owner Info ═══════ */}
      <div
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          position: "absolute",
          inset: 0,
        }}
        className="rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800"
      >
        <div className="relative w-full h-full flex flex-col p-4 sm:p-5">
          {/* Status Badge — top right */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
            <StatusBadge status={badgeStatus} isVisible={true} label={badgeLabel} />
          </div>

          {/* Product info section — top */}
          <div className="shrink-0 pt-1">
            <h2 className="text-base sm:text-lg font-medium text-white pr-20 leading-tight">
              {attachedName || t("smartchain.defaultName")}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-[10px] font-mono text-zinc-500 tracking-wider">{copiableCode}</code>
              <button
                className="text-zinc-600 hover:text-zinc-400 transition-colors"
                title="Copy code"
                onClick={() => navigator.clipboard.writeText(copiableCode).catch(() => {})}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {typeLabel && (
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                  {typeLabel}
                </span>
              )}
              {formattedDate && (
                <span className="text-[10px] text-zinc-600">{formattedDate}</span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/[0.06] my-3 shrink-0" />

          {/* Bottom section — Owner Info or Privacy Message */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {ownerName ? (
              <OwnerInfo
                name={ownerName}
                phoneNumber={ownerPhoneNumber ?? null}
                email={ownerEmail ?? null}
                vCardFields={ownerVCardFields}
                isVisible={true}
              />
            ) : (
              <PrivacyMessage isVisible={true} />
            )}
          </div>
        </div>
      </div>

      {/* ═══════ CARD THICKNESS EDGES ═══════ */}
      <div
        style={{
          transform: `rotateY(-90deg) translateZ(${-CARD_THICKNESS / 2}px)`,
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${CARD_THICKNESS}px`,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
        }}
      />
      <div
        style={{
          transform: `rotateY(90deg) translateZ(calc(100% - ${CARD_THICKNESS / 2}px))`,
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: `${CARD_THICKNESS}px`,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))",
        }}
      />
      <div
        style={{
          transform: `rotateX(90deg) translateZ(${-CARD_THICKNESS / 2}px)`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${CARD_THICKNESS}px`,
          background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
        }}
      />
      <div
        style={{
          transform: `rotateX(-90deg) translateZ(calc(100% - ${CARD_THICKNESS / 2}px))`,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
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
  );
}
