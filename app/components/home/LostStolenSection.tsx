"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";

interface ModeCardProps {
  mode: "normal" | "lost" | "stolen";
}

function ModeCard({ mode }: ModeCardProps) {
  const { t } = useTranslation();
  const config = {
    normal: {
      dotColor: "bg-emerald-400",
      badgeBg: "bg-emerald-500/10",
      badgeText: "text-emerald-400",
      labelKey: "lostStolen.normalMode" as const,
      titleKey: "lostStolen.normal.title" as const,
      subKey: "lostStolen.normal.sub" as const,
    },
    lost: {
      dotColor: "bg-amber-400",
      badgeBg: "bg-amber-500/10",
      badgeText: "text-amber-400",
      labelKey: "lostStolen.lostMode" as const,
      titleKey: "lostStolen.lost.title" as const,
      subKey: "lostStolen.lost.sub" as const,
      pulse: true,
    },
    stolen: {
      dotColor: "bg-red-400",
      badgeBg: "bg-red-500/10",
      badgeText: "text-red-400",
      labelKey: "lostStolen.stolenMode" as const,
      titleKey: "lostStolen.stolen.title" as const,
      subKey: "lostStolen.stolen.sub" as const,
      pulse: true,
      strongPulse: true,
    },
  }[mode];

  return (
    <div className="bg-white/[0.04] backdrop-blur-md rounded-3xl border border-white/[0.08] max-w-lg mx-auto p-6 md:p-8">
      <div className={`font-body inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${config.badgeBg} ${config.badgeText} mb-4`}>
        <span className="relative flex h-2 w-2">
          {"pulse" in config && (
            <span className={`absolute inline-flex h-full w-full ${config.dotColor} rounded-full opacity-75 animate-ping`} />
          )}
          <span className={`relative inline-flex h-2 w-2 ${config.dotColor} rounded-full`} />
        </span>
        {t(config.labelKey)}
      </div>
      <p className="font-body text-lg md:text-xl font-light text-white/80 leading-relaxed">
        {t(config.titleKey)}
      </p>
      <p className="font-body text-sm font-light text-white/50 mt-2 leading-relaxed">
        {t(config.subKey)}
      </p>
    </div>
  );
}

interface LostStolenSectionProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function LostStolenSection({ scrollRef }: LostStolenSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });

  const headingOpacity = useTransform(scrollYProgress, [0.02, 0.15, 0.8, 0.9], [0, 1, 1, 0]);

  const normalOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.30, 0.35], [0, 1, 1, 0]);
  const lostOpacity = useTransform(scrollYProgress, [0.30, 0.35, 0.55, 0.65], [0, 1, 1, 0]);
  const stolenOpacity = useTransform(scrollYProgress, [0.60, 0.65, 0.82, 0.88], [0, 1, 1, 0]);

  const glowOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.85, 0.95], [0, 1, 1, 0]);
  const glowR = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.85], [0, 245, 239, 239]);
  const glowG = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.85], [0, 158, 68, 68]);
  const glowB = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.85], [0, 11, 68, 68]);
  const glowAlpha = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.85], [0, 0.08, 0.12, 0.12]);

  const borderR = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [255 * 0.08, 255 * 0.08, 245 * 0.2, 239 * 0.3]);
  const borderG = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [255 * 0.08, 255 * 0.08, 158 * 0.2, 68 * 0.3]);
  const borderB = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [255 * 0.08, 255 * 0.08, 11 * 0.2, 68 * 0.3]);

  const borderColor = useTransform(
    [borderR, borderG, borderB],
    ([r, g, b]) => `rgba(${Math.round(r as number)}, ${Math.round(g as number)}, ${Math.round(b as number)}, 0.6)`
  );

  const glowColor = useTransform(
    [glowR, glowG, glowB, glowAlpha],
    ([r, g, b, a]) => `rgba(${Math.round(r as number)}, ${Math.round(g as number)}, ${Math.round(b as number)}, ${a})`
  );

  return (
    <div ref={ref} className="relative w-full px-6 py-16 min-h-screen flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(60,20,10,0.15) 0%, rgba(0,0,0,1) 60%)" }}
      />

      <motion.div
        style={{ opacity: headingOpacity }}
        className="relative z-10 text-center pt-10 md:pt-16 mb-6 md:mb-2 shrink-0"
      >
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2 leading-tight">
          {t("lostStolen.heading")}
        </h2>
        <p className="font-heading text-xl md:text-2xl font-light text-white/50 leading-tight">
          {t("lostStolen.subheading")}
        </p>
      </motion.div>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 max-w-xl mx-auto rounded-full blur-[100px] pointer-events-none"
          style={{ opacity: glowOpacity, backgroundColor: glowColor }}
        />

        <div className="relative w-full max-w-lg mx-auto">
          <motion.div style={{ opacity: normalOpacity }}>
            <div style={{ borderColor: borderR.get() ? undefined : undefined }}>
              <ModeCard mode="normal" />
            </div>
          </motion.div>

          <motion.div className="absolute inset-0" style={{ opacity: lostOpacity }}>
            <ModeCard mode="lost" />
          </motion.div>

          <motion.div className="absolute inset-0" style={{ opacity: stolenOpacity }}>
            <ModeCard mode="stolen" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
