"use client";

import { useRef, useState, useMemo, type RefObject } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";
import { QRCodeSVG } from "qrcode.react";

interface TwoFacesSectionProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function TwoFacesSection({ scrollRef }: TwoFacesSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [text1CharCount, setText1CharCount] = useState(0);
  const [text2CharCount, setText2CharCount] = useState(0);
  const { t } = useTranslation();

  const fullText1 = t("twoFaces.line1");
  const fullText2 = t("twoFaces.line2");
  const fullText1Length = useMemo(() => fullText1.length, [fullText1]);
  const fullText2Length = useMemo(() => fullText2.length, [fullText2]);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const cardX = useTransform(scrollYProgress, [0, 0.25], ["-80%", "0%"]);
  const cardY = useTransform(scrollYProgress, [0, 0.25], ["40%", "0%"]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.05, 0.85, 0.95], [0, 1, 1, 0]);
  const flipAngle = useTransform(scrollYProgress, [0.40, 0.60], [0, 180]);
  const shadowBlur = useTransform(scrollYProgress, [0, 0.25], [0, 60]);
  const cardShadow = useTransform(shadowBlur, (v) => `0 20px ${Math.round(v)}px rgba(0,0,0,0.5)`);
  const text1Opacity = useTransform(scrollYProgress, [0.38, 0.48], [1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.85, 0.95], [0, 1, 1, 0]);

  // ─── Gold pulse shaft before flip (0.33–0.43) ──────────────────
  const pulseShaftX = useTransform(scrollYProgress, [0.33, 0.38, 0.43, 0.48], [0, 1, 1, 0]);
  const pulseShaftOpacity = useTransform(scrollYProgress, [0.33, 0.38, 0.43, 0.48], [0, 0.6, 0.6, 0]);

  // ─── 2-segment progress dots: Front / Back ─────────────────────
  const dotsOpacity = useTransform(scrollYProgress, [0.08, 0.18, 0.82, 0.92], [0, 1, 1, 0]);

  const dot1Scale = useTransform(scrollYProgress, [0.08, 0.20, 0.40, 0.45], [0.5, 1.2, 1.2, 0.5]);
  const dot2Scale = useTransform(scrollYProgress, [0.38, 0.52, 0.80, 0.90], [0.5, 1.2, 1.2, 0.5]);

  const dot1Opacity = useTransform(scrollYProgress, [0.08, 0.20, 0.40, 0.45], [0.2, 1, 1, 0.2]);
  const dot2Opacity = useTransform(scrollYProgress, [0.38, 0.52, 0.80, 0.90], [0.2, 1, 1, 0.2]);

  const dot1Color = useTransform(
    scrollYProgress,
    [0.08, 0.20, 0.45],
    ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(255,255,255,0.2)"]
  );
  const dot2Color = useTransform(
    scrollYProgress,
    [0.38, 0.52, 0.90],
    ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(212,168,83,1)"]
  );

  // ─── Typewriter ────────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const t1 = Math.floor(((v - 0.10) / 0.30) * fullText1Length);
    setText1CharCount(Math.max(0, Math.min(t1, fullText1Length)));

    const t2 = Math.floor(((v - 0.55) / 0.30) * fullText2Length);
    setText2CharCount(Math.max(0, Math.min(t2, fullText2Length)));
  });

  const text1Typing = text1CharCount < fullText1Length;
  const text2Typing = text2CharCount < fullText2Length;

  return (
    <div ref={ref} className="relative w-full flex items-center justify-center min-h-screen px-6 py-8 md:py-12">
      <motion.div style={{ opacity: cardOpacity }} className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <div className="relative w-[240px] h-[360px] md:w-[280px] md:h-[420px] flex-shrink-0">
            <motion.div className="w-full h-full md:hidden" style={{ y: cardY }}>
              <CardFlip flipAngle={flipAngle} cardShadow={cardShadow} />
            </motion.div>
            <motion.div className="hidden md:block w-full h-full" style={{ x: cardX }}>
              <CardFlip flipAngle={flipAngle} cardShadow={cardShadow} />
            </motion.div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <motion.div
              style={{ opacity: text1Opacity }}
              className="min-h-[60px] md:min-h-[100px] flex items-center justify-center md:justify-start"
            >
              <p className="font-heading text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
                {fullText1.slice(0, text1CharCount)}
                {text1Typing && <span className="typewriter-cursor text-[#D4A853] ml-0.5">│</span>}
              </p>
            </motion.div>

            <motion.div
              className="min-h-[60px] md:min-h-[100px] flex items-center justify-center md:justify-start"
              style={{ opacity: text2Opacity }}
            >
              <p className="font-heading text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
                {fullText2.slice(0, text2CharCount)}
                {text2Typing && <span className="typewriter-cursor text-[#D4A853] ml-0.5">│</span>}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ─── Gold pulse shaft before card flip ────────────────── */}
        <motion.div
          style={{ scaleX: pulseShaftX, opacity: pulseShaftOpacity }}
          className="h-px bg-gradient-to-r from-transparent via-[#D4A853] to-transparent origin-center mt-8 max-w-[200px] mx-auto"
        />
      </motion.div>

      {/* ─── 2-segment progress dots: Front / Back ──────────────── */}
      <motion.div
        style={{ opacity: dotsOpacity }}
        className="absolute bottom-10 flex items-center gap-0"
      >
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ scale: dot1Scale, opacity: dot1Opacity, backgroundColor: dot1Color }}
          />
          <span className="font-body text-[10px] tracking-[0.12em] uppercase text-white/30">Front</span>
        </div>
        <div className="w-8 h-px bg-white/10 mt-[-14px]" />
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ scale: dot2Scale, opacity: dot2Opacity, backgroundColor: dot2Color }}
          />
          <span className="font-body text-[10px] tracking-[0.12em] uppercase text-white/30">Back</span>
        </div>
      </motion.div>
    </div>
  );
}

function CardFlip({
  flipAngle,
  cardShadow,
}: {
  flipAngle: MotionValue<number>;
  cardShadow: MotionValue<string>;
}) {
  return (
    <div className="w-full h-full" style={{ perspective: "1200px" }}>
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
          rotateY: flipAngle,
          boxShadow: cardShadow,
        }}
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
          <img src="/images/smartchain-design.jpg" alt="Design Face" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="p-6">
            <QRCodeSVG
              value="https://aileco.com"
              size={200}
              level="M"
              fgColor="rgba(255,255,255,0.9)"
              bgColor="transparent"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
