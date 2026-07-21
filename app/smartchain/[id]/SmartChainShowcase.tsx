"use client";

import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Card3D from "@/app/components/Card3D";
import OwnerInfo from "@/app/components/OwnerInfo";
import PrivacyMessage from "@/app/components/PrivacyMessage";
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
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const { t, language } = useTranslation();

  // Refs for GSAP targeting
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const homeLinkRef = useRef<HTMLAnchorElement>(null);

  // Derived: owner info — narrow name to string (we filter on truthy name)
  const owner: {
    name: string;
    phoneNumber: string | null;
    email: string | null;
    vCardFields?: VCardField[];
  } | null = data.owner?.name ? { ...data.owner, name: data.owner.name } : null;
  const isEmergency = data.mode === "lost" || data.mode === "stolen";
  const showOwnerInfo = owner && (locationGranted === true || isEmergency);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    const particleElements = particlesRef.current
      ? Array.from(particlesRef.current.children)
      : [];

    // Reduced motion: show everything instantly, no tweens
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        [particlesRef.current, cardWrapperRef.current, glowRef.current, homeLinkRef.current],
        { opacity: 1, y: 0, scale: 1 }
      );
      setIsFlipped(true);
      setIsRevealed(true);
    });

    // Normal motion: full GSAP timeline
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();

      tl.fromTo(
        particleElements,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      tl.fromTo(
        homeLinkRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
        "<"
      );

      tl.fromTo(
        cardWrapperRef.current,
        { opacity: 0, y: 40, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
        "<"
      );

      tl.to(glowRef.current, {
        opacity: 1, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 1,
      }, "+=0.2");

      tl.call(() => {
        setIsFlipped(true);
        setShowTilt(false);
      }, [], "+=0.5");

      tl.call(() => {
        setIsRevealed(true);
      }, [], "+=0.8");
    });

    return () => mm.revert();
  }, { scope: containerRef });

  // Geolocation + scan notification
  useEffect(() => {
    const sendScan = (lat: number | null, lng: number | null) => {
      fetch(`${API_URL}/smartchains/public/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_code: data.uniqueCode, latitude: lat, longitude: lng }),
      }).catch((err) => {
        console.debug("Scan notification failed:", err);
      });
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationGranted(true);
          sendScan(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setLocationGranted(false);
          sendScan(null, null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationGranted(false);
      sendScan(null, null);
    }
  }, [data.uniqueCode]);

  function handleShareLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationGranted(true);
        fetch(`${API_URL}/smartchains/public/scan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unique_code: data.uniqueCode,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        }).catch(() => {});
      },
      () => {} // stays false on retry failure
    );
  }

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

      {/* GSAP-animated floating particles */}
      <div ref={particlesRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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

      {/* Co-branding bar — top center */}
      {data.collaboration && (
        <div className="fixed top-14 md:top-6 left-1/2 -translate-x-1/2 z-50">
          <CoBrandingBar collaboration={data.collaboration} />
        </div>
      )}

      {/* Main content — card + below-card sections */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-24 pb-16 md:pt-20">
        {/* Card */}
        <div ref={cardWrapperRef} className="gsap-hidden will-animate-transform relative">
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

        {/* Below-card sections — revealed after flip animation completes */}
        {isRevealed && (
          <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] mt-8 space-y-4">
            {/* Emergency alert — lost/stolen banner */}
            {isEmergency && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                <p className="text-amber-300 text-sm font-semibold">
                  {language === "tr"
                    ? data.mode === "lost"
                      ? "Bu ürün kayıp bildirildi"
                      : "Bu ürün çalıntı bildirildi"
                    : data.mode === "lost"
                      ? "This item is reported lost"
                      : "This item is reported stolen"}
                </p>
                <p className="text-amber-400/60 text-xs mt-1">
                  {language === "tr"
                    ? "Bu ürünü bulduysanız, lütfen aşağıdaki sahibiyle iletişime geçin."
                    : "If you found this item, please contact the owner below."}
                </p>
              </div>
            )}

            {/* Owner info — gated on location */}
            {showOwnerInfo && (
              <OwnerInfo
                name={owner.name}
                phoneNumber={owner.phoneNumber ?? null}
                email={owner.email ?? null}
                vCardFields={owner.vCardFields}
                isVisible={true}
              />
            )}

            {/* Location denied on normal item — prompt to share */}
            {owner && !showOwnerInfo && locationGranted === false && (
              <LocationGate onShareLocation={handleShareLocation} />
            )}

            {/* Location still pending — spinner */}
            {owner && !showOwnerInfo && locationGranted === null && (
              <div className="flex justify-center py-6">
                <div className="w-5 h-5 border border-white/20 border-t-white/50 rounded-full animate-spin" />
              </div>
            )}

            {/* No owner at all — privacy message */}
            {!owner && <PrivacyMessage isVisible={true} />}

            {/* Location shared indicator (subtle, only on normal items) */}
            {locationGranted === true && !isEmergency && owner && (
              <p className="text-center text-white/15 text-[9px] font-body">
                {language === "tr" ? "✓ Konum paylaşıldı" : "✓ Location shared"}
              </p>
            )}

            {/* Digital Forest Tree Card */}
            {tree && <TreeCard tree={tree} />}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────── Inline sub-components ──────────────── */

/** Shown when viewer denies location on a normal (non-emergency) item. */
function LocationGate({ onShareLocation }: { onShareLocation: () => void }) {
  const { language } = useTranslation();
  return (
    <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-xl p-5 text-center">
      <svg
        className="w-8 h-8 text-[#D4A853]/40 mx-auto mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <p className="text-white/50 text-sm font-body mb-3">
        {language === "tr"
          ? "Sahip bilgilerini görmek için konumunuzu paylaşın"
          : "Share your location to view owner details"}
      </p>
      <button
        onClick={onShareLocation}
        className="bg-[#D4A853]/10 border border-[#D4A853]/30 text-[#D4A853] px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-[#D4A853]/20 active:bg-[#D4A853]/30 transition-colors font-body touch-manipulation rounded-lg"
      >
        {language === "tr" ? "Konumu Paylaş" : "Share Location"}
      </button>
    </div>
  );
}

/** Digital Forest tree card shown when the SmartChain has a planted tree. */
function TreeCard({ tree }: { tree: TreeInfo }) {
  const spriteIdx = STAGE_TO_SPRITE[tree.growthStage] || 5;
  return (
    <div>
      <p className="text-white/15 text-[8px] uppercase tracking-[0.3em] text-center mb-3 font-body">
        Digital Forest
      </p>
      <a
        href={`/forest/tree/${tree.publicId}`}
        className="block bg-[#0D0D0D] border border-[#D4A853]/20 hover:border-[#D4A853]/40 active:border-[#D4A853]/60 transition-colors p-4 touch-manipulation"
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-14 h-14 bg-black/50 flex items-center justify-center">
            <img
              src={`/images/forest/trees/trees-set1-64_${spriteIdx}.png`}
              alt={tree.growthStage}
              className="w-14 h-14"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[#FFFBF0] text-sm font-heading truncate leading-tight">
              {tree.treeName || "Unnamed Tree"}
            </p>
            <p className="text-white/30 text-[10px] font-body mt-0.5 capitalize">
              {tree.growthStage}
            </p>
            <p className="text-[#D4A853]/60 text-[10px] font-body mt-1.5">
              View in Forest →
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
