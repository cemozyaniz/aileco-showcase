/** Environmental impact calculations for Digital Forest trees.
 *
 * Mirrors the backend `app/services/forest_impact.py` logic so the
 * frontend can display impact without a dedicated API field.
 */

const MATURE_O2_KG_PER_YEAR = 118;
const MATURE_CO2_KG_PER_YEAR = 22;

const STAGE_MULTIPLIERS: Record<string, number> = {
  seed: 0.05,
  sprout: 0.1,
  sapling: 0.25,
  young: 0.5,
  mature: 1.0,
  ancient: 1.2,
};

export interface TreeImpact {
  oxygenKg: number;
  co2Kg: number;
}

/** Calculate cumulative environmental impact for a tree. */
export function calculateTreeImpact(
  activationAt: string | null,
  growthStage: string,
): TreeImpact {
  if (!activationAt) {
    return { oxygenKg: 0, co2Kg: 0 };
  }

  const activated = new Date(activationAt);
  const now = new Date();
  const ageDays = Math.max(0, Math.floor((now.getTime() - activated.getTime()) / 86400000));
  const years = ageDays / 365;
  const multiplier = STAGE_MULTIPLIERS[growthStage] ?? 0.1;

  return {
    oxygenKg: Math.round(MATURE_O2_KG_PER_YEAR * years * multiplier * 10) / 10,
    co2Kg: Math.round(MATURE_CO2_KG_PER_YEAR * years * multiplier * 10) / 10,
  };
}

/** Format kg to a human-readable string (converts to tons when ≥ 1000). */
export function formatImpactKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} ton`;
  if (kg < 0.1) return "< 0.1 kg";
  return `${kg.toFixed(1)} kg`;
}
