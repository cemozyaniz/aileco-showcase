"use client";

import { useTranslation } from "@/providers/LanguageProvider";
import { downloadVCard } from "@/lib/vcard-utils";

interface VCardField {
  label: string;
  value: string;
  fieldType: string;
}

interface OwnerInfoProps {
  name: string;
  phoneNumber: string | null;
  email: string | null;
  vCardFields?: VCardField[];
  isVisible: boolean;
}

function PhoneIcon() {
  return (
    <svg className="w-[18px] h-[18px] text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-[18px] h-[18px] text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-[18px] h-[18px] text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-[18px] h-[18px] text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg className="w-[18px] h-[18px] text-zinc-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function FieldIcon({ fieldType, value }: { fieldType: string; value: string }) {
  if (fieldType === "phone" || (value.startsWith("+") && /^\+?\d[\d\s-]{6,}$/.test(value))) return <PhoneIcon />;
  if (fieldType === "email" || value.includes("@")) return <EmailIcon />;
  if (fieldType === "website" || fieldType === "url" || value.startsWith("http://") || value.startsWith("https://")) return <LinkIcon />;
  if (fieldType === "social") return <ShareIcon />;
  return <DotIcon />;
}

function getFieldHref(value: string): string | null {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("+") && /^\+?\d[\d\s-]{6,}$/.test(value)) return `tel:${value}`;
  if (value.includes("@")) return `mailto:${value}`;
  return null;
}

export default function OwnerInfo({
  name,
  phoneNumber,
  email,
  vCardFields,
  isVisible,
}: OwnerInfoProps) {
  const { t } = useTranslation();
  if (!isVisible) return null;

  const hasContact = phoneNumber || email || (vCardFields && vCardFields.length > 0);

  return (
    <div className="w-full backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
        {name}
      </h3>

      {hasContact ? (
        <div className="space-y-0.5">
          {phoneNumber && (
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors group"
            >
              <PhoneIcon />
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                {phoneNumber}
              </span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors group"
            >
              <EmailIcon />
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors truncate">
                {email}
              </span>
            </a>
          )}
          {vCardFields?.map((field) => {
            const href = getFieldHref(field.value);
            const row = (
              <div
                key={field.label}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors group"
              >
                <FieldIcon fieldType={field.fieldType} value={field.value} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider leading-none mb-0.5">
                    {field.label}
                  </p>
                  <p className="text-sm text-zinc-300 group-hover:text-white transition-colors truncate">
                    {field.value}
                  </p>
                </div>
              </div>
            );

            if (href) {
              return (
                <a key={field.label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
                  {row}
                </a>
              );
            }
            return row;
          })}
          <button
            onClick={() =>
              downloadVCard(name, phoneNumber, email, vCardFields)
            }
            className="w-full mt-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08]
                     hover:bg-[#D4A853]/15 hover:border-[#D4A853]/20
                     flex items-center justify-center gap-2 transition-all cursor-pointer
                     font-body text-xs font-semibold tracking-wide uppercase text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" strokeDasharray="2 2" />
            </svg>
            {t("smartchain.saveContact")}
          </button>
        </div>
      ) : (
        <p className="text-sm text-zinc-600 italic">{t("smartchain.saveContact")}</p>
      )}
    </div>
  );
}
