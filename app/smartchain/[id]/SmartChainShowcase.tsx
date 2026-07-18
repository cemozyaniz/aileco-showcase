"use client";

import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Card3D from "@/app/components/Card3D";
import CoBrandingBar, { type Collaboration } from "@/app/components/CoBrandingBar";
import { useTranslation } from "@/providers/LanguageProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

export interface VCardField {
  label: string;
  value: string;
  fieldType: string;
}

export interface SmartChainData {
  id: number | null;
  uniqueCode: string;
  attachedName: string;
  attachedToType: string | null;
  mode: string | null;
  isProfilePublic: boolean | null;
  createdAt: string | null;
  owner: {
    id: number;
    name: string | null;
    phoneNumber: string | null;
    email: string | null;
    vCardFields?: VCardField[];
  } | null;
  isVisible: boolean;
  status: string | null;
  collaboration?: Collaboration | null;
}

interface TreeInfo {
  publicId: string;
  treeName: string | null;
  growthStage: string;
  activationAt: string | null;
  ownerDisplayName: string | null;
  xCoord: number;
  yCoord: number;
}

const STAGE_TO_SPRITE: Record<string, number> = {
  seed: 8, sprout: 0, sapling: 3, young: 5, mature: 5, ancient: 7,
};

export default function SmartChainShowcase({ data, tree }: { data: SmartChainData; tree: TreeInfo | null }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showTilt, setShowTilt] = useState(true);
  const { t, language } = useTranslation();

  // Refs for GSAP targeting
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const homeLinkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Gather particle elements as array for type-safe GSAP targets
    const particleElements = particlesRef.current
      ? Array.from(particlesRef.current.children)
      : [];

    // Reduced motion: show everything instantly, no tweens
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        [
          particlesRef.current,
          cardWrapperRef.current,
          glowRef.current,
          homeLinkRef.current,
        ],
        { opacity: 1, y: 0, scale: 1 }
      );
      setIsFlipped(true);
      setIsRevealed(true);
    });

    // Normal motion: full GSAP timeline
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();

      // 0ms — Particles fade in
      tl.fromTo(
        particleElements,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // 0ms — Home link slides in from left
      tl.fromTo(
        homeLinkRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
        "<"
      );

      // 0ms — Card floats up + scales in
      tl.fromTo(
        cardWrapperRef.current,
        { opacity: 0, y: 40, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
        "<"
      );

      // 200ms — Gold glow pulse behind card
      tl.to(
        glowRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        "+=0.2"
      );

      // 700ms — Card flips (Card3D handles the actual rotateY via framer-motion)
      tl.call(() => {
        setIsFlipped(true);
        setShowTilt(false);
      }, [], "+=0.5");

      // 2400ms — Card scales to 0.9 (revealed state)
      tl.call(() => {
        setIsRevealed(true);
      }, [], "+=0.8");
    });

    // Cleanup all matchMedia listeners on unmount
    return () => mm.revert();
  }, { scope: containerRef });

  // Geolocation and scan notification
  useEffect(() => {
    const sendNotificationBridge = (lat: number | null, lng: number | null) => {
      fetch(`${API_URL}/smartchains/public/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unique_code: data.uniqueCode,
          latitude: lat,
          longitude: lng,
        }),
      }).catch((err) => {
        console.debug("Scan notification failed:", err);
      });
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendNotificationBridge(latitude, longitude);
        },
        () => {
          sendNotificationBridge(null, null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      sendNotificationBridge(null, null);
    }
  }, [data.uniqueCode]);

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-black">
      {/* Fixed background gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(30,20,60,0.4) 0%, rgba(0,0,0,1) 70%)",
          }}
        />
      </div>

      {/* GSAP-animated floating particles — atmosphere */}
      <div
        ref={particlesRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      >
        <div className="absolute rounded-full bg-white/[0.03] w-[4px] h-[4px] left-[10%] top-[20%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[3px] h-[3px] left-[85%] top-[35%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[2px] h-[2px] left-[25%] top-[75%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[3px] h-[3px] left-[70%] top-[60%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[2px] h-[2px] left-[50%] top-[15%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[4px] h-[4px] left-[30%] top-[45%]" />
      </div>

      {/* Back to Home — top left */}
      <a
        ref={homeLinkRef}
        href="/"
        className="gsap-hidden fixed top-6 left-6 z-50 font-body text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
      >
        {language === "tr" ? "← Anasayfa" : "← Home"}
      </a>

      {/* Co-branding bar — top center, stacks below buttons on mobile */}
      {data.collaboration && (
        <div className="fixed top-14 md:top-6 left-1/2 -translate-x-1/2 z-50">
          <CoBrandingBar collaboration={data.collaboration} />
        </div>
      )}

      {/* Main content area — single card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          ref={cardWrapperRef}
          className="gsap-hidden will-animate-transform relative"
        >
          {/* Gold glow behind card */}
          <div
            ref={glowRef}
            className="absolute -inset-6 rounded-3xl bg-[#D4A853]/0 blur-3xl opacity-0 pointer-events-none"
          />

          <Card3D
            uniqueCode={data.uniqueCode}
            attachedName={data.attachedName}
            attachedToType={data.attachedToType}
            createdAt={data.createdAt}
            mode={data.mode}
            isFlipped={isFlipped}
            isRevealed={isRevealed}
            cardScale={isRevealed ? 0.9 : 1}
            showTilt={showTilt}
            ownerName={data.owner?.name ?? undefined}
            ownerPhoneNumber={data.owner?.phoneNumber}
            ownerEmail={data.owner?.email}
            ownerVCardFields={data.owner?.vCardFields}
          >
            <div className="w-full h-full relative">
              <img
                src="/images/smartchain-design.jpg"
                alt="Smartchain"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </Card3D>
        </div>

        {/* Digital Forest Tree Card */}
        {tree && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] text-center mb-4 font-body">
              Digital Forest
            </p>
            <a
              href={`/forest/tree/${tree.publicId}`}
              className="block bg-[#111111] border border-[#D4A853]/20 hover:border-[#D4A853]/40 transition-colors p-4 max-w-xs mx-auto"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`/images/forest/trees/trees-set1-64_${STAGE_TO_SPRITE[tree.growthStage] || 5}.png`}
                  alt={tree.growthStage}
                  className="w-12 h-12"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="min-w-0">
                  <p className="text-[#FFFBF0] text-sm font-heading truncate">
                    {tree.treeName || "Unnamed Tree"}
                  </p>
                  <p className="text-white/30 text-[10px] font-body mt-0.5 capitalize">
                    {tree.growthStage}
                  </p>
                  <p className="text-[#D4A853]/50 text-[9px] font-body mt-1">
                    View in Forest →
                  </p>
                </div>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
