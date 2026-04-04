import Link from "next/link";

const sections = [
  {
    icon: "ℹ️",
    title: "Introduction",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          Welcome to KasiLink. We respect your privacy and are committed to
          protecting your personal data. This privacy policy will inform you as
          to how we look after your personal data when you visit our app and tell
          you about your privacy rights and how the law protects you in the South
          African context.
        </p>
        <p className="leading-relaxed">
          KasiLink is built on trust. Whether you&apos;re connecting with local
          services in Soweto or shopping from a boutique in Khayelitsha, your
          security is our pulse.
        </p>
      </div>
    ),
  },
  {
    icon: "🔍",
    title: "Information Collection",
    content: (
      <div className="space-y-6">
        <p className="leading-relaxed">
          We collect, use, store and transfer different kinds of personal data
          about you which we have grouped together as follows:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
            <span className="text-lg mt-0.5">🪪</span>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide">
                Identity Data
              </h4>
              <p className="text-sm text-on-surface-variant">
                First name, last name, username or similar identifier.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
            <span className="text-lg mt-0.5">📍</span>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide">
                Contact Data
              </h4>
              <p className="text-sm text-on-surface-variant">
                Address, email address and telephone numbers.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
            <span className="text-lg mt-0.5">📊</span>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide">
                Usage Data
              </h4>
              <p className="text-sm text-on-surface-variant">
                Information about how you use our app and services.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
            <span className="text-lg mt-0.5">📱</span>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide">
                Technical Data
              </h4>
              <p className="text-sm text-on-surface-variant">
                IP address, browser type, device information, and location data.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "📈",
    title: "Data Usage",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          We will only use your personal data when the law allows us to. Most
          commonly, we will use your personal data in the following
          circumstances:
        </p>
        <ul className="space-y-3">
          {[
            "To register you as a new user on KasiLink.",
            "To connect you with gig opportunities and service providers.",
            "To manage our relationship with you, including notifications.",
            "To improve our app, services, and marketing.",
            "To recommend gigs or providers relevant to your area.",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="text-primary text-sm">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    icon: "🔒",
    title: "Security",
    highlighted: true,
    content: (
      <div className="space-y-4">
        <p className="text-lg font-medium">Your data is locked tight.</p>
        <p className="text-sm opacity-80 leading-relaxed">
          We have put in place appropriate security measures to prevent your
          personal data from being accidentally lost, used or accessed in an
          unauthorised way, altered or disclosed. In addition, we limit access to
          your personal data to those employees, agents, contractors and other
          third parties who have a business need to know. They will only process
          your personal data on our instructions and they are subject to a duty
          of confidentiality.
        </p>
      </div>
    ),
  },
  {
    icon: "🇿🇦",
    title: "POPIA Compliance",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          KasiLink complies with the Protection of Personal Information Act
          (POPIA) of South Africa. Under POPIA, you have the right to:
        </p>
        <ul className="space-y-3">
          {[
            "Access your personal information we hold about you.",
            "Request correction of incomplete or inaccurate data.",
            "Request deletion of your personal information.",
            "Object to processing of your personal data.",
            "Lodge a complaint with the Information Regulator.",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="text-primary text-sm">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <div className="mb-10">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wider uppercase mb-4">
          Compliance
        </span>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2">
          Your Privacy at <span className="text-primary italic">KasiLink</span>
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
            {section.highlighted ? (
              <div className="relative overflow-hidden bg-on-background text-background rounded-2xl p-8">
                {section.content}
              </div>
            ) : (
              <div className="kasi-card">{section.content}</div>
            )}
          </section>
        ))}

        <section className="pt-8 text-center space-y-4">
          <p className="text-sm text-on-surface-variant">
            Still have questions? Reach out to our team.
          </p>
          <a
            className="inline-block font-bold text-primary border-b-2 border-primary/30 hover:border-primary transition-colors px-1"
            href="mailto:privacy@kasilink.co.za"
          >
            privacy@kasilink.co.za
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
