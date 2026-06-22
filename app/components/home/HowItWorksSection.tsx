"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";

interface StepCardProps {
  step: "attach" | "scan" | "connect";
}

function StepCard({ step }: StepCardProps) {
  const { t } = useTranslation();
  const config = {
    attach: {
      textKey: "howItWorks.attach" as const,
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v-2M12 22v-2M4 12H2M22 12h-2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      outline: (
        <div className="w-20 h-28 md:w-24 md:h-32 rounded-2xl border border-dashed border-white/[0.08]" />
      ),
    },
    scan: {
      textKey: "howItWorks.scan" as const,
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#D4A853]/40">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="3" height="3" />
          <rect x="18" y="14" width="3" height="3" />
          <rect x="14" y="18" width="3" height="3" />
          <rect x="18" y="18" width="3" height="3" />
        </svg>
      ),
      scanLine: true,
    },
    connect: {
      textKey: "howItWorks.connect" as const,
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400/40">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      contactMock: (
        <div className="space-y-2 w-full max-w-[200px]">
          <div className="h-2.5 bg-white/[0.08] rounded-full w-3/4" />
          <div className="h-2 bg-white/[0.05] rounded-full w-1/2" />
          <div className="h-px bg-white/[0.06] my-2" />
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-white/[0.06]" />
            <div className="h-2 bg-white/[0.05] rounded-full w-2/3" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-white/[0.06]" />
            <div className="h-2 bg-white/[0.05] rounded-full w-1/2" />
          </div>
        </div>
      ),
    },
  }[step];

  return (
    <div className="bg-white/[0.04] backdrop-blur-md rounded-3xl border border-white/[0.08] w-[300px] md:w-[360px] h-[250px] md:h-[300px] mx-auto flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {"outline" in config && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          {config.outline}
        </div>
      )}
      {"scanLine" in config && (
        <div className="absolute left-6 right-6 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-24 h-24">
            <div className="absolute left-0 right-0 h-px bg-[#D4A853]/30 animate-pulse" style={{ top: "30%" }} />
          </div>
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {config.icon}
        {step === "connect" && "contactMock" in config && (
          <div className="mt-2">
            {config.contactMock}
          </div>
        )}
      </div>
      <p className="font-body absolute bottom-6 md:bottom-8 text-lg md:text-xl font-light text-white/70 text-center px-4 leading-relaxed">
        {t(config.textKey)}
      </p>
    </div>
  );
}

interface HowItWorksSectionProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function HowItWorksSection({ scrollRef }: HowItWorksSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });

  const headingOpacity = useTransform(scrollYProgress, [0.02, 0.12, 0.8, 0.92], [0, 1, 1, 0]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.06, 0.16, 0.8, 0.92], [0, 1, 1, 0]);

  const attachOpacity = useTransform(scrollYProgress, [0.12, 0.25, 0.35, 0.36], [0, 1, 1, 0]);
  const scanOpacity = useTransform(scrollYProgress, [0.24, 0.30, 0.35, 0.55, 0.65, 0.66], [0, 0, 1, 1, 0, 0]);
  const connectOpacity = useTransform(scrollYProgress, [0.59, 0.65, 0.70, 0.71, 0.82, 0.88], [0, 0, 1, 1, 1, 0]);

  const dotsOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.82, 0.92], [0, 1, 1, 0]);

  const dot1Scale = useTransform(scrollYProgress, [0.12, 0.25, 0.35, 0.45], [0.6, 1, 1, 0.6]);
  const dot2Scale = useTransform(scrollYProgress, [0.24, 0.35, 0.55, 0.65, 0.75], [0.6, 0.6, 1, 1, 0.6]);
  const dot3Scale = useTransform(scrollYProgress, [0.54, 0.65, 0.75, 0.82], [0.6, 0.6, 1, 1]);

  const dot1Color = useTransform(scrollYProgress, [0.12, 0.25, 0.35], ["rgba(212,168,83,1)", "rgba(212,168,83,1)", "rgba(255,255,255,0.2)"]);
  const dot2Color = useTransform(scrollYProgress, [0.24, 0.35, 0.55, 0.65], ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(212,168,83,1)", "rgba(255,255,255,0.2)"]);
  const dot3Color = useTransform(scrollYProgress, [0.54, 0.65, 0.75], ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(212,168,83,1)"]);

  return (
    <div ref={ref} className="relative w-full flex flex-col items-center px-6 py-16 min-h-screen">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.05) 0%, rgba(0,0,0,1) 60%)" }}
      />

      <motion.div
        style={{ opacity: headingOpacity }}
        className="relative z-10 text-center mb-2 shrink-0"
      >
        <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
          {t("howItWorks.heading")}
        </h2>
      </motion.div>

      <motion.div
        style={{ opacity: subtitleOpacity }}
        className="relative z-10 text-center mb-6 md:mb-8 shrink-0"
      >
        <p className="font-body text-base md:text-lg font-light text-white/40 leading-relaxed">
          {t("howItWorks.subheading")}
        </p>
      </motion.div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-md mx-auto">
          <motion.div style={{ opacity: attachOpacity }}>
            <StepCard step="attach" />
          </motion.div>

          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: scanOpacity }}>
            <StepCard step="scan" />
          </motion.div>

          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: connectOpacity }}>
            <StepCard step="connect" />
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: dotsOpacity }}
          className="flex items-center gap-0 mt-6 md:mt-8"
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ scale: dot1Scale, backgroundColor: dot1Color }}
          />
          <div className="w-8 h-px bg-white/10" />
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ scale: dot2Scale, backgroundColor: dot2Color }}
          />
          <div className="w-8 h-px bg-white/10" />
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ scale: dot3Scale, backgroundColor: dot3Color }}
          />
        </motion.div>
      </div>
    </div>
  );
}
