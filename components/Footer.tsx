import Link from "next/link";
import { ExternalLink } from "lucide-react";

const ZapIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const platformLinks = [
  { label: "Gigs", href: "/marketplace" },
  { label: "Post a Gig", href: "/gigs/new" },
  { label: "Verified Providers", href: "/verified" },
  { label: "Messages", href: "/chat" },
  { label: "Lite", href: "/lite" },
  { label: "Studio", href: "/studio" },
];

const communityLinks = [
  { label: "Community Forum", href: "/forum" },
  { label: "Incidents", href: "/incidents" },
  { label: "Water Alerts", href: "/water-outages" },
  { label: "Community Calendar", href: "/community-calendar" },
  { label: "Utility Schedule", href: "/utility-schedule" },
  { label: "Business Spotlight", href: "/spotlight" },
  { label: "Find a Tutor", href: "/tutoring" },
  { label: "Community Status", href: "/community-status" },
  { label: "My Water Reports", href: "/my-water-reports" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Resources & FAQ", href: "/resources" },
];

const ecosystemLinks = [
  {
    label: "KRRababalela",
    href: "https://krrababalela.com",
    note: "Chief portfolio",
    status: "Live",
  },
  {
    label: "Kopano Labs",
    href: "https://kopanolabs.com",
    note: "Studio surface",
    status: "Live",
  },
  {
    label: "Five's Arena",
    href: "https://fivesarena.com",
    note: "Football venue",
    status: "Live",
  },
  {
    label: "5s Arena Blog",
    href: "https://blog.fivesarena.com",
    note: "Editorial lane",
    status: "Live",
  },
  {
    label: "Starfall Salvage",
    href: "https://starfallsalvage.kopanolabs.com",
    note: "WebGL game",
    status: "Live",
  },
  {
    label: "Kopano Context",
    href: "https://context.kopanolabs.com",
    note: "Reserved domain",
    status: "Reserved",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-outline-variant/30 bg-surface-container-low pt-12 pb-24 md:pb-6">
      <div className="container">
        <div className="mb-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-band">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
              Built for neighbourhood work
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge badge-primary">Nearby gigs</span>
              <span className="badge badge-secondary">Community trust</span>
              <span className="badge badge-info">Utility-aware planning</span>
              <span className="badge badge-success">Lite discovery</span>
            </div>
          </div>
          <div className="surface-band">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
              Fast routes
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/marketplace" className="btn btn-outline btn-sm">
                Browse gigs
              </Link>
              <Link href="/gigs/new" className="btn btn-primary btn-sm">
                Post work
              </Link>
              <Link href="/lite" className="btn btn-ghost btn-sm">
                Open Lite
              </Link>
            </div>
          </div>
        </div>

        {/* Top row */}
        <div className="gap-8 mb-8 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-3 no-underline"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_10px_24px_rgba(69,149,192,0.35)]">
                <ZapIcon />
              </span>
              <span>
                <span className="block text-lg font-black tracking-tight text-on-background">
                  Kasi<span className="text-primary">Link</span>
                </span>
                <span className="block text-[10px] uppercase tracking-[0.22em] text-outline">
                  South Africa
                </span>
              </span>
            </Link>
            <p className="text-sm text-on-surface-variant max-w-[28rem] leading-[1.65]">
              A township-first work network built for proximity, trust, and real-time local
              conditions. Full KasiLink runs the neighbourhood work loop. Lite gives the faster
              opportunity scan.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <a
                href="https://github.com/RobynAwesome/Introduction-to-MCP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline no-underline inline-flex items-center gap-1"
              >
                Intelligence by Kopano Context
                <ExternalLink size={9} />
              </a>
            </div>
          </div>

          <nav>
            <p className="text-xs font-medium text-outline tracking-wider mb-3 uppercase">
              Platform
            </p>
            <div className="gap-2 flex flex-col">
              {platformLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-on-surface-variant hover:text-primary no-underline transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <nav>
            <p className="text-xs font-medium text-outline tracking-wider mb-3 uppercase">
              Community
            </p>
            <div className="gap-2 flex flex-col">
              {communityLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-on-surface-variant hover:text-primary no-underline transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Kopano Labs band */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              A Kopano Labs product
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/RobynAwesome/Introduction-to-MCP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline no-underline"
            >
              Kopano Context
              <ExternalLink size={9} />
            </a>
            <a
              href="mailto:rkholofelo@kopanolabs.com"
              className="text-[10px] text-outline hover:text-primary no-underline"
            >
              rkholofelo@kopanolabs.com
            </a>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-outline-variant/20 bg-surface-container px-5 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Ecosystem routes
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-on-surface-variant">
                KasiLink should read as part of the same public graph as the portfolio, studio,
                arena, editorial, and game lanes. Kopano Context stays visible, but honestly marked
                as reserved until the public runtime is owner-proven.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ecosystemLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-outline-variant/25 bg-surface-container-low px-4 py-4 no-underline transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-on-background">{item.label}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      item.status === "Reserved"
                        ? "bg-secondary-container text-secondary"
                        : "bg-primary-container text-primary"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-outline">{item.note}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/30 pt-5">
          <p className="text-xs text-outline">
            © {year} KasiLink · Kopano Labs. Made in South Africa.
          </p>
          <div className="gap-4 flex items-center">
            {legalLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-outline hover:text-primary no-underline"
              >
                {label}
              </Link>
            ))}
            <a href="#main-content" className="text-xs text-outline hover:text-primary no-underline">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
