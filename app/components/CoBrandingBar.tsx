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
    <div className="flex items-center justify-center gap-3 mb-6">
      <span className="font-heading text-xl text-white/70 font-light tracking-[0.15em]">
        aileco
      </span>
      <span className="font-heading text-lg text-white/30">x</span>
      <span
        className="font-heading text-xl font-light tracking-[0.15em]"
        style={{ color: accentColor }}
      >
        {collaboration.brandName}
      </span>
    </div>
  );
}
