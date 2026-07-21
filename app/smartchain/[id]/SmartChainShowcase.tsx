"use client";

import { useState, useEffect } from "react";
import Card3D from "@/app/components/Card3D";
import VCardModal from "@/app/components/VCardModal";
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
  const [showVCard, setShowVCard] = useState(false);
  const { language } = useTranslation();

  // Geolocation scan notification (silent)
  useEffect(() => {
    const sendScan = (lat: number | null, lng: number | null) => {
      fetch(`${API_URL}/smartchains/public/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_code: data.uniqueCode, latitude: lat, longitude: lng }),
      }).catch(() => {});
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => sendScan(position.coords.latitude, position.coords.longitude),
        () => sendScan(null, null),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      sendScan(null, null);
    }
  }, [data.uniqueCode]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(30,20,60,0.4) 0%, rgba(0,0,0,1) 70%)",
          }}
        />
      </div>

      {/* Floating particles (static atmosphere) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full bg-white/[0.03] w-[4px] h-[4px] left-[10%] top-[20%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[3px] h-[3px] left-[85%] top-[35%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[2px] h-[2px] left-[25%] top-[75%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[3px] h-[3px] left-[70%] top-[60%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[2px] h-[2px] left-[50%] top-[15%]" />
        <div className="absolute rounded-full bg-white/[0.03] w-[4px] h-[4px] left-[30%] top-[45%]" />
      </div>

      {/* Back to Home */}
      <a
        href="/"
        className="fixed top-6 left-6 z-50 font-body text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
      >
        {language === "tr" ? "← Anasayfa" : "← Home"}
      </a>

      {/* Co-branding bar */}
      {data.collaboration && (
        <div className="fixed top-14 md:top-6 left-1/2 -translate-x-1/2 z-50">
          <CoBrandingBar collaboration={data.collaboration} />
        </div>
      )}

      {/* Main content — card + tree */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-0 px-4 py-24 md:py-0">
        <Card3D
          uniqueCode={data.uniqueCode}
          attachedName={data.attachedName}
          attachedToType={data.attachedToType}
          createdAt={data.createdAt}
          mode={data.mode}
          ownerName={data.owner?.name ?? null}
          isProfilePublic={data.isProfilePublic}
          onViewContact={() => setShowVCard(true)}
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

        {/* Digital Forest Tree Card */}
        {tree && (
          <div className="mt-8 pt-6 border-t border-white/[0.08] w-full max-w-xs">
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
                    src={`/images/forest/trees/trees-set1-64_${STAGE_TO_SPRITE[tree.growthStage] || 5}.png`}
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
        )}
      </div>

      {/* VCard Modal */}
      {showVCard && data.owner && (
        <VCardModal
          owner={{
            name: data.owner.name || "",
            phoneNumber: data.owner.phoneNumber,
            email: data.owner.email,
            vCardFields: data.owner.vCardFields,
          }}
          onClose={() => setShowVCard(false)}
        />
      )}
    </div>
  );
}
