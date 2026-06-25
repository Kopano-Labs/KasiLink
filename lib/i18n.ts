/**
 * lib/i18n.ts
 * ───────────────────────────────────────────────────────────
 * Lightweight internationalization for KasiLink.
 *
 * KC Apprenticeship Phase 7, Task 61
 *
 * Supports: en (English), zu (isiZulu), xh (isiXhosa), af (Afrikaans)
 * 
 * Design: Simple key-value lookup with fallback chain.
 * No heavy framework — township phones can't afford the bundle.
 * String keys are dot-separated: "nav.home", "gig.apply", etc.
 * ───────────────────────────────────────────────────────────
 */

export type Locale = "en" | "zu" | "xh" | "af";

export const SUPPORTED_LOCALES: { code: Locale; label: string; nativeName: string }[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "zu", label: "isiZulu", nativeName: "isiZulu" },
  { code: "xh", label: "isiXhosa", nativeName: "isiXhosa" },
  { code: "af", label: "Afrikaans", nativeName: "Afrikaans" },
];

export const DEFAULT_LOCALE: Locale = "en";

/* ─── String Dictionaries ─── */

type StringDict = Record<string, string>;

const en: StringDict = {
  // Navigation
  "nav.home": "Home",
  "nav.marketplace": "Find Gigs",
  "nav.community": "Community",
  "nav.studio": "Studio",
  "nav.messages": "Messages",
  "nav.postGig": "Post Gig",
  "nav.signIn": "Sign In",
  "nav.profile": "Profile",

  // Gig card
  "gig.apply": "Apply for this gig",
  "gig.applied": "Applied",
  "gig.urgent": "Urgent",
  "gig.verified": "Verified provider",
  "gig.slots": "Slots available",
  "gig.pay": "Pay",
  "gig.postedBy": "Posted by",
  "gig.backToMarketplace": "← Back to marketplace",
  "gig.whyGoodFit": "Why are you a good fit?",
  "gig.submitApplication": "Submit application",
  "gig.submitting": "Submitting…",
  "gig.signInToApply": "Sign in to apply for this gig.",

  // Power warnings (Task 7)
  "power.warning": "Power Warning",
  "power.stageLabel": "Stage",
  "power.noDisruptions": "No power disruptions expected.",
  "power.safeWindows": "Power-safe windows today",
  "power.affectedWindows": "Affected outage windows",
  "power.freeWillNotice": "This is a warning, not a block. You decide whether to proceed. Declining due to load-shedding will NOT affect your trust score.",
  "power.cached": "(cached)",

  // Infrastructure decline
  "infra.title": "Infrastructure Conflict",
  "infra.noPower": "No power for this work",
  "infra.noWater": "No water supply",
  "infra.transportDisrupted": "Transport disrupted",
  "infra.noBackup": "No backup power available",
  "infra.selectReason": "Select reason",
  "infra.additionalNotes": "Additional notes (optional)",
  "infra.trustNotice": "Your trust score will NOT be affected by this decline.",
  "infra.declineNoPrice": "Decline — No Penalty",
  "infra.recorded": "Decline recorded",

  // Offline
  "offline.banner": "You're offline — cached data is still available",
  "offline.backOnline": "Back online — syncing your data",
  "offline.retry": "Retry",

  // Vault
  "vault.title": "Kopano Vault",
  "vault.operational": "Vault operational",
  "vault.unavailable": "Vault unavailable",
  "vault.connected": "Connected",
  "vault.offlineCache": "Offline — using cached data",
  "vault.cachedZones": "Cached zones",
  "vault.unsynced": "Unsynced",
  "vault.pending": "Pending",
  "vault.sovereign": "Sovereign data · Offline-first · Your device",

  // Common
  "common.loading": "Loading…",
  "common.error": "Something went wrong",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.confirm": "Confirm",
  "common.close": "Close",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.noResults": "No results found",
  "common.tryAgain": "Try again",
  "common.learnMore": "Learn more",

  // Footer
  "footer.poweredBy": "Powered by Kopano Context",
  "footer.tagline": "Unity through technology",
};

const zu: StringDict = {
  "nav.home": "Ikhaya",
  "nav.marketplace": "Thola Imisebenzi",
  "nav.community": "Umphakathi",
  "nav.messages": "Imilayezo",
  "nav.postGig": "Faka Umsebenzi",
  "nav.signIn": "Ngena",
  "nav.profile": "Iphrofayela",

  "gig.apply": "Faka isicelo salomsebenzi",
  "gig.urgent": "Kuphuthuma",
  "gig.verified": "Umhlinzeki oqinisekisiwe",
  "gig.pay": "Inkokhelo",
  "gig.submitApplication": "Thumela isicelo",
  "gig.submitting": "Kuyathunyelwa…",
  "gig.signInToApply": "Ngena ukuze ufake isicelo.",

  "power.warning": "Isexwayiso Sikagesi",
  "power.noDisruptions": "Akukho ukuphazamiseka kukagesi okulindelekile.",
  "power.freeWillNotice": "Lesi isexwayiso, akuvimbeli. Wena unquma. Ukwenqaba ngenxa yokucinywa kukagesi NGEKE kuthinte isikali sakho sokuthembeka.",

  "infra.title": "Ingxabano Yengqalasizinda",
  "infra.noPower": "Awukho ugesi walomsebenzi",
  "infra.noWater": "Awukho amanzi",
  "infra.trustNotice": "Isikali sakho sokuthembeka NGEKE sithinteke ngalenqaba.",

  "offline.banner": "Awuxhunyiwe — idatha egciniwe isatholakala",
  "offline.backOnline": "Ubuyile ku-inthanethi — kuyavumelaniswa",

  "common.loading": "Kuyalayisha…",
  "common.cancel": "Khansela",
  "common.save": "Gcina",
  "common.close": "Vala",

  "footer.tagline": "Ubumbano ngobuchwepheshe",
};

const xh: StringDict = {
  "nav.home": "Ikhaya",
  "nav.marketplace": "Fumana Imisebenzi",
  "nav.community": "Uluntu",
  "nav.messages": "Imiyalezo",
  "nav.postGig": "Faka Umsebenzi",
  "nav.signIn": "Ngena",

  "gig.apply": "Faka isicelo somsebenzi",
  "gig.urgent": "Kungxamisekile",
  "gig.verified": "Umnikezeli oqinisekisiweyo",
  "gig.submitApplication": "Ngenisa isicelo",

  "power.warning": "Isilumkiso Sombane",
  "power.noDisruptions": "Akukho kuphazamiseka kombane okulindelweyo.",
  "power.freeWillNotice": "Esi sisilumkiso, hayi isithintelo. Uyagqiba wena. Ukwala ngenxa yokuciwa kombane AKUYI kuchaphazela inqanaba lakho lokuthembeka.",

  "offline.banner": "Awudibananga — idatha egciniweyo isafumaneka",

  "common.loading": "Kuyalayisha…",
  "common.cancel": "Rhoxisa",

  "footer.tagline": "Umanyano ngobuchwepheshe",
};

const af: StringDict = {
  "nav.home": "Tuis",
  "nav.marketplace": "Vind Werk",
  "nav.community": "Gemeenskap",
  "nav.messages": "Boodskappe",
  "nav.postGig": "Plaas Werk",
  "nav.signIn": "Teken In",

  "gig.apply": "Doen aansoek vir hierdie werk",
  "gig.urgent": "Dringend",
  "gig.verified": "Geverifieerde verskaffer",
  "gig.submitApplication": "Dien aansoek in",

  "power.warning": "Krag Waarskuwing",
  "power.noDisruptions": "Geen kragonderbrekings word verwag nie.",
  "power.freeWillNotice": "Dit is 'n waarskuwing, nie 'n blokkering nie. Jy besluit. Weiering weens beurtkrag sal NIE jou vertrouenstelling beïnvloed nie.",

  "offline.banner": "Jy is vanlyn — gekas data is steeds beskikbaar",

  "common.loading": "Laai…",
  "common.cancel": "Kanselleer",

  "footer.tagline": "Eenheid deur tegnologie",
};

/* ─── Dictionary Registry ─── */

const dictionaries: Record<Locale, StringDict> = { en, zu, xh, af };

/* ─── Translation Function ─── */

/**
 * Get a translated string for the given key.
 * Falls back: requested locale → English → key itself.
 */
export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
}

/**
 * Get a translated string with interpolation.
 * Replaces {{variable}} placeholders with values.
 *
 * @example t("gig.postedBy", "en", { name: "Thabo" })
 * // → "Posted by Thabo" (if template is "Posted by {{name}}")
 */
export function tInterpolated(
  key: string,
  locale: Locale = DEFAULT_LOCALE,
  vars: Record<string, string | number> = {},
): string {
  let str = t(key, locale);
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
  }
  return str;
}

/**
 * Check if a locale is supported.
 */
export function isValidLocale(locale: string): locale is Locale {
  return ["en", "zu", "xh", "af"].includes(locale);
}

/**
 * Detect preferred locale from browser.
 * Falls back to English if not supported.
 */
export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const browserLang = navigator.language?.split("-")[0]?.toLowerCase();
  return isValidLocale(browserLang ?? "") ? browserLang as Locale : DEFAULT_LOCALE;
}
