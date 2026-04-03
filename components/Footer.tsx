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

const footerLinks = [
  { label: "Find Gigs", href: "/marketplace" },
  { label: "Post a Gig", href: "/gigs/new" },
  { label: "Community", href: "/forum" },
  { label: "Verified Providers", href: "/verified" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-secondary)",
        padding: "var(--space-10) 0 var(--space-6)",
        marginTop: "auto",
      }}
    >
      <div className="container">
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-8)",
            marginBottom: "var(--space-8)",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                textDecoration: "none",
                marginBottom: "var(--space-3)",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-md)",
                  background: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary-text)",
                }}
              >
                <ZapIcon />
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "var(--font-size-lg)",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Kasi<span style={{ color: "var(--primary)" }}>Link</span>
              </span>
            </Link>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--text-secondary)",
                maxWidth: "28rem",
                lineHeight: 1.65,
              }}
            >
              Connecting township job seekers with nearby gigs and
              opportunities. Built for Gauteng, powered by community.
            </p>
          </div>

          {/* Links */}
          <nav>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                fontWeight: 500,
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "var(--space-3)",
              }}
            >
              Platform
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
              }}
            >
              {footerLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "color var(--transition-fast)",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "var(--space-5)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-3)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--text-tertiary)",
            }}
          >
            © {year} KasiLink. Made in Gauteng 🇿🇦
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            {legalLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: "var(--text-tertiary)",
                  textDecoration: "none",
                }}
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
