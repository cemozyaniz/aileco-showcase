"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";
import { QRCodeSVG } from "qrcode.react";

const fields = [
  { label: "Name", value: "AileCo", icon: "user" },
  { label: "Phone", value: "+90 5xx xxx xx xx", icon: "phone" },
  { label: "Email", value: "hello@aileco.com", icon: "email" },
  { label: "Instagram", value: "@aileco", icon: "social" },
  { label: "Website", value: "aileco.com", icon: "link" },
];

const iconPaths: Record<string, string> = {
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  phone: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  email: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  social: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
};

interface VCardSectionProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function VCardSection({ scrollRef }: VCardSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });

  const heading1Opacity = useTransform(scrollYProgress, [0.02, 0.12, 0.85, 0.95], [0, 1, 1, 0]);
  const heading2Opacity = useTransform(scrollYProgress, [0.06, 0.16, 0.85, 0.95], [0, 1, 1, 0]);

  const qrOpacity = useTransform(scrollYProgress, [0.08, 0.18, 0.28, 0.38], [0, 1, 1, 0]);
  const qrScale = useTransform(scrollYProgress, [0.08, 0.18, 0.38], [0.8, 1, 0.9]);
  const scanLineY = useTransform(scrollYProgress, [0.15, 0.32], [0, 100]);
  const qrGlowOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.32, 0.38], [0, 0.15, 0.15, 0]);
  const qrCaptionOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.28, 0.36], [0, 1, 1, 0]);

  // Fields start appearing earlier (0.25 instead of 0.33) to overlap with QR
  const fieldsOpacity = useTransform(scrollYProgress, [0.25, 0.40, 0.85, 0.95], [0, 1, 1, 0]);
  const fieldsY = useTransform(scrollYProgress, [0.25, 0.40], [20, 0]);

  const fieldAnimations = fields.map((_, i) => {
    const start = 0.28 + i * 0.04; // shifted earlier accordingly
    const peak = start + 0.06;
    return {
      opacity: useTransform(scrollYProgress, [start, peak, peak + 0.02, 0.85, 0.95], [0, 0.5, 1, 1, 0]),
      y: useTransform(scrollYProgress, [start, peak], [40, 0]),
      scale: useTransform(scrollYProgress, [start, peak], [0.85, 1]),
    };
  });

  // ─── 2-segment progress dots: Scan / Fields ────────────────────
  const dotsOpacity = useTransform(scrollYProgress, [0.06, 0.16, 0.85, 0.95], [0, 1, 1, 0]);

  const dot1Scale = useTransform(scrollYProgress, [0.06, 0.15, 0.30, 0.38], [0.5, 1.2, 1.2, 0.5]);
  const dot2Scale = useTransform(scrollYProgress, [0.30, 0.45, 0.80, 0.90], [0.5, 1.2, 1.2, 0.5]);

  const dot1Opacity = useTransform(scrollYProgress, [0.06, 0.15, 0.30, 0.38], [0.2, 1, 1, 0.2]);
  const dot2Opacity = useTransform(scrollYProgress, [0.30, 0.45, 0.80, 0.90], [0.2, 1, 1, 0.2]);

  const dot1Color = useTransform(
    scrollYProgress,
    [0.06, 0.15, 0.38],
    ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(255,255,255,0.2)"]
  );
  const dot2Color = useTransform(
    scrollYProgress,
    [0.30, 0.45, 0.90],
    ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(212,168,83,1)"]
  );

  return (
    <div ref={ref} className="relative w-full flex flex-col items-center px-4 md:px-6 py-10 min-h-screen">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(212,168,83,0.06) 0%, rgba(0,0,0,1) 60%)" }}
      />

      <motion.div
        style={{ opacity: heading1Opacity }}
        className="relative z-10 text-center mb-2 shrink-0"
      >
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
          {t("vcard.heading1")}
        </h2>
      </motion.div>

      <motion.div
        style={{ opacity: heading2Opacity }}
        className="relative z-10 text-center mb-4 md:mb-6 shrink-0"
      >
        <p className="font-heading text-xl md:text-2xl lg:text-3xl font-light text-[#D4A853]/80 leading-tight">
          {t("vcard.heading2")}
        </p>
      </motion.div>

      <div className="relative z-10 flex-1 flex items-center justify-center w-full">
        <div className="relative w-full max-w-sm md:max-w-md mx-auto">
          <motion.div
            style={{ opacity: fieldsOpacity, y: fieldsY }}
            className="w-full"
          >
            <div className="space-y-3">
              {fields.map((field, i) => (
                <motion.div
                  key={field.label}
                  style={{
                    opacity: fieldAnimations[i].opacity,
                    y: fieldAnimations[i].y,
                    scale: fieldAnimations[i].scale,
                  }}
                  className="bg-white/[0.04] rounded-xl px-4 py-3 border border-white/[0.06] flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPaths[field.icon] || iconPaths.user} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-white/30">{field.label}</p>
                    <p className="font-body text-base md:text-lg font-light text-white leading-relaxed">{field.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: qrOpacity, scale: qrScale }}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <div className="p-4">
                  <QRCodeSVG
                    value="https://aileco.com"
                    size={144}
                    level="M"
                    fgColor="rgba(255,255,255,0.9)"
                    bgColor="transparent"
                  />
                </div>
                {/* Enhanced scan line — 2px gold gradient */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4A853]/80 to-transparent shadow-[0_0_16px_rgba(212,168,83,0.6)] pointer-events-none"
                  style={{ top: scanLineY }}
                />
              </div>
              <motion.div
                className="absolute rounded-2xl pointer-events-none"
                style={{
                  boxShadow: `0 0 60px rgba(212,168,83,${qrGlowOpacity})`,
                }}
              />
              <motion.p
                style={{ opacity: qrCaptionOpacity }}
                className="font-body text-base md:text-lg font-light text-white/40 leading-relaxed mt-4"
              >
                {t("vcard.scanText")}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── 2-segment progress dots: Scan / Fields ──────────────── */}
      <motion.div
        style={{ opacity: dotsOpacity }}
        className="relative z-10 flex items-center gap-0 mt-8 shrink-0"
      >
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ scale: dot1Scale, opacity: dot1Opacity, backgroundColor: dot1Color }}
          />
          <span className="font-body text-[10px] tracking-[0.12em] uppercase text-white/30">Scan</span>
        </div>
        <div className="w-8 h-px bg-white/10 mt-[-14px]" />
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ scale: dot2Scale, opacity: dot2Opacity, backgroundColor: dot2Color }}
          />
          <span className="font-body text-[10px] tracking-[0.12em] uppercase text-white/30">Fields</span>
        </div>
      </motion.div>
    </div>
  );
}
