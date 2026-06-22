"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, type MotionValue } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";

interface HeroSectionProps {
  onExplore?: () => void;
  heroToProductProgress?: MotionValue<number>;
}

export default function HeroSection({ onExplore, heroToProductProgress }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const { t } = useTranslation();

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 1.08]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  const progress = heroToProductProgress || useMotionValue(0);

  const logoY = useTransform(progress, [0, 1], [0, 400]);
  const logoOpacity = useTransform(progress, [0.6, 1], [1, 0]);
  const logoScale = useTransform(progress, [0, 1], [1, 0.6]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(60,40,20,0.25) 0%, rgba(0,0,0,1) 70%)" }}
      />

      <motion.div style={{ opacity, scale, y }} className="absolute inset-0 z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-[15%] left-1/2 -translate-x-1/2 font-heading text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] text-white select-none"
          style={{ y: logoY, opacity: logoOpacity, scale: logoScale }}
        >
          aileco
        </motion.span>

        <div className="absolute bottom-[25%] inset-x-0 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-heading text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight"
          >
            {t("hero.productName")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="font-body mt-2 md:mt-3 text-base md:text-lg font-light text-white/50 leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-6 md:mt-8"
          >
            <a
              href="#cta"
              className="font-body border border-white/30 text-white px-8 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase hover:bg-white/10 transition-all text-center"
            >
              {t("hero.explore")}
            </a>
            <a
              href="https://www.trendyol.com/aileco/smartchain-akilli-anahtarlik-aksesuar-kaybolmaz-dijital-hatirlatici-kartvizit-kisiye-ozel-etnik-p-924709248?boutiqueId=61&merchantId=836953"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body bg-[#D4A853] text-black px-8 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase hover:bg-[#c49a48] transition-all text-center"
            >
              {t("hero.shop")}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
