import Link from "next/link";

const discussionTopics = [
  {
    title: "Local hustle tips",
    description:
      "Share what is working in your area, from pricing to finding repeat clients.",
  },
  {
    title: "Safety and scam alerts",
    description:
      "Post community warnings and practical checks before taking a gig.",
  },
  {
    title: "Tools, training, and referrals",
    description:
      "Exchange referrals, short courses, and resources that help people earn.",
  },
];

const trustGuidelines = [
  "Confirm pay, timing, and location before meeting.",
  "Use verified profiles when you can, especially for first-time jobs.",
  "Report suspicious listings or unsafe behavior through the community flow.",
];

export default function ForumPage() {
  return (
    <div className="container pt-8 pb-12 max-w-5xl mx-auto">
      <section className="mb-8 text-center">
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary-container text-primary text-xs font-semibold tracking-wider uppercase">
          Community
        </span>
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-3">
          KasiLink Community
        </h1>
        <p className="text-on-surface-variant text-base max-w-2xl mx-auto">
          A shared space for neighbours, job seekers, and providers to swap
          advice, opportunities, and local updates.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {discussionTopics.map((topic) => (
          <article key={topic.title} className="kasi-card">
            <h2 className="font-bold text-lg mb-2">{topic.title}</h2>
            <p className="text-sm text-on-surface-variant">
              {topic.description}
            </p>
          </article>
        ))}
      </section>

      <section className="kasi-card mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-headline text-xl font-bold mb-2">
              Community trust rules
            </h2>
            <p className="text-sm text-on-surface-variant">
              Simple checks that keep local work exchanges safer and reduce
              avoidable disputes.
            </p>
          </div>
          <Link href="/verified" className="btn btn-outline">
            Browse verified providers
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {trustGuidelines.map((item) => (
            <div key={item} className="rounded-xl bg-surface-container-low p-4">
              <p className="text-sm text-on-surface-variant">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="kasi-card text-center">
        <h2 className="font-headline text-2xl font-bold mb-3">
          Forum features are being prepared
        </h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto mb-6">
          The route is live now so community navigation works, and we can build
          out posting, replies, and moderation on top of this page without
          breaking links in production.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/marketplace" className="btn btn-primary">
            Browse Gigs
          </Link>
          <Link href="/verified" className="btn btn-outline">
            View Verified Providers
          </Link>
          <Link href="/water-outages" className="btn btn-outline">
            Utility Alerts
          </Link>
        </div>
      </section>
    </div>
  );
}
