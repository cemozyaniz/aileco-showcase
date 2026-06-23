"use client";

import { type RefObject, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";

const images = [
  { src: "/images/smartchain-fc1.png", alt: "Smartchain Front 1" },
  { src: "/images/smartchain-fc2.png", alt: "Smartchain Front 2" },
  { src: "/images/smartchain-fc3.png", alt: "Smartchain Front 3" },
];

interface ProductRevealSectionProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  heroToProductProgress?: MotionValue<number>;
}

export default function ProductRevealSection({ scrollRef, heroToProductProgress }: ProductRevealSectionProps) {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // ─── Image Transitions ──────────────────────────────────────────

  const img1Opacity = useTransform(scrollYProgress, [0, 0.30, 0.40, 0.41], [1, 1, 0, 0]);
  const img1Scale = useTransform(scrollYProgress, [0, 0.29, 0.35, 0.40, 0.41], [1, 1, 1.02, 1.0, 1.0]);

  const img2Opacity = useTransform(scrollYProgress, [0.29, 0.30, 0.40, 0.60, 0.70, 0.71], [0, 0, 1, 1, 0, 0]);
  const img2Scale = useTransform(scrollYProgress, [0.29, 0.35, 0.40, 0.59, 0.65, 0.70, 0.71], [1, 1.02, 1.0, 1.0, 1.0, 1.02, 1.0]);

  const img3Opacity = useTransform(scrollYProgress, [0.59, 0.60, 0.70, 0.71], [0, 0, 1, 1]);
  const img3Scale = useTransform(scrollYProgress, [0.59, 0.65, 0.70, 0.71], [1, 1.02, 1.0, 1.0]);

  // ─── Per-Image Text ─────────────────────────────────────────────

  // Image 1 — visible 0.05–0.35
  const text1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.25, 0.35], [0, 1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0.05, 0.15], [40, 0]);

  // Image 2 — visible 0.28–0.63
  const text2Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.55, 0.63], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.28, 0.38], [40, 0]);

  // Image 3 — visible 0.58–0.95
  const text3Opacity = useTransform(scrollYProgress, [0.58, 0.65, 0.80, 0.95], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.58, 0.65], [40, 0]);

  // ─── Background Color ───────────────────────────────────────────

  const bgR = useTransform(scrollYProgress, [0, 0.30, 0.50, 0.70, 0.85, 1], [0, 0, 18, 18, 10, 10]);
  const bgG = useTransform(scrollYProgress, [0, 0.30, 0.50, 0.70, 0.85, 1], [0, 0, 14, 14, 10, 10]);
  const bgB = useTransform(scrollYProgress, [0, 0.30, 0.50, 0.70, 0.85, 1], [0, 0, 8, 8, 18, 18]);

  const bgColor = useMotionValue("rgb(0, 0, 0)");
  useMotionValueEvent(bgR, "change", (r: number) => {
    bgColor.set(`rgb(${Math.round(r)}, ${Math.round(bgG.get())}, ${Math.round(bgB.get())})`);
  });
  useMotionValueEvent(bgG, "change", (g: number) => {
    bgColor.set(`rgb(${Math.round(bgR.get())}, ${Math.round(g)}, ${Math.round(bgB.get())})`);
  });
  useMotionValueEvent(bgB, "change", (b: number) => {
    bgColor.set(`rgb(${Math.round(bgR.get())}, ${Math.round(bgG.get())}, ${Math.round(b)})`);
  });

  const imageStyles = [
    { opacity: img1Opacity, scale: img1Scale },
    { opacity: img2Opacity, scale: img2Scale },
    { opacity: img3Opacity, scale: img3Scale },
  ];

  // ─── Image Counter ──────────────────────────────────────────────

  const [activeImage, setActiveImage] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.30) setActiveImage(1);
    else if (v < 0.60) setActiveImage(2);
    else setActiveImage(3);
  });

  const counterOpacity = useTransform(scrollYProgress, [0.03, 0.08, 0.85, 0.95], [0, 1, 1, 0]);

  // ─── Hero Logo Bridge ───────────────────────────────────────────

  const progress = heroToProductProgress || useMotionValue(0);

  const incomingLogoOpacity = useTransform(progress, [0.75, 0.95, 1.1, 1.5], [0, 1, 1, 1]);
  const incomingLogoY = useTransform(progress, [0.75, 0.95], [-30, 0]);
  const incomingLogoScale = useTransform(progress, [0.75, 0.95], [0.6, 1]);

  // ─── Progress Dots (scale 0.5→1.2, opacity 0.2→1.0) ────────────

  const dotsOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.85, 0.95], [0, 1, 1, 0]);

  const dot1Scale = useTransform(scrollYProgress, [0.05, 0.20, 0.30, 0.36], [0.5, 1.2, 1.2, 0.5]);
  const dot2Scale = useTransform(scrollYProgress, [0.25, 0.38, 0.55, 0.63], [0.5, 1.2, 1.2, 0.5]);
  const dot3Scale = useTransform(scrollYProgress, [0.55, 0.65, 0.85, 1], [0.5, 1.2, 1.2, 0.5]);

  const dot1Opacity = useTransform(scrollYProgress, [0.05, 0.20, 0.30, 0.36], [0.2, 1, 1, 0.2]);
  const dot2Opacity = useTransform(scrollYProgress, [0.25, 0.38, 0.55, 0.63], [0.2, 1, 1, 0.2]);
  const dot3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.85, 1], [0.2, 1, 1, 0.2]);

  const dot1Color = useTransform(
    scrollYProgress,
    [0.05, 0.20, 0.36],
    ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(255,255,255,0.2)"]
  );
  const dot2Color = useTransform(
    scrollYProgress,
    [0.25, 0.38, 0.63],
    ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(255,255,255,0.2)"]
  );
  const dot3Color = useTransform(
    scrollYProgress,
    [0.55, 0.65, 1],
    ["rgba(255,255,255,0.2)", "rgba(212,168,83,1)", "rgba(212,168,83,1)"]
  );

  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: bgColor }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center">
        <motion.span
          className="mt-6 mb-2 font-heading text-xl md:text-2xl lg:text-3xl font-light tracking-[0.12em] text-white/60 select-none pointer-events-none"
          style={{
            opacity: incomingLogoOpacity,
            y: incomingLogoY,
            scale: incomingLogoScale,
          }}
        >
          aileco
        </motion.span>

        {/* ─── Text Block — one position, cross-fading ─────────────── */}
        <div className="relative text-center px-6 pointer-events-none min-h-[120px] flex items-center justify-center">
          <motion.div
            style={{ y: text1Y, opacity: text1Opacity }}
            className="absolute left-0 right-0"
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              {t("product.meet")}
            </h2>
            <p className="font-body text-base sm:text-lg font-light text-white/50 leading-relaxed mt-2">
              {t("product.moreThan")}
            </p>
          </motion.div>

          <motion.div
            style={{ y: text2Y, opacity: text2Opacity }}
            className="absolute left-0 right-0"
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              {t("product.img2.heading")}
            </h2>
            <p className="font-body text-base sm:text-lg font-light text-white/50 leading-relaxed mt-2">
              {t("product.img2.sub")}
            </p>
          </motion.div>

          <motion.div
            style={{ y: text3Y, opacity: text3Opacity }}
            className="absolute left-0 right-0"
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              {t("product.img3.heading")}
            </h2>
            <p className="font-body text-base sm:text-lg font-light text-white/50 leading-relaxed mt-2">
              {t("product.img3.sub")}
            </p>
          </motion.div>
        </div>

        {/* ─── Image Container ──────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-64 sm:w-80 md:w-96 relative" style={{ aspectRatio: "1 / 1" }}>
            {images.map((img, i) => (
              <motion.div
                key={img.src}
                style={imageStyles[i]}
                className="absolute inset-0"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full rounded-3xl shadow-2xl object-cover"
                />
              </motion.div>
            ))}

            {/* Image Counter */}
            <motion.div
              style={{ opacity: counterOpacity }}
              className="absolute top-3 right-3 font-mono text-[11px] text-white/30 tracking-[0.15em] pointer-events-none select-none"
            >
              {"0" + activeImage}&nbsp;/&nbsp;03
            </motion.div>
          </div>
        </div>

        {/* ─── Progress Dots ─────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: dotsOpacity }}
          className="flex items-center gap-0 mb-6"
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ scale: dot1Scale, opacity: dot1Opacity, backgroundColor: dot1Color }}
          />
          <div className="w-8 h-px bg-white/10" />
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ scale: dot2Scale, opacity: dot2Opacity, backgroundColor: dot2Color }}
          />
          <div className="w-8 h-px bg-white/10" />
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ scale: dot3Scale, opacity: dot3Opacity, backgroundColor: dot3Color }}
          />
        </motion.div>
      </div>
    </div>
  );
}
