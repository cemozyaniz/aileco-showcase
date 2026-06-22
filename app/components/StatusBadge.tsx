"use client";

type CardStatus = "active" | "lost" | "stolen";

interface StatusBadgeProps {
  status: CardStatus;
  isVisible: boolean;
  /** Override the default label. If omitted, uses the English label from config. */
  label?: string;
}

const config: Record<
  CardStatus,
  { dot: string; bg: string; text: string; pulse: boolean }
> = {
  active: {
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-300",
    pulse: false,
  },
  lost: {
    dot: "bg-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-300",
    pulse: true,
  },
  stolen: {
    dot: "bg-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-300",
    pulse: true,
  },
};

const defaultLabels: Record<CardStatus, string> = {
  active: "Active",
  lost: "Lost",
  stolen: "Stolen",
};

export default function StatusBadge({ status, isVisible, label }: StatusBadgeProps) {
  if (!isVisible) return null;
  const c = config[status];
  const displayLabel = label ?? defaultLabels[status];

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        border backdrop-blur-md ${c.bg} ${c.text}
      `}
    >
      <span className="relative flex h-2 w-2">
        {c.pulse && (
          <span
            className={`absolute inline-flex h-full w-full ${c.dot} rounded-full opacity-75 animate-ping`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 ${c.dot} rounded-full`} />
      </span>
      {displayLabel}
    </div>
  );
}
