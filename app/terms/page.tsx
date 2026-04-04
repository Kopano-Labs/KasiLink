import Link from "next/link";

const sections = [
  {
    icon: "📜",
    title: "Introduction",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          These Terms of Service govern your use of KasiLink. By accessing or
          using the platform, you agree to follow these terms and any related
          policies that apply to your account, your content, and your use of the
          marketplace.
        </p>
        <p className="leading-relaxed">
          KasiLink is built for township communities in South Africa. The
          service exists to connect people with opportunities, trusted providers,
          and local information in a practical and respectful way.
        </p>
      </div>
    ),
  },
  {
    icon: "👥",
    title: "Who Can Use KasiLink",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          You must be at least 18 years old, live in South Africa, and have a
          valid phone number or other contact details that let us reach you.
          You are responsible for keeping your account information accurate and
          up to date.
        </p>
        <p className="leading-relaxed">
          If you use KasiLink on behalf of a business, organisation, or
          community group, you must have the authority to do so and must make
          sure your use follows these terms.
        </p>
      </div>
    ),
  },
  {
    icon: "🧭",
    title: "What KasiLink Is",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          KasiLink is a marketplace and community platform. We are not an
          employer, recruiter, contractor, or agent for any gig poster or gig
          worker. We only provide the platform that helps people find and share
          local opportunities.
        </p>
        <p className="leading-relaxed">
          KasiLink does not control whether a gig is completed successfully, and
          we are not responsible for the outcome of any agreement made between
          users.
        </p>
      </div>
    ),
  },
  {
    icon: "📝",
    title: "Gig Poster Responsibilities",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          If you post a gig, you must describe it accurately, publish only legal
          work, and offer the payment or benefit you promised. False, misleading,
          or harmful listings are not allowed.
        </p>
        <p className="leading-relaxed">
          You are responsible for replying honestly to applicants, respecting the
          people who apply, and making sure the work you request follows South
          African law and community standards.
        </p>
      </div>
    ),
  },
  {
    icon: "🛠️",
    title: "Gig Worker Responsibilities",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          If you apply for gigs, only apply for work you can genuinely perform.
          Keep your communication professional and only accept jobs you intend
          to complete.
        </p>
        <p className="leading-relaxed">
          You must not misrepresent your skills, submit false details, or abuse
          the platform to pressure other users.
        </p>
      </div>
    ),
  },
  {
    icon: "⛔",
    title: "Prohibited Content",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          You may not post fake gigs, harass other users, promote illegal
          services, or upload content that is abusive, deceptive, or harmful.
          KasiLink may remove content that breaks these rules.
        </p>
        <p className="leading-relaxed">
          We may also suspend or close accounts that try to scam people, exploit
          the community, or interfere with the safety of the platform.
        </p>
      </div>
    ),
  },
  {
    icon: "©️",
    title: "Intellectual Property",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          Content you post remains yours. By posting it on KasiLink, you grant us
          a limited licence to host, display, and share that content on the
          platform so that other users can see it.
        </p>
        <p className="leading-relaxed">
          You must not upload content that you do not have the right to share.
        </p>
      </div>
    ),
  },
  {
    icon: "🔐",
    title: "Data and Privacy",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          We handle personal information in line with our Privacy Policy and the
          Protection of Personal Information Act (POPIA). Please read the
          privacy page for the full disclosure of how we collect, use, store,
          and protect your data.
        </p>
        <p className="leading-relaxed">
          <Link href="/privacy" className="text-primary font-semibold underline">
            View our Privacy Policy
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    icon: "⚖️",
    title: "Limitation of Liability",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          KasiLink is not liable for the outcome of any gig, any dispute between
          users, or any losses that happen because a user gave false information
          or broke an agreement.
        </p>
        <p className="leading-relaxed">
          Use the platform responsibly and confirm important details directly
          with the other party before you commit to any work.
        </p>
      </div>
    ),
  },
  {
    icon: "🚫",
    title: "Termination",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          We may suspend or terminate your access if you violate these terms,
          misuse the platform, or put other users at risk.
        </p>
        <p className="leading-relaxed">
          Where appropriate, we may also remove content, limit features, or take
          other steps needed to protect the community.
        </p>
      </div>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <div className="mb-10">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wider uppercase mb-4">
          Legal
        </span>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2">
          Terms of Service at{" "}
          <span className="text-primary italic">KasiLink</span>
        </h1>
        <p className="text-on-surface-variant italic text-lg">
          Last Updated: April 2026
        </p>
        <div className="h-1.5 w-24 bg-primary rounded-full mt-4" />
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-lg">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold font-headline">
                {section.title}
              </h2>
            </div>
            <div className="kasi-card">{section.content}</div>
          </section>
        ))}

        <section className="pt-8 text-center space-y-4">
          <p className="text-sm text-on-surface-variant">
            Questions about these terms? Contact the KasiLink team.
          </p>
          <a
            className="inline-block font-bold text-primary border-b-2 border-primary/30 hover:border-primary transition-colors px-1"
            href="mailto:kasilink.rsa@gmail.com"
          >
            kasilink.rsa@gmail.com
          </a>
          <div className="pt-4">
            <Link href="/" className="text-sm text-on-surface-variant hover:text-primary">
              ← Back to Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
