"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeProvider";
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UsersIcon, 
  MessageIcon, 
  PlusIcon, 
  MenuIcon, 
  XIcon, 
  ZapIcon 
} from "./icons/NavIcons";
import NotificationDropdown from "./NotificationDropdown";
import MobileTabBar from "./MobileTabBar";

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/marketplace", label: "Gigs", icon: BriefcaseIcon },
  { href: "/forum", label: "Community", icon: UsersIcon },
  { href: "/studio", label: "Studio", icon: ZapIcon },
  { href: "/chat", label: "Messages", icon: MessageIcon },
  { href: "/lite", label: "Lite", icon: ZapIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState("");
  const notificationsRef = useRef<HTMLDivElement>(null);

  const mobilePrimaryLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/marketplace", label: "Gigs", icon: BriefcaseIcon },
    { href: "/forum", label: "Forum", icon: UsersIcon },
    { href: "/lite", label: "Lite", icon: ZapIcon },
    {
      href: isLoaded && isSignedIn ? "/profile" : "/sign-in",
      label: isLoaded && isSignedIn ? "Profile" : "Join",
      icon: UsersIcon,
    },
  ];

  const refreshNotifications = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setNotificationsLoading(true);
    setNotificationsError("");
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) {
        throw new Error("Failed to load notifications.");
      }
      const data = await res.json();
      const nextNotifications = data.notifications ?? [];
      setNotifications(nextNotifications);
      setUnreadCount(
        nextNotifications.filter((n: AppNotification) => !n.isRead).length,
      );
    } catch {
      setNotificationsError("Failed to load notifications.");
    } finally {
      setNotificationsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Scroll shadow effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Fetch notifications
  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

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

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifs(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifs(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className={`fixed top-0 left-0 right-0 z-[200] border-b bg-background/86 backdrop-blur-xl transition-all duration-250 ${
          scrolled
            ? "border-outline-variant/40 shadow-[0_20px_45px_rgba(0,0,0,0.16)]"
            : "border-transparent"
        }`}
      >
        <div className="container flex h-[4.1rem] items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 no-underline"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#121212] shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
              <Image
                src="/kasilink-logo.png"
                alt="KasiLink Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-black tracking-tight text-on-background">
                Kasi<span className="text-primary">Link</span>
              </span>
              <span className="hidden xl:block text-[10px] uppercase tracking-[0.22em] text-outline">
                Township-first work network
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden flex-1 items-center gap-1 md:flex">
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
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                    active
                      ? "bg-primary-container font-semibold text-primary"
                      : "font-medium text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden xl:block rounded-full border border-outline-variant/35 bg-surface-container-low px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
              Closer first · Lite ready
            </div>
            <ThemeToggle />

            {/* Post gig CTA (signed in only) */}
            {isLoaded && isSignedIn && (
              <Link
                href="/gigs/new"
                className="hidden gap-1 md:inline-flex btn btn-primary btn-sm"
              >
                <PlusIcon />
                Post Gig
              </Link>
            )}

            {/* Auth section with Notifications */}
            {isLoaded &&
              (isSignedIn ? (
                <div className="flex items-center gap-3">
                  <NotificationDropdown 
                    notifications={notifications}
                    unreadCount={unreadCount}
                    loading={notificationsLoading}
                    error={notificationsError}
                    show={showNotifs}
                    onToggle={handleToggleNotifs}
                    onRefresh={() => void refreshNotifications()}
                    onClose={() => setShowNotifs(false)}
                    dropdownRef={notificationsRef}
                  />
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
              className="btn btn-ghost btn-sm p-2 hide-desktop"
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
          <div className="flex flex-col gap-2 border-t border-outline-variant/30 bg-surface-container-low p-4 md:hidden">
            <div className="mb-2 rounded-2xl border border-outline-variant/30 bg-surface-container px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-outline">
                Township board
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                KC reviews. Cassy teaches. Lite scans fast. Use this menu to move between the work network and the lower-data route.
              </p>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <Link
                href="/gigs/new"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl border border-outline-variant/30 bg-background px-4 py-3 no-underline"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                  Dispatch
                </p>
                <p className="mt-1 text-sm font-semibold text-on-background">Post work fast</p>
              </Link>
              <Link
                href="/lite"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl border border-outline-variant/30 bg-background px-4 py-3 no-underline"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                  Lite
                </p>
                <p className="mt-1 text-sm font-semibold text-on-background">Investor discovery</p>
              </Link>
            </div>
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base transition-colors ${
                    active
                      ? "bg-primary-container font-semibold text-primary"
                      : "font-medium text-on-background hover:bg-primary-subtle"
                  }`}
                  aria-current={active ? "page" : undefined}
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
                className="mt-2 justify-center btn btn-primary"
              >
                <PlusIcon />
                Post a Gig
              </Link>
            )}

            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="mt-2 w-full btn btn-primary">
                  Sign In to KasiLink
                </button>
              </SignInButton>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar links={mobilePrimaryLinks} pathname={pathname} />
    </>
  );
}
