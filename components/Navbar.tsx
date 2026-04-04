"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeProvider";

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

const MessageIcon = () => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

const BellIcon = () => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

interface AppNotification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/marketplace", label: "Find Gigs", icon: BriefcaseIcon },
  { href: "/forum", label: "Community", icon: UsersIcon },
  { href: "/verified", label: "Verified", icon: UsersIcon },
  { href: "/chat", label: "Messages", icon: MessageIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Scroll shadow effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(
            data.notifications.filter((n: AppNotification) => !n.isRead).length,
          );
        }
      });
  }, [isLoaded, isSignedIn]);

  const handleToggleNotifs = async () => {
    const newState = !showNotifs;
    setShowNotifs(newState);
    if (newState && unreadCount > 0) {
      setUnreadCount(0);
      try {
        await fetch("/api/notifications", { method: "PATCH" });
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] bg-background/90 backdrop-blur-md border-b transition-all duration-250 ${
          scrolled
            ? "border-outline-variant/30 shadow-sm"
            : "border-transparent"
        }`}
      >
        <div className="gap-6 container flex h-[3.75rem] items-center">
          {/* Logo */}
          <Link
            href="/"
            className="gap-2 flex shrink-0 items-center no-underline"
          >
            <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex shrink-0 items-center justify-center">
              <ZapIcon />
            </span>
            <span className="font-bold text-lg text-on-background tracking-tight">
              Kasi<span className="text-primary">Link</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="md:flex gap-1 hidden flex-1 items-center">
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    setMobileOpen(false);
                    setShowNotifs(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? "font-medium text-primary bg-primary-container"
                      : "font-normal text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="gap-3 ml-auto flex items-center">
            <ThemeToggle />

            {/* Post gig CTA (signed in only) */}
            {isLoaded && isSignedIn && (
              <Link
                href="/gigs/new"
                className="btn btn-primary btn-sm md:flex gap-1 hidden"
              >
                <PlusIcon />
                Post Gig
              </Link>
            )}

            {/* Auth */}
            {isLoaded &&
              (isSignedIn ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={handleToggleNotifs}
                      className="btn btn-ghost btn-sm p-2 relative text-on-surface-variant hover:text-on-surface"
                      aria-label="Notifications"
                    >
                      <BellIcon />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1.5 w-2 h-2 bg-danger rounded-full border border-background"></span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifs && (
                      <div className="absolute right-0 mt-2 w-72 max-h-[400px] overflow-y-auto bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg z-50 flex flex-col py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-outline-variant/30 mb-1">
                          <h3 className="font-bold text-sm">Notifications</h3>
                        </div>
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                            No new notifications.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n._id}
                              href={n.link || "#"}
                              onClick={() => setShowNotifs(false)}
                              className="px-4 py-3 hover:bg-surface-variant/50 transition-colors flex flex-col gap-1 border-b border-outline-variant/10 last:border-0"
                            >
                              <span className="text-sm font-bold text-on-background leading-tight">
                                {n.title}
                              </span>
                              <span className="text-xs text-on-surface-variant leading-snug">
                                {n.message}
                              </span>
                              <span className="text-[10px] text-outline mt-1">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </Link>
                          ))
                        )}
                        <div className="px-3 pt-2 border-t border-outline-variant/20">
                          <Link
                            href="/profile"
                            className="text-xs text-primary hover:underline"
                          >
                            Open activity dashboard
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: { width: 34, height: 34 },
                      },
                    }}
                  />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-sm">Sign In</button>
                </SignInButton>
              ))}

            {/* Mobile menu toggle */}
            <button
              className="btn btn-ghost btn-sm md:hidden p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-outline-variant/30 bg-surface-container-low p-4 gap-2 flex flex-col border-t">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                    active
                      ? "font-medium text-primary bg-primary-container"
                      : "font-normal text-on-background hover:bg-primary-subtle"
                  }`}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}

            {isLoaded && isSignedIn && (
              <Link
                href="/gigs/new"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary mt-2 justify-center"
              >
                <PlusIcon />
                Post a Gig
              </Link>
            )}

            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="btn btn-primary mt-2 w-full">
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
