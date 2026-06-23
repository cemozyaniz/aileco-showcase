"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useTranslation } from "@/providers/LanguageProvider";

function PawPrint({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity="0.03">
      <path d="M12 0C8.5 0 6 2 4.5 4.5S3 7 4 9.5c.5 1.5 2 3 3.5 3s3-1.5 3.5-3c1-2.5-.5-5-0.5-5S15.5 2 12 0zm-5.5 16c-1 0-2 .5-2 1.5s.5 2 1.5 2 2-.5 2-1.5-.5-2-1.5-2S5.5 15 6.5 16zm9 0c1 0 2 .5 2 1.5s-.5 2-1.5 2-2-.5-2-1.5.5-2 1.5-2S15.5 15 15.5 16zm-9 6c-1 0-1.5 1-1 2s.5 2 1.5 2 1.5-1 1.5-2-1-2-1.5-2S5 21 6.5 22zm9 0c1 0 1.5 1 1.5 2s-.5 2-1.5 2-1.5-1-1.5-2 1-2 1.5-2S15 21 15.5 22z" />
    </svg>
  );
}

interface PetSectionProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function PetSection({ scrollRef }: PetSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });

  // Wider fade range: visible from 0 to 0.15, stays, fades out 0.85 to 1
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Subtle parallax for the pet image
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref} className="relative w-full flex items-center justify-center px-6 py-10">
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(80,55,20,0.2) 0%, rgba(0,0,0,1) 65%)" }}
      >
        <PawPrint className="absolute top-[10%] left-[8%] w-14 h-14 text-amber-200" />
        <PawPrint className="absolute top-[20%] right-[12%] w-10 h-10 text-amber-200" />
        <PawPrint className="absolute bottom-[15%] left-[15%] w-12 h-12 text-amber-200" />
        <PawPrint className="absolute bottom-[25%] right-[8%] w-8 h-8 text-amber-200" />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light text-white mb-2 leading-tight">
            {t("pet.heading")}
          </h2>
          <p className="font-body text-base md:text-lg font-light text-white/50 mb-4 md:mb-6 max-w-md mx-auto leading-relaxed">
            {t("pet.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ y: imgY }}
        >
          <img
            src="/images/smartchain-on-pet.png"
            alt="Smartchain on Collar"
            className="w-56 sm:w-64 md:w-72 mx-auto rounded-2xl shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
