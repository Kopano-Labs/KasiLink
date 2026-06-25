import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Clock,
  MapPin,
  MessageSquare,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import LoadSheddingWidget from "@/components/LoadSheddingWidget";
import GrokChatModal from "@/components/GrokChatModal";
import KCCommandStrip from "@/components/KCCommandStrip";
import KopanoStewardDock from "@/components/KopanoStewardDock";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";
import { getRecentGigs } from "@/features/home/recent-gigs";
import {
  formatLiteCurrency,
  getLiteLocations,
  getLiteOverview,
  getLiteRecommendations,
  getSwfusBadgeClass,
  getSwfusUiLabel,
} from "@/lib/lite-investor-discovery";

export const dynamic = "force-dynamic";

type HomeGig = {
  _id: string;
  title: string;
  description: string;
  payDisplay: string;
  category: string;
  isUrgent?: boolean;
  isProviderVerified?: boolean;
  location?: {
    suburb?: string | null;
    city?: string | null;
  } | null;
};

const commandRoutes = [
  {
    title: "Scan live gigs",
    description:
      "Open the work board first. Sort by urgency, pay, and what is actually close enough to act on today.",
    href: "/marketplace",
    cta: "Open marketplace",
    meta: "Work near you",
    Icon: Briefcase,
  },
  {
    title: "Post urgent work",
    description:
      "Dispatch a nearby job without forcing the whole neighbourhood through a heavy hiring process.",
    href: "/gigs/new",
    cta: "Post a gig",
    meta: "Fast route",
    Icon: Zap,
  },
  {
    title: "Read community signals",
    description:
      "Check incidents, local demand, and neighbourhood context before you spend transport, time, or money.",
    href: "/forum",
    cta: "Open community",
    meta: "Coordination",
    Icon: Users,
  },
  {
    title: "Open Lite mode",
    description:
      "Switch to the lower-data investor and opportunity scan when you need a fast township intelligence layer.",
    href: "/lite",
    cta: "Open Lite",
    meta: "Investor Discovery",
    Icon: TrendingUp,
  },
];

const operatingPrinciples = [
  {
    title: "Distance is a real cost",
    body:
      "KasiLink treats proximity as part of the product. Nearby work reduces failed trips, transport spend, and dead waiting time.",
  },
  {
    title: "Trust belongs on the same screen",
    body:
      "Verified providers, community notes, and direct messaging work as one local trust loop instead of a disconnected stack.",
  },
  {
    title: "The network should absorb disruption",
    body:
      "Utility schedules, water alerts, and local updates belong inside the work flow because outages change whether work can happen at all.",
  },
];

const communityRoutes = [
  { href: "/incidents", label: "Report an incident", badge: "Safety" },
  { href: "/community-calendar", label: "Community calendar", badge: "Events" },
  { href: "/spotlight", label: "Business spotlight", badge: "Local" },
  { href: "/tutoring", label: "Find a tutor", badge: "Education" },
  { href: "/community-status", label: "Community status", badge: "Live" },
  { href: "/utility-schedule", label: "Utility schedule", badge: "Planning" },
];

const networkSteps = [
  {
    step: "01",
    title: "Spot nearby demand",
    description:
      "Start with a work board, not a dead directory. Urgency, category, and distance should be visible immediately.",
    Icon: Search,
  },
  {
    step: "02",
    title: "Check local friction",
    description:
      "Before moving, inspect utility conditions, community notes, and the trust history around the person or service.",
    Icon: Clock,
  },
  {
    step: "03",
    title: "Coordinate directly",
    description:
      "Use messages and local context to confirm timing, safety, and whether the trip is still worth taking.",
    Icon: MessageSquare,
  },
  {
    step: "04",
    title: "Grow the local graph",
    description:
      "Completed work, reviews, and Lite signals reinforce the neighbourhood network instead of scattering evidence across apps.",
    Icon: Building2,
  },
];

const ecosystemRoutes = [
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
    note: "Venue product",
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
    note: "Game lane",
    status: "Live",
  },
  {
    label: "Kopano Context",
    href: "https://context.kopanolabs.com",
    note: "Reserved domain",
    status: "Reserved",
  },
];

function getGigLocation(gig: HomeGig): string {
  return gig.location?.suburb || gig.location?.city || "Local";
}

export default async function HomePage() {
  const gigs = (await getRecentGigs()) as HomeGig[];
  const liteOverview = getLiteOverview();
  const liteHighlights = getLiteRecommendations(4);
  const liteLocations = getLiteLocations().slice(0, 4);

  const urgentGigCount = gigs.filter((gig) => gig.isUrgent).length;
  const verifiedGigCount = gigs.filter((gig) => gig.isProviderVerified).length;
  const activeGigLocations = new Set(gigs.map(getGigLocation)).size;

  const homeBoardStats = [
    {
      label: "Live gigs",
      value: gigs.length.toString(),
      helper: "Fresh work currently visible on the board",
    },
    {
      label: "Urgent posts",
      value: urgentGigCount.toString(),
      helper: "Jobs that need a fast local response",
    },
    {
      label: "Investor signals",
      value: liteOverview.totalOpportunities.toString(),
      helper: "Lite opportunity cards available now",
    },
    {
      label: "Strong trust marks",
      value: verifiedGigCount.toString(),
      helper: "Visible provider verification on the live board",
    },
  ];

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <Image
                  src="/kasilink-logo.png"
                  alt="KasiLink"
                  width={56}
                  height={56}
                  className="rounded-2xl shadow-lg"
                  priority
                />
              </div>
              <Eyebrow>Township work operating surface</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Local gigs. <span className="text-primary">Near you.</span> Right now.
              </h1>
              <p className="page-hero-description">
                KasiLink is the full neighbourhood work network: nearby gigs, trusted providers,
                community signals, and utility-aware planning on the same surface. The home page
                should help you move, not pitch itself.
              </p>
              <div className="page-hero-actions">
                <Link href="/marketplace" className="btn btn-primary btn-lg">
                  Find gigs near me
                </Link>
                <Link href="/gigs/new" className="btn btn-outline btn-lg">
                  Post urgent work
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="/lite"
                  className="inline-flex items-center gap-2 font-semibold text-primary no-underline"
                >
                  Open Lite mode
                  <ArrowRight size={16} />
                </Link>
                <span className="text-on-surface-variant">
                  Investor Discovery for lower-data scans, funding signals, and fast opportunity reads.
                </span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="mini-stat">
                  <p className="mini-stat-label">Operating logic</p>
                  <p className="mini-stat-value">Closer first</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Distance, transport, and disruption are treated as product realities.
                  </p>
                </div>
                <div className="mini-stat">
                  <p className="mini-stat-label">Trust layer</p>
                  <p className="mini-stat-value">Visible</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Reviews, verification, and community signals sit next to the work.
                  </p>
                </div>
                <div className="mini-stat">
                  <p className="mini-stat-label">Lite mode</p>
                  <p className="mini-stat-value">Low data</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Investor Discovery scans township opportunity without loading the full stack.
                  </p>
                </div>
                <div className="mini-stat">
                  <p className="mini-stat-label">Community role</p>
                  <p className="mini-stat-value">Live</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Forum, status, and alerts help the network absorb ground truth quickly.
                  </p>
                </div>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Today on the network
              </p>
              <MetricGrid items={homeBoardStats} className="mt-4 md:grid-cols-2" />
              <div className="mt-4 rounded-2xl border border-outline-variant/35 bg-surface-container-low p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-on-background">
                      One board, two speeds
                    </p>
                    <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                      Full KasiLink handles gigs, chat, and community coordination. Lite gives a
                      faster scan for opportunity, funding need, and neighbourhood growth signals.
                    </p>
                  </div>
                  <span className="badge badge-primary shrink-0">Lite ready</span>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                        Active gig zones
                      </p>
                      <p className="mt-1 text-sm text-on-background">{activeGigLocations} locations in the live board</p>
                    </div>
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                        Lite funding demand
                      </p>
                      <p className="mt-1 text-sm text-on-background">
                        {formatLiteCurrency(liteOverview.totalFundingNeeded)}
                      </p>
                    </div>
                    <TrendingUp size={18} className="text-primary" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#4595C0]/30 bg-[#4595C0]/5 px-4 py-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#4595C0] text-[10px] font-black text-white">
                  KC
                </div>
                <p className="text-xs font-semibold text-[#4595C0]">
                  Intelligence powered by Kopano Context
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-6">
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <KCCommandStrip />
          <KopanoStewardDock />
        </div>
      </section>

      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Choose a route</Eyebrow>}
          title="Home should help you act in one screen"
          description="These are the product’s primary modes: work, dispatch, community coordination, and Lite investor discovery."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {commandRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="feature-panel group flex h-full flex-col no-underline transition-colors hover:border-primary/45 hover:bg-primary/5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="badge badge-primary">{route.meta}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <route.Icon size={18} />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-black text-on-background group-hover:text-primary">
                {route.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-on-surface-variant">
                {route.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {route.cta}
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Ground truth</Eyebrow>}
          title="The network works because it respects local conditions"
          description="KasiLink is useful when it treats distance, trust, and disruption as real operating inputs instead of edge cases."
        />
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="feature-panel-contrast text-on-background">
            <div className="flex items-center gap-3">
              <span className="badge badge-primary">Why it holds</span>
              <span className="text-xs uppercase tracking-[0.16em] text-outline">
                Product law
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {operatingPrinciples.map((principle, index) => (
                <div
                  key={principle.title}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-black text-white">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{principle.title}</p>
                      <p className="mt-2 text-sm leading-7 text-white/70">{principle.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <LoadSheddingWidget />
            <div className="feature-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="mini-stat-label">Community routes</p>
                  <h3 className="mt-2 text-2xl font-black text-on-background">
                    Check signals before you move
                  </h3>
                </div>
                <Users size={20} className="text-primary" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {communityRoutes.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-low p-3 no-underline transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-outline">
                      {link.badge}
                    </span>
                    <span className="text-sm font-semibold text-on-background group-hover:text-primary">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="success">Live board</Eyebrow>}
          title="Work and investor signals should sit on the same home surface"
          description="Full KasiLink handles local work flow. Lite gives the faster opportunity scan. Both should be legible without leaving the product story."
        />
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-band">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="mini-stat-label">Marketplace pulse</p>
                <h3 className="mt-2 text-2xl font-black text-on-background">Latest local gigs</h3>
              </div>
              <Link href="/marketplace" className="btn btn-outline btn-sm">
                See all gigs
              </Link>
            </div>

            {gigs.length === 0 ? (
              <EmptyStateCard
                title="No gigs yet"
                description="Be the first to post nearby work and give the local board a real starting point."
                action={
                  <Link href="/gigs/new" className="btn btn-primary">
                    Post a gig
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {gigs.slice(0, 4).map((gig) => (
                  <Link
                    key={gig._id}
                    href={`/gigs/${gig._id}`}
                    className="group flex flex-col gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-4 no-underline transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex flex-wrap gap-2">
                      {gig.isUrgent ? <span className="badge badge-danger">Urgent</span> : null}
                      <span className="badge badge-primary">{gig.category.replace("_", " ")}</span>
                      {gig.isProviderVerified ? (
                        <span className="badge badge-success">Verified</span>
                      ) : null}
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-base font-bold text-on-background group-hover:text-primary">
                          {gig.title}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-7 text-on-surface-variant">
                          {gig.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary">{gig.payDisplay}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-outline">
                          {getGigLocation(gig)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="surface-band">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="mini-stat-label">KasiLink Lite</p>
                <h3 className="mt-2 text-2xl font-black text-on-background">
                  Investor Discovery
                </h3>
              </div>
              <Link href="/lite" className="btn btn-primary btn-sm">
                Open Lite
              </Link>
            </div>
            <div className="grid gap-3">
              {liteHighlights.map((opportunity) => (
                <Link
                  key={opportunity.id}
                  href={`/lite?q=${encodeURIComponent(opportunity.location)}#search`}
                  className="group rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-4 no-underline transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={getSwfusBadgeClass(opportunity.swfus_status)}>
                          {getSwfusUiLabel(opportunity.swfus_status)}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                          {opportunity.location} · {opportunity.category}
                        </span>
                      </div>
                      <p className="mt-3 text-base font-bold text-on-background group-hover:text-primary">
                        {opportunity.business_name}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                        {opportunity.recommendation}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-black text-primary">
                        {opportunity.opportunity_score}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-outline">
                        score
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-outline-variant/25 bg-surface-container px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-outline">
                        Funding
                      </p>
                      <p className="mt-1 text-sm font-semibold text-on-background">
                        {formatLiteCurrency(opportunity.funding_needed)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-outline-variant/25 bg-surface-container px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-outline">
                        Jobs
                      </p>
                      <p className="mt-1 text-sm font-semibold text-on-background">
                        {opportunity.jobs_possible}
                      </p>
                    </div>
                    <div className="rounded-xl border border-outline-variant/25 bg-surface-container px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-outline">
                        Risk
                      </p>
                      <p className="mt-1 text-sm font-semibold text-on-background">
                        {opportunity.risk_level}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {liteLocations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-on-background">{location.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-outline">
                        {location.city} · {location.province}
                      </p>
                    </div>
                    <span className="badge badge-primary">{location.opportunity_score}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-outline">Jobs</p>
                      <p className="mt-1 font-semibold text-on-background">
                        {location.total_jobs_possible}
                      </p>
                    </div>
                    <div>
                      <p className="text-outline">Funding</p>
                      <p className="mt-1 font-semibold text-on-background">
                        {formatLiteCurrency(location.total_funding_needed)}
                      </p>
                    </div>
                    <div>
                      <p className="text-outline">Risk</p>
                      <p className="mt-1 font-semibold text-on-background">{location.risk_score}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Core loop</Eyebrow>}
          title="How the network closes distance"
          description="This is not a static directory. It is a local work loop that should move someone from signal to action with less friction."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {networkSteps.map((step) => (
            <article key={step.step} className="kasi-card h-full">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.Icon size={18} />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-outline">
                  Step {step.step}
                </p>
              </div>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Ecosystem</Eyebrow>}
          title="KasiLink should route through the same public graph"
          description="The full work network, the investor Lite mode, the portfolio, the arena, the blog, and the game should all read as one connected system."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ecosystemRoutes.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="feature-panel no-underline transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-bold text-on-background">{item.label}</p>
                <span
                  className={`badge ${item.status === "Reserved" ? "badge-secondary" : "badge-primary"}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.note}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="container pb-6">
        <div className="page-hero">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow tone="success">Switch mode when needed</Eyebrow>
              <h2 className="page-hero-title mt-4 font-headline font-black text-on-background">
                Full network for work. Lite for the fast scan.
              </h2>
              <p className="page-hero-description">
                Use the full KasiLink stack when you need gigs, providers, messages, and local
                coordination. Switch to Lite when you need the lower-data investor or business
                discovery path.
              </p>
              <div className="page-hero-actions">
                <Link href="/marketplace" className="btn btn-primary btn-lg">
                  Open full KasiLink
                </Link>
                <Link href="/lite" className="btn btn-outline btn-lg">
                  Open Lite mode
                </Link>
              </div>
            </div>
            <div className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                What stays on one surface
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                    Work
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Find gigs, post jobs, and move quickly when nearby demand shows up.
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                    Trust
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Verified providers, messages, and community context reduce guesswork.
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                    Opportunity
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Lite turns township activity into a ranked investor and growth signal layer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GrokChatModal />
    </div>
  );
}
