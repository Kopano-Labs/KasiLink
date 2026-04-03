"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/marketplace", icon: "work", label: "Gigs" },
  { href: "/gigs/new", icon: "add_circle", label: "Post", isPost: true },
  { href: "/chat", icon: "chat", label: "Chat" },
  { href: "/profile", icon: "person", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-topbar/95 backdrop-blur-md border-b border-outline-variant">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">link</span>
            <span className="font-headline text-xl font-bold text-primary">
              KasiLink
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/notifications"
              className="relative p-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: { avatarBox: "w-8 h-8" },
                }}
              />
            </SignedIn>
            <SignedOut>
              <Link
                href="/auth/sign-in"
                className="rounded-full bg-primary px-4 py-1.5 font-label text-sm font-medium text-on-primary-container transition-all hover:brightness-110 active:scale-95"
              >
                Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Bottom Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-topbar/95 backdrop-blur-md border-t border-outline-variant md:hidden">
        <div className="flex h-full items-center justify-around px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all ${
                  item.isPost
                    ? "text-primary"
                    : isActive
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    item.isPost ? "text-3xl" : "text-2xl"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-label text-[10px] tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
