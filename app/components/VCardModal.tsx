"use client";

import { useTranslation } from "@/providers/LanguageProvider";
import { downloadVCard } from "@/lib/vcard-utils";

interface VCardField {
  label: string;
  value: string;
  fieldType: string;
}

interface VCardModalProps {
  owner: {
    name: string;
    phoneNumber: string | null;
    email: string | null;
    vCardFields?: VCardField[];
  };
  onClose: () => void;
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function FieldIcon({ fieldType, value }: { fieldType: string; value: string }) {
  if (fieldType === "phone" || (value.startsWith("+") && /^\+?\d[\d\s-]{6,}$/.test(value))) return <PhoneIcon />;
  if (fieldType === "email" || value.includes("@")) return <EmailIcon />;
  return (
    <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export default function VCardModal({ owner, onClose }: VCardModalProps) {
  const { language } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-sm mx-auto bg-[#111111] border-t sm:border border-[#D4A853]/20 p-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close + drag handle (mobile) */}
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <div className="w-8 h-0.5 bg-white/15 rounded-full mx-auto" />
          <button onClick={onClose} className="text-white/30 hover:text-white text-xs uppercase tracking-widest absolute right-6 top-4">
            ✕
          </button>
        </div>

        {/* Close (desktop) */}
        <button onClick={onClose} className="hidden sm:block absolute top-4 right-4 text-white/30 hover:text-white text-xs uppercase tracking-widest">
          ✕
        </button>

        {/* Owner name */}
        <h2 className="text-xl text-white font-heading mb-4 pr-8">{owner.name}</h2>

        {/* Contact fields */}
        <div className="space-y-1.5 mb-6">
          {owner.phoneNumber && (
            <a
              href={`tel:${owner.phoneNumber}`}
              className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.06] active:bg-white/[0.04] transition-colors touch-manipulation"
            >
              <PhoneIcon />
              <span className="text-sm text-zinc-300">{owner.phoneNumber}</span>
            </a>
          )}
          {owner.email && (
            <a
              href={`mailto:${owner.email}`}
              className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.06] active:bg-white/[0.04] transition-colors touch-manipulation"
            >
              <EmailIcon />
              <span className="text-sm text-zinc-300 truncate">{owner.email}</span>
            </a>
          )}
          {owner.vCardFields?.map((field) => (
            <div
              key={field.label}
              className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg"
            >
              <FieldIcon fieldType={field.fieldType} value={field.value} />
              <div className="min-w-0">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider leading-none mb-0.5">
                  {field.label}
                </p>
                <p className="text-sm text-zinc-300 truncate">{field.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add to Contacts button */}
        <button
          onClick={() => downloadVCard(owner.name, owner.phoneNumber, owner.email, owner.vCardFields)}
          className="w-full bg-[#D4A853] text-black font-semibold py-3 text-sm uppercase tracking-[0.15em] hover:bg-[#E8B33A] active:bg-[#C49A3A] transition-colors touch-manipulation"
        >
          {language === "tr" ? "Rehbere Ekle" : "Add to Contacts"}
        </button>
      </div>
    </div>
  );
}
