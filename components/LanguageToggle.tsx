"use client";

import { useTranslation } from "@/providers/LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "tr" : "en")}
      className="fixed top-6 right-6 z-50 flex items-center gap-1 px-3 py-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.1] hover:bg-white/[0.1] transition-all cursor-pointer"
    >
      <span className={`font-body text-xs font-medium uppercase tracking-wider ${language === "en" ? "text-white" : "text-white/30"}`}>
        EN
      </span>
      <span className="w-px h-3 bg-white/20" />
      <span className={`font-body text-xs font-medium uppercase tracking-wider ${language === "tr" ? "text-[#D4A853]" : "text-white/30"}`}>
        TR
      </span>
    </button>
  );
}
