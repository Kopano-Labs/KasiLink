"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";

// Icons as inline SVG to avoid extra deps
const BriefcaseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/marketplace", label: "Find Gigs", icon: BriefcaseIcon },
  { href: "/forum", label: "Community", icon: UsersIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll shadow effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: "var(--z-sticky)",
          background: "var(--nav-bg)",
          borderBottom: `1px solid ${scrolled ? "var(--nav-border)" : "transparent"}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition:
            "border-color var(--transition-base), box-shadow var(--transition-base)",
          boxShadow: scrolled ? "0 1px 16px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            height: "3.75rem",
            gap: "var(--space-6)",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-lg)",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-text)",
                flexShrink: 0,
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

          {/* Desktop nav links */}
          <div
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
              flex: 1,
            }}
          >
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-3)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: active ? 500 : 400,
                    color: active ? "var(--primary)" : "var(--text-secondary)",
                    background: active
                      ? "var(--primary-subtle)"
                      : "transparent",
                    textDecoration: "none",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              marginLeft: "auto",
            }}
          >
            {/* Post gig CTA (signed in only) */}
            {isLoaded && isSignedIn && (
              <Link
                href="/gigs/new"
                className="btn btn-primary btn-sm hide-mobile"
                style={{ gap: "var(--space-1)" }}
              >
                <PlusIcon />
                Post Gig
              </Link>
            )}

            {/* Auth */}
            {isLoaded &&
              (isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: { width: 34, height: 34 },
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-sm">Sign In</button>
                </SignInButton>
              ))}

            {/* Mobile menu toggle */}
            <button
              className="btn btn-ghost btn-sm hide-desktop"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              style={{ padding: "var(--space-2)" }}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-secondary)",
              padding: "var(--space-4)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "var(--font-size-base)",
                    fontWeight: active ? 500 : 400,
                    color: active ? "var(--primary)" : "var(--text-primary)",
                    background: active
                      ? "var(--primary-subtle)"
                      : "transparent",
                    textDecoration: "none",
                    transition: "background var(--transition-fast)",
                  }}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}

            {isLoaded && isSignedIn && (
              <Link
                href="/gigs/new"
                className="btn btn-primary"
                style={{
                  marginTop: "var(--space-2)",
                  justifyContent: "center",
                }}
              >
                <PlusIcon />
                Post a Gig
              </Link>
            )}

            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button
                  className="btn btn-primary btn-full"
                  style={{ marginTop: "var(--space-2)" }}
                >
                  Sign In to KasiLink
                </button>
              </SignInButton>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
