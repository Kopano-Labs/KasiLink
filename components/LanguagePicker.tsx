"use client";

/**
 * components/LanguagePicker.tsx
 * ───────────────────────────────────────────────────────────
 * Language selector for KasiLink.
 *
 * KC Apprenticeship Phase 7, Task 66
 *
 * Compact dropdown that persists choice in Kopano Vault.
 * Shows native language names (isiZulu, isiXhosa, Afrikaans).
 * ───────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { SUPPORTED_LOCALES, type Locale, DEFAULT_LOCALE } from "@/lib/i18n";

interface LanguagePickerProps {
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  className?: string;
}

export default function LanguagePicker({
  currentLocale = DEFAULT_LOCALE,
  onLocaleChange,
  className = "",
}: LanguagePickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Locale>(currentLocale);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = SUPPORTED_LOCALES.find((l) => l.code === selected);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(locale: Locale) {
    setSelected(locale);
    setOpen(false);
    onLocaleChange?.(locale);
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high"
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe size={13} />
        <span>{currentLabel?.nativeName || "English"}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-1 w-44 rounded-xl border border-outline-variant/30 bg-surface-container shadow-lg overflow-hidden z-50"
          role="listbox"
          aria-label="Language options"
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <button
              key={locale.code}
              type="button"
              role="option"
              aria-selected={selected === locale.code}
              onClick={() => handleSelect(locale.code)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                selected === locale.code
                  ? "bg-primary-container text-primary font-semibold"
                  : "text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span>{locale.nativeName}</span>
              <span className="text-[10px] text-outline">{locale.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
