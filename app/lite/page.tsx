import Link from "next/link";
import { ArrowRight, MapPin, Search, TrendingUp, Wallet, BriefcaseBusiness } from "lucide-react";
import {
  EmptyStateCard,
  Eyebrow,
  MetricGrid,
  SectionHeading,
} from "@/components/ui/PagePrimitives";
import {
  formatLiteCurrency,
  getLiteLocations,
  getLiteOverview,
  getLiteRecommendations,
  getSwfusBadgeClass,
  getSwfusUiLabel,
  searchLiteOpportunities,
} from "@/lib/lite-investor-discovery";
import LiteWalletSpineSection from "@/components/wallet/LiteWalletSpineSection";

type LitePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readQuery(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function LitePage({ searchParams }: LitePageProps) {
  const params = await searchParams;
  const query = readQuery(params.q).trim();
  const overview = getLiteOverview();
  const locations = getLiteLocations();
  const recommendations = getLiteRecommendations(4);
  const searchResults = query ? searchLiteOpportunities(query) : [];

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <Eyebrow>KasiLink Lite</Eyebrow>
              <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
                A faster way to scan township opportunity.
              </h1>
              <p className="page-hero-description">
                KasiLink Lite helps investors, builders, and community leaders discover local
                businesses, funding needs, job potential, and impact signals without loading the
                full platform.
              </p>
              <div className="page-hero-actions">
                <a href="#investor-discovery" className="btn btn-primary btn-lg">
                  Explore investor discovery
                </a>
                <Link href="/" className="btn btn-outline btn-lg">
                  Open full KasiLink
                </Link>
              </div>
            </div>

            <aside className="page-hero-aside">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
                Lite mode
              </p>
              <MetricGrid
                className="mt-4"
                items={[
                  {
                    label: "Locations",
                    value: overview.totalLocations,
                    helper: "Investable township signals",
                  },
                  {
                    label: "Opportunities",
                    value: overview.totalOpportunities,
                    helper: "Seeded for fast ranking",
                  },
                  {
                    label: "Strong signals",
                    value: overview.strongSignals,
                    helper: "SWFUS Save opportunities",
                  },
                ]}
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="surface-band">
          <SectionHeading
            eyebrow={<Eyebrow tone="neutral">Mode explanation</Eyebrow>}
            title="Lite stays inside KasiLink."
            description="The full platform handles gigs, providers, messages, and local coordination. Lite gives a lower-data path for opportunity discovery and investor-ready scanning."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="kasi-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin size={18} />
              </div>
              <h3 className="mt-4 text-lg font-bold">Location-led</h3>
              <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                Scan township opportunity by place before going deeper into the full network.
              </p>
            </article>
            <article className="kasi-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp size={18} />
              </div>
              <h3 className="mt-4 text-lg font-bold">Ranked signal</h3>
              <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                Impact, jobs, funding need, risk, and confidence stay visible in one card scan.
              </p>
            </article>
            <article className="kasi-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wallet size={18} />
              </div>
              <h3 className="mt-4 text-lg font-bold">Low-data first</h3>
              <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                Fewer moving parts, smaller surfaces, and clearer story for weak connectivity conditions.
              </p>
            </article>
            <article className="kasi-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BriefcaseBusiness size={18} />
              </div>
              <h3 className="mt-4 text-lg font-bold">Investor discovery</h3>
              <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                Turn township activity into investable intelligence without building a separate product.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="investor-discovery" className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="success">Investor Discovery Mode</Eyebrow>}
          title="Fast township opportunity discovery for low-data conditions"
          description="Turn township activity into investable intelligence. Explore local businesses, rank opportunity, and identify where capital can create jobs closest to home."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="kasi-card">
            <p className="mini-stat-label">Total locations</p>
            <p className="mt-3 text-3xl font-black text-on-background">{overview.totalLocations}</p>
          </article>
          <article className="kasi-card">
            <p className="mini-stat-label">Total opportunities</p>
            <p className="mt-3 text-3xl font-black text-on-background">{overview.totalOpportunities}</p>
          </article>
          <article className="kasi-card">
            <p className="mini-stat-label">Jobs possible</p>
            <p className="mt-3 text-3xl font-black text-on-background">{overview.totalJobsPossible}</p>
          </article>
          <article className="kasi-card">
            <p className="mini-stat-label">Funding needed</p>
            <p className="mt-3 text-3xl font-black text-on-background">
              {formatLiteCurrency(overview.totalFundingNeeded)}
            </p>
          </article>
        </div>
      </section>

      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="success">Wallet spine pilot</Eyebrow>}
          title="Connect a devnet wallet without leaving Lite"
          description="This is the first shared wallet lane for the ecosystem: external custody, devnet only, and small enough to prove before deeper on-chain features are added to other MVPs."
        />
        <LiteWalletSpineSection />
      </section>

      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Locations</Eyebrow>}
          title="Where the current signals are coming from"
          description="Each location card gives a quick read on opportunity, risk, total funding demand, and job potential."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {locations.map((location) => (
            <article key={location.id} className="kasi-card flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                    {location.city}, {location.province}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{location.name}</h3>
                </div>
                <span className="badge badge-primary">{location.total_opportunities} live</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
                  <p className="mini-stat-label">Opportunity</p>
                  <p className="mt-2 text-2xl font-black">{location.opportunity_score}</p>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
                  <p className="mini-stat-label">Risk</p>
                  <p className="mt-2 text-2xl font-black">{location.risk_score}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                {formatLiteCurrency(location.total_funding_needed)} in current funding demand with{" "}
                {location.total_jobs_possible} potential jobs across seeded signals.
              </p>
              <Link
                href={`/lite?q=${encodeURIComponent(location.name)}#search`}
                className="btn btn-outline btn-sm mt-auto"
              >
                View opportunities
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-10">
        <SectionHeading
          eyebrow={<Eyebrow tone="success">Top recommendations</Eyebrow>}
          title="Ranked opportunities"
          description="These cards show the first investor-ready story: funding need, jobs possible, risk, confidence, and the recommendation itself."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {recommendations.map((opportunity) => (
            <article key={opportunity.id} className="feature-panel flex h-full flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className={getSwfusBadgeClass(opportunity.swfus_status)}>
                  {getSwfusUiLabel(opportunity.swfus_status)}
                </span>
                <span className="badge badge-primary">{opportunity.category}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                  {opportunity.location}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-black text-on-background">
                {opportunity.business_name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                {opportunity.description}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
                  <p className="mini-stat-label">Funding</p>
                  <p className="mt-2 font-bold">{formatLiteCurrency(opportunity.funding_needed)}</p>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
                  <p className="mini-stat-label">Jobs</p>
                  <p className="mt-2 font-bold">{opportunity.jobs_possible}</p>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
                  <p className="mini-stat-label">Risk</p>
                  <p className="mt-2 font-bold">{opportunity.risk_level}</p>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
                  <p className="mini-stat-label">Score</p>
                  <p className="mt-2 font-bold">{opportunity.opportunity_score}</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Recommendation
                </p>
                <p className="mt-2 text-sm font-semibold text-on-background">
                  {opportunity.recommendation}
                </p>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  {opportunity.reason}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="search" className="container pb-12">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Search</Eyebrow>}
          title="Search township, category, or business type"
          description="Use Lite as a fast scan surface before moving back into the full platform."
        />

        <div className="filter-shell">
          <form action="/lite" className="flex flex-col gap-3 md:flex-row">
            <label className="sr-only" htmlFor="lite-search">
              Search Lite opportunities
            </label>
            <input
              id="lite-search"
              name="q"
              defaultValue={query}
              className="kasi-input flex-1"
              placeholder="Search Soweto, repair, food, tutoring..."
            />
            <button type="submit" className="btn btn-primary">
              <Search size={16} />
              Search
            </button>
          </form>
        </div>

        {query ? (
          <div className="mt-6">
            <p className="mb-4 text-sm text-on-surface-variant">
              Showing {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-on-background">{query}</span>.
            </p>
            {searchResults.length === 0 ? (
              <EmptyStateCard
                title="No Lite matches yet"
                description="Try a township name, category, or business type. Lite search checks location, business name, category, and recommendation text."
                action={
                  <Link href="/lite" className="btn btn-primary">
                    Reset search
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {searchResults.map((opportunity) => (
                  <article key={opportunity.id} className="kasi-card flex h-full flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={getSwfusBadgeClass(opportunity.swfus_status)}>
                        {getSwfusUiLabel(opportunity.swfus_status)}
                      </span>
                      <span className="badge badge-secondary">{opportunity.location}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold">{opportunity.business_name}</h3>
                    <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                      {opportunity.category}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                      {opportunity.reason}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-4">
                      <div>
                        <p className="mini-stat-label">Funding needed</p>
                        <p className="mt-1 font-bold">{formatLiteCurrency(opportunity.funding_needed)}</p>
                      </div>
                      <div className="text-right">
                        <p className="mini-stat-label">Jobs possible</p>
                        <p className="mt-1 font-bold">{opportunity.jobs_possible}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-outline">
            Open Full KasiLink
          </Link>
          <Link href="/spotlight" className="btn btn-ghost">
            Business Spotlight <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
