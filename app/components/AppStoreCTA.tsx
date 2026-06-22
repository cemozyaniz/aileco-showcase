"use client";

import { forwardRef } from "react";

const APP_STORE_URL =
  "https://apps.apple.com/tr/app/aileco/id6776034896?l=tr";

interface AppStoreCTAProps {
  variant?: "full" | "compact";
  className?: string;
}

function AppleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.05 12.6c-.07-2.89 2.36-4.28 2.46-4.35-1.34-1.96-3.42-2.23-4.16-2.26-1.77-.18-3.46 1.04-4.36 1.04-.9 0-2.3-1.02-3.78-.99-1.94.03-3.73 1.13-4.73 2.87-2.02 3.5-.52 8.69 1.45 11.53.96 1.38 2.11 2.93 3.62 2.88 1.45-.06 2-.93 3.75-.93s2.25.93 3.79.9c1.56-.03 2.55-1.41 3.5-2.8 1.1-1.61 1.55-3.17 1.58-3.25-.03-.02-3.04-1.16-3.07-4.64z" />
      <path d="M14.3 3.8c.8-.98 1.34-2.34 1.2-3.7-1.16.05-2.57.77-3.4 1.74-.75.87-1.4 2.27-1.22 3.6 1.29.1 2.62-.66 3.42-1.64z" />
    </svg>
  );
}

const AppStoreCTA = forwardRef<HTMLDivElement, AppStoreCTAProps>(
  ({ variant = "full", className = "" }, ref) => {
    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={`gsap-hidden w-full ${className}`}
        >
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-6 flex items-center justify-center gap-3 py-3 px-5
                       rounded-xl bg-white/[0.04] border border-white/[0.08]
                       hover:border-[#D4A853]/40 hover:bg-[#D4A853]/[0.06]
                       transition-all duration-300 group"
          >
            <AppleIcon size={20} />
            <span className="font-body text-sm font-medium text-white/70 group-hover:text-white transition-colors">
              Download on the App Store
            </span>
          </a>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`gsap-hidden w-full ${className}`}
      >
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-4 py-4 px-6
                     rounded-2xl bg-white/[0.04] backdrop-blur-md
                     border border-white/[0.08]
                     hover:border-[#D4A853]/40 hover:bg-[#D4A853]/[0.06]
                     transition-all duration-300 group"
        >
          <AppleIcon size={28} />
          <div className="text-left">
            <p className="font-body text-[10px] uppercase tracking-[0.15em] font-medium text-white/40 group-hover:text-white/60 transition-colors">
              Download on the
            </p>
            <p className="font-heading text-xl font-light text-[#D4A853] group-hover:text-[#e0b96a] transition-colors">
              App Store
            </p>
          </div>
        </a>
      </div>
    );
  }
);

AppStoreCTA.displayName = "AppStoreCTA";

export { APP_STORE_URL };
export default AppStoreCTA;
