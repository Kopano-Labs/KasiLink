import Link from "next/link";

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
  { label: "Find Gigs", href: "/marketplace" },
  { label: "Post a Gig", href: "/gigs/new" },
  { label: "Verified Providers", href: "/verified" },
  { label: "Messages", href: "/chat" },
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
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-outline-variant/30 bg-surface-container-low pt-10 pb-6 mt-auto border-t">
      <div className="container">
        {/* Top row */}
        <div className="gap-8 mb-8 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="gap-2 mb-3 inline-flex items-center no-underline"
            >
              <span className="w-7 h-7 rounded-md bg-primary text-on-primary flex items-center justify-center">
                <ZapIcon />
              </span>
              <span className="font-bold text-lg text-on-background tracking-tight">
                Kasi<span className="text-primary">Link</span>
              </span>
            </Link>
            <p className="text-sm text-on-surface-variant max-w-[28rem] leading-[1.65]">
              Connecting township job seekers with nearby gigs and
              opportunities. Built for South Africa, powered by community.
            </p>
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

        {/* Bottom row */}
        <div className="border-outline-variant/30 pt-5 gap-3 flex flex-wrap items-center justify-between border-t">
          <p className="text-xs text-outline">
            © {year} KasiLink. Made in South Africa 🇿🇦
          </p>
          <div className="gap-4 flex">
            {legalLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-outline hover:text-primary no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
