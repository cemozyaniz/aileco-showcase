interface VCardFieldProps {
  label: string;
  value: string;
  fieldType: string;
  isLast?: boolean;
}

export default function VCardField({ label, value, fieldType, isLast = false }: VCardFieldProps) {
  const strokeColor = "rgba(255,255,255,0.4)";

  if (fieldType === "phone" || (value.startsWith("+") && value.length < 20)) {
    return (
      <div className={`flex items-center gap-4 py-3.5 ${!isLast ? "border-b border-white/[0.06]" : ""}`}>
        <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-body font-medium uppercase tracking-[0.15em] text-white/30">{label}</p>
          <a href={`tel:${value}`} className="text-base font-body font-light text-white break-all hover:text-white/80 transition-colors">
            {value}
          </a>
        </div>
      </div>
    );
  }

  if (fieldType === "email" || value.includes("@")) {
    return (
      <div className={`flex items-center gap-4 py-3.5 ${!isLast ? "border-b border-white/[0.06]" : ""}`}>
        <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-body font-medium uppercase tracking-[0.15em] text-white/30">{label}</p>
          <a href={`mailto:${value}`} className="text-base font-body font-light text-white break-all hover:text-white/80 transition-colors">
            {value}
          </a>
        </div>
      </div>
    );
  }

  if (fieldType === "website" || value.startsWith("http://") || value.startsWith("https://")) {
    return (
      <div className={`flex items-center gap-4 py-3.5 ${!isLast ? "border-b border-white/[0.06]" : ""}`}>
        <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-body font-medium uppercase tracking-[0.15em] text-white/30">{label}</p>
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-base font-body font-light text-white break-all hover:text-white/80 transition-colors">
            {value}
          </a>
        </div>
      </div>
    );
  }

  if (fieldType === "social") {
    return (
      <div className={`flex items-center gap-4 py-3.5 ${!isLast ? "border-b border-white/[0.06]" : ""}`}>
        <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-body font-medium uppercase tracking-[0.15em] text-white/30">{label}</p>
          {value.startsWith("http") ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-base font-body font-light text-white break-all hover:text-white/80 transition-colors">
              {value}
            </a>
          ) : (
            <p className="text-base font-body font-light text-white break-all">{value}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 py-3.5 ${!isLast ? "border-b border-white/[0.06]" : ""}`}>
      <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-body font-medium uppercase tracking-[0.15em] text-white/30">{label}</p>
        <p className="text-base font-body font-light text-white break-all">{value}</p>
      </div>
    </div>
  );
}
