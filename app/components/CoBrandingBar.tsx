export interface Collaboration {
  brandName: string;
  brandPrimaryColor?: string | null;
  brandSecondaryColor?: string | null;
}

export default function CoBrandingBar({
  collaboration,
}: {
  collaboration: Collaboration | null;
}) {
  if (!collaboration) return null;

  const accentColor = collaboration.brandPrimaryColor || "#D4A853";

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      <span className="font-heading text-sm md:text-xl text-white/70 font-light tracking-[0.15em]">
        aileco
      </span>
      <span className="font-heading text-xs md:text-lg text-white/30">x</span>
      <span
        className="font-heading text-sm md:text-xl font-light tracking-[0.15em] max-w-[120px] md:max-w-none truncate"
        style={{ color: accentColor }}
      >
        {collaboration.brandName}
      </span>
    </div>
  );
}
