import Link from "next/link";
import connectDB from "@/lib/db";
import Gig from "@/lib/models/Gig";

export const dynamic = "force-dynamic";

async function getRecentGigs() {
  try {
    await connectDB();
    const gigs = await Gig.find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    return gigs;
    
    // Prevent Next.js serialization crash with Mongoose ObjectId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return gigs.map((gig: any) => ({
      ...gig,
      _id: gig._id.toString(),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const gigs = await getRecentGigs();

  return (
    <div style={{ paddingBottom: "var(--space-12)" }}>

    <div className="pb-12">
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--surface-1) 100%)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "var(--space-12) 0",
      }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
          <span style={{
            display: "inline-block", marginBottom: "var(--space-4)",
            padding: "4px 14px", borderRadius: "var(--radius-full)",
            background: "var(--primary-subtle)", color: "var(--primary)",
            fontSize: "var(--font-size-xs)", fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
      <section className="from-surface-variant to-background border-outline-variant/30 py-12 border-b bg-gradient-to-br">
        <div className="max-w-screen-sm container mx-auto text-center">
          <span className="mb-4 px-3 py-1 bg-primary-container text-primary text-xs font-semibold tracking-wider inline-block rounded-full uppercase">
            Gauteng&apos;s Township Platform
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em", marginBottom: "var(--space-4)" }}>
          <h1 className="text-4xl md:text-5xl tracking-tight mb-4 font-headline font-black">
            Local gigs.<br />
            <span style={{ color: "var(--primary)" }}>Near you.</span> Right now.
            <span className="text-primary">Near you.</span> Right now.
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-lg)", marginBottom: "var(--space-8)", lineHeight: 1.6 }}>
          <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
            57% youth unemployment. KasiLink connects job seekers with nearby gigs — no CV, no commute, no queues.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
          <div className="gap-3 flex flex-wrap justify-center">
            <Link href="/marketplace" className="btn btn-primary btn-lg">
              Find Gigs Near Me
            </Link>
            <Link href="/gigs/new" className="btn btn-secondary btn-lg">
            <Link href="/gigs/new" className="btn btn-outline btn-lg">
              Post a Gig
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
      <section className="border-outline-variant/30 bg-surface-container-low border-b">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-10)", padding: "var(--space-5) 0", flexWrap: "wrap" }}>
          <div className="gap-10 py-5 flex flex-wrap justify-center">
            {[
              { value: "31.4%", label: "SA Unemployment" },
              { value: "57%", label: "Youth Without Work" },
              { value: "5km", label: "Average Gig Distance" },
              { value: "0", label: "CV Required" },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--primary)" }}>{value}</div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-tertiary)", marginTop: 2 }}>{label}</div>
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-primary font-headline">{value}</div>
                <div className="text-xs text-on-surface-variant mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Load-shedding notice */}
      <div className="container" style={{ paddingTop: "var(--space-6)" }}>
        <div style={{
          padding: "var(--space-3) var(--space-4)",
          borderRadius: "var(--radius-lg)",
          background: "var(--primary-subtle)",
          border: "1px solid var(--primary)",
          display: "flex", alignItems: "center", gap: "var(--space-3)",
          fontSize: "var(--font-size-sm)",
        }}>
      <div className="pt-6 container">
        <div className="px-4 py-3 rounded-lg bg-primary-container border-primary gap-3 text-sm text-on-primary-container flex items-center border">
          <span>⚡</span>
          <span style={{ color: "var(--text-primary)" }}>
          <span>
            <strong>Load-shedding aware</strong> — gig providers can flag LS schedules so you plan around outages.
          </span>
        </div>
      </div>

      {/* Recent Gigs */}
      <section className="container" style={{ paddingTop: "var(--space-10)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-6)" }}>
          <h2>Latest Gigs</h2>
          <Link href="/marketplace" style={{ fontSize: "var(--font-size-sm)", color: "var(--primary)" }}>
      <section className="pt-10 container">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-headline font-bold text-2xl">Latest Gigs</h2>
          <Link href="/marketplace" className="text-sm text-primary hover:underline">
            See all →
          </Link>
        </div>

        {gigs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-12) 0", color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: "var(--space-4)" }}>No gigs yet — be the first to post one.</p>
          <div className="py-12 text-on-surface-variant text-center">
            <p className="mb-4">No gigs yet — be the first to post one.</p>
            <Link href="/gigs/new" className="btn btn-primary">Post a Gig</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
            {gigs.map((gig) => (
              <Link key={String(gig._id)} href={`/gigs/${gig._id}`} style={{ textDecoration: "none" }}>
                <div className="kasi-card" style={{ cursor: "pointer", height: "100%" }}>
          <div className="sm:grid-cols-2 md:grid-cols-3 gap-4 grid grid-cols-1">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {gigs.map((gig: any) => (
              <Link key={gig._id} href={`/gigs/${gig._id}`} className="block no-underline">
                <div className="kasi-card hover:border-primary flex h-full cursor-pointer flex-col transition-colors">
                  {gig.isUrgent && (
                    <span className="badge badge-danger" style={{ marginBottom: "var(--space-2)", display: "inline-block" }}>
                    <span className="badge badge-danger mb-2 inline-block self-start">
                      Urgent
                    </span>
                  )}
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div className="gap-2 mb-2.5 flex">
                    <span className="badge badge-primary">{gig.category.replace("_", " ")}</span>
                    {gig.isProviderVerified && <span className="badge badge-success">✓</span>}
                  </div>
                  <h3 style={{ fontSize: "var(--font-size-base)", marginBottom: 6 }}>{gig.title}</h3>
                  <p style={{
                    fontSize: "var(--font-size-sm)", color: "var(--text-secondary)",
                    overflow: "hidden", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: 12,
                  }}>
                  <h3 className="text-base font-bold mb-1.5">{gig.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">
                    {gig.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{gig.payDisplay}</span>
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-tertiary)" }}>
                      📍 {gig.location.suburb}
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-primary">{gig.payDisplay}</span>
                    <span className="text-xs text-outline">
                      📍 {gig.location?.suburb || "Local"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="container" style={{ paddingTop: "var(--space-12)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>How KasiLink Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-5)" }}>
      <section className="pt-12 container">
        <h2 className="mb-8 font-headline font-bold text-2xl text-center">How KasiLink Works</h2>
        <div className="sm:grid-cols-2 md:grid-cols-4 gap-5 grid grid-cols-1">
          {[
            { icon: "📱", step: "1", title: "Sign up with your phone", desc: "No email needed. Just your SA number (+27)." },
            { icon: "📍", step: "2", title: "Find gigs near you", desc: "Browse by category or let us show nearby opportunities." },
            { icon: "💬", step: "3", title: "Chat & coordinate", desc: "Message providers directly. No middleman." },
            { icon: "✅", step: "4", title: "Get paid", desc: "Complete the gig and build your verified reputation." },
          ].map(({ icon, step, title, desc }) => (
            <div key={step} className="kasi-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>{icon}</div>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--primary)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
            <div key={step} className="kasi-card flex flex-col items-center text-center">
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-xs text-primary font-semibold mb-2">
                STEP {step}
              </div>
              <h3 style={{ fontSize: "var(--font-size-base)", marginBottom: "var(--space-2)" }}>{title}</h3>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>{desc}</p>
              <h3 className="text-base font-bold mb-2">{title}</h3>
              <p className="text-sm text-on-surface-variant">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "var(--primary-subtle)", borderTop: "1px solid var(--border-subtle)",
        marginTop: "var(--space-12)",
      }}>
        <div className="container" style={{ textAlign: "center", padding: "var(--space-12) 0" }}>
          <h2 style={{ marginBottom: "var(--space-4)" }}>Ready to start?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
      <section className="bg-primary-container border-outline-variant/30 mt-12 border-t">
        <div className="py-12 container text-center">
          <h2 className="font-headline font-bold text-2xl mb-4 text-on-primary-container">Ready to start?</h2>
          <p className="text-on-surface-variant mb-6">
            Join thousands of Gauteng residents finding work in their neighbourhood.
          </p>
          <Link href="/sign-in" className="btn btn-primary btn-lg">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
