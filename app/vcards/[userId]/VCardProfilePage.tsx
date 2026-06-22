"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslation } from "@/providers/LanguageProvider";
import VCardField from "@/app/components/VCardField";
import { downloadVCard } from "@/lib/vcard-utils";

interface VCardFieldData {
  label: string;
  value: string;
  fieldType: string;
}

interface VCardProfile {
  name: string;
  phone: string | null;
  email: string | null;
  fields: VCardFieldData[];
}

interface VCardProfilePageProps {
  profile: VCardProfile;
  userId: string;
}

export default function VCardProfilePage({ profile, userId }: VCardProfilePageProps) {
  const { t } = useTranslation();
  const hasAnyData = profile.phone || profile.email || (profile.fields && profile.fields.length > 0);
  const downloadTriggered = useRef(false);

  // Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Gather field elements as an array for type-safe GSAP targeting
    const fieldElements = fieldsRef.current
      ? Array.from(fieldsRef.current.children)
      : [];

    // Reduced motion: show everything instantly
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        [brandTextRef.current, cardRef.current, fieldsRef.current],
        { opacity: 1, y: 0, x: 0, scale: 1 }
      );
    });

    // Normal motion: staggered GSAP timeline
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();

      // 0ms — Brand text fades in
      tl.fromTo(
        brandTextRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      // 200ms — Profile card slides up + scales
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
        ">-0.2"
      );

      // 500ms — Contact fields stagger in from left
      tl.fromTo(
        fieldElements,
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        },
        ">-0.3"
      );
    });

    return () => mm.revert();
  }, { scope: containerRef });

  // Auto-download vCard on mount
  useEffect(() => {
    if (!downloadTriggered.current && hasAnyData) {
      downloadTriggered.current = true;
      const timer = setTimeout(() => {
        downloadVCard(profile.name, profile.phone, profile.email, profile.fields);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profile, hasAnyData]);

  const strokeColor = "rgba(255,255,255,0.5)";

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center px-6 py-12 relative overflow-hidden"
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(30,20,60,0.4) 0%, rgba(0,0,0,1) 70%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Brand text — GSAP fade-in */}
        <div ref={brandTextRef} className="gsap-hidden text-center mb-10">
          <span className="font-heading text-2xl font-light tracking-[0.15em] text-white/40">
            {t("vcard.brand")}
          </span>
        </div>

        {/* Profile card — GSAP slide-up */}
        <div
          ref={cardRef}
          className="gsap-hidden bg-white/[0.04] backdrop-blur-md rounded-3xl border border-white/[0.08] p-8 md:p-10"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-light text-white text-center mb-2">
            {profile.name}
          </h1>
          <p className="font-body text-sm text-white/25 text-center mb-8">
            AILE-{userId.padStart(5, "0")}
          </p>

          <div className="w-16 h-px bg-white/10 mx-auto mb-8" />

          {/* Contact fields — GSAP staggered children */}
          <div ref={fieldsRef}>
            {!hasAnyData && (
              <p className="text-center font-body text-white/40 py-8">
                {t("vcard.noContact")}
              </p>
            )}

            {profile.phone && (
              <div className="flex items-center gap-4 py-4 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-body font-medium uppercase tracking-[0.15em] text-white/30">
                    {t("vcard.phone")}
                  </p>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-lg font-body font-light text-white break-all hover:text-white/80 transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
            )}

            {profile.email && (
              <div className="flex items-center gap-4 py-4 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-body font-medium uppercase tracking-[0.15em] text-white/30">
                    {t("vcard.email")}
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-lg font-body font-light text-white break-all hover:text-white/80 transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            )}

            {profile.fields && profile.fields.length > 0 && (
              <div className={profile.phone || profile.email ? "mt-2" : ""}>
                {profile.fields.map((field, index) => (
                  <VCardField
                    key={`${field.label}-${index}`}
                    label={field.label}
                    value={field.value}
                    fieldType={field.fieldType}
                    isLast={index === profile.fields.length - 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add to Contacts button */}
          {hasAnyData && (
            <button
              onClick={() =>
                downloadVCard(profile.name, profile.phone, profile.email, profile.fields)
              }
              className="w-full mt-8 py-3 rounded-xl bg-[#D4A853]/15 border border-[#D4A853]/30
                       hover:bg-[#D4A853]/25 transition-all cursor-pointer
                       flex items-center justify-center gap-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4A853"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" strokeDasharray="2 2" />
              </svg>
              <span className="font-body text-sm font-semibold tracking-wide uppercase text-[#D4A853]">
                {t("vcard.addContact")}
              </span>
            </button>
          )}
        </div>

        <p className="text-center font-heading text-sm font-light tracking-[0.3em] text-white/20 mt-8">
          {t("vcard.brand")}
        </p>
      </div>
    </div>
  );
}
