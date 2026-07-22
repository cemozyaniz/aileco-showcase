"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/providers/LanguageProvider";

interface ForestStatsData {
  totalTrees: number;
  co2KgAnnual: number;
  oxygenKgAnnual: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

export default function ForestStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<ForestStatsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/forest/stats`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setStats(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Error state — dim, unobtrusive
  if (error) {
    return (
      <div className="text-white/15 text-[9px] font-body uppercase tracking-widest">
        {t("forest.stats.error")}
      </div>
    );
  }

  // Loading state — subtle pulse
  if (!stats) {
    return (
      <div className="text-white/10 text-[9px] font-body animate-pulse">
        {t("forest.stats.loading")}
      </div>
    );
  }

  // Format CO₂: convert to tons when ≥ 1000 kg
  const co2Formatted =
    stats.co2KgAnnual >= 1000
      ? `${(stats.co2KgAnnual / 1000).toFixed(1)} ton`
      : `${Math.round(stats.co2KgAnnual)} kg`;

  const o2Formatted =
    stats.oxygenKgAnnual >= 1000
      ? `${(stats.oxygenKgAnnual / 1000).toFixed(1)} ton`
      : `${Math.round(stats.oxygenKgAnnual)} kg`;

  return (
    <div className="flex flex-col gap-0.5 pointer-events-none">
      <div className="text-white/25 text-[10px] font-body uppercase tracking-[0.15em]">
        {t("forest.stats.totalTrees").replace(
          "{count}",
          stats.totalTrees.toLocaleString()
        )}
      </div>
      <div className="text-white/15 text-[9px] font-body">
        {t("forest.stats.co2Annual").replace("{co2}", co2Formatted)}
      </div>
      <div className="text-white/15 text-[9px] font-body">
        {t("forest.stats.o2Annual").replace("{o2}", o2Formatted)}
      </div>
    </div>
  );
}
