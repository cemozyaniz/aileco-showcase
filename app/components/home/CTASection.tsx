"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/providers/LanguageProvider";
import AppStoreCTA from "@/app/components/AppStoreCTA";

function ScanIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4A853"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="2" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4A853"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4A853"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  // Refs for GSAP timeline targets
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // Reduced motion: render everything instantly, no tweens
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        [
          headingRef.current,
          subtextRef.current,
          featuresRef.current?.children,
          dividerRef.current,
          ctaRef.current,
          altRef.current,
          footerRef.current,
        ],
        { opacity: 1, y: 0, x: 0, scale: 1 }
      );
    });

    // Normal motion: scroll-triggered GSAP timeline
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const featureElements = featuresRef.current
        ? Array.from(featuresRef.current.children)
        : [];
      const altElements = altRef.current
        ? Array.from(altRef.current.children)
        : [];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      // 0ms — Heading fades up with subtle scale
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 }
      );

      // 300ms — Subtext fades up
      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        ">-0.4"
      );

      // 600ms — Feature items stagger in from left
      tl.fromTo(
        featureElements,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.15,
        },
        ">-0.3"
      );

      // 1050ms — Gold divider scales from center
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.inOut",
        },
        ">-0.1"
      );

      // 1150ms — App Store CTA slides up from below
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        ">-0.2"
      );

      // 1250ms — Alternative options (web app, shop) fade up
      tl.fromTo(
        altElements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
        ">-0.1"
      );

      // 1450ms — Footer tagline fades in
      tl.fromTo(
        footerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
        ">-0.2"
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, { scope: ref });

  return (
    <section
      ref={ref}
      id="cta"
      className="relative w-full flex flex-col items-center justify-center min-h-screen px-6 py-24 md:py-32 overflow-hidden"
    >
      {/* Gold radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(212,168,83,0.08) 0%, rgba(17,17,17,1) 60%)",
        }}
      />

      {/* Decorative top gradient edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/20 to-transparent" />

      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto"
      >
        {/* ===== Headline ===== */}
        <h2
          ref={headingRef}
          className="gsap-hidden font-heading text-5xl md:text-7xl lg:text-8xl font-light text-white mb-4 leading-tight tracking-tight"
        >
          {t("cta.heading")}
        </h2>

        {/* ===== Subtext ===== */}
        <p
          ref={subtextRef}
          className="gsap-hidden font-body text-base md:text-lg font-light text-white/50 max-w-md leading-relaxed mb-12"
        >
          {t("cta.subtitle")}
        </p>

        {/* ===== Feature List ===== */}
        <div
          ref={featuresRef}
          className="w-full max-w-sm space-y-3 mb-12"
        >
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#D4A853]/20 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
              <ScanIcon />
            </div>
            <span className="font-body text-sm text-white/70 leading-relaxed text-left">
              {t("cta.feature1")}
            </span>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#D4A853]/20 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
              <ProfileIcon />
            </div>
            <span className="font-body text-sm text-white/70 leading-relaxed text-left">
              {t("cta.feature2")}
            </span>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#D4A853]/20 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
              <ShieldIcon />
            </div>
            <span className="font-body text-sm text-white/70 leading-relaxed text-left">
              {t("cta.feature3")}
            </span>
          </div>
        </div>

        {/* ===== Gold Divider ===== */}
        <div
          ref={dividerRef}
          className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4A853]/40 to-transparent mb-8 origin-center"
        />

        {/* ===== App Store CTA (reused component) ===== */}
        <AppStoreCTA ref={ctaRef} variant="full" className="gsap-hidden max-w-sm" />

        {/* ===== Alternative Options (web app, shop) ===== */}
        <div ref={altRef} className="flex flex-col items-center gap-4 mt-6">
          <p className="font-body text-xs tracking-widest uppercase text-white/20">
            {t("cta.or")}
          </p>
          <a
            href="https://app.aileco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-base md:text-lg font-light text-[#D4A853] hover:text-[#e0b96a] transition-colors"
          >
            {t("cta.tryWebApp")}
          </a>
          <div className="w-12 h-px bg-white/10" />
          <a
            href="https://www.trendyol.com/aileco/smartchain-akilli-anahtarlik-aksesuar-kaybolmaz-dijital-hatirlatici-kartvizit-kisiye-ozel-etnik-p-924709248?boutiqueId=61&merchantId=836953"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body inline-block px-8 py-3 rounded-full border border-white/20 text-white text-xs font-semibold tracking-wide uppercase hover:bg-white/10 hover:border-[#D4A853]/40 transition-all"
          >
            {t("cta.shopNow")}
          </a>
        </div>

        {/* ===== Footer ===== */}
        <div ref={footerRef} className="gsap-hidden mt-14">
          <p className="font-heading text-sm font-light tracking-[0.3em] text-white/30 mb-4">
            {t("cta.tagline")}
          </p>
          <p className="font-body text-xs text-white/20">
            {t("cta.copyright")}
          </p>
        </div>
      </div>
    </section>
  );
}
