<<<<<<< ours
import Link from "next/link";

export const metadata = {
  title: "Terms of Service & POPIA Compliance",
  description:
    "KasiLink Terms of Service and Protection of Personal Information Act (POPIA) compliance.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-screen-md mx-auto pt-8 pb-12 px-4">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2">
          Terms of Service & Privacy
        </h1>
        <p className="text-on-surface-variant font-medium">
          Protection of Personal Information Act (POPIA) Compliance & Platform
          Terms
        </p>
      </div>

      <div className="space-y-6">
        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Welcome to KasiLink. These terms govern your use of our platform. In
            compliance with the Protection of Personal Information Act, 2013
            (POPIA), this document outlines how we collect, process, store, and
            protect your personal information when you use our gig marketplace
            and community services.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">
            2. Eligibility & Age Restrictions
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            By using KasiLink, you represent and warrant that you are at least
            18 years of age. Our platform is intended solely for adult users
            capable of entering into legally binding contracts under South
            African law.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">3. Data We Collect</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
            To provide our services, we collect the following personal
            information:
          </p>
          <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-1 ml-4">
            <li>Identity information (Name, Surname)</li>
            <li>
              Contact information (Phone number, required for secure SMS OTP
              authentication)
            </li>
            <li>
              Location data (Suburb, City, coordinates to match you with nearby
              gigs)
            </li>
            <li>
              Platform activity (Gigs posted, applications, community forum
              posts, messages)
            </li>
          </ul>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">4. How We Use It</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
            Your data is processed strictly for the following purposes:
          </p>
          <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-1 ml-4">
            <li>
              Facilitating the connection between gig providers and job seekers
            </li>
            <li>Verifying user identity and maintaining community safety</li>
            <li>
              Delivering proximity-based search results and relevant
              notifications
            </li>
            <li>Improving our platform and fulfilling legal obligations</li>
          </ul>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">
            5. Data Sharing & Third Parties
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We only share your profile information with prospective employers or
            gig providers when you explicitly apply for a gig. We do not sell
            your personal data to advertisers, data brokers, or external
            marketing agencies.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">
            6. Data Security & Retention
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We implement industry-standard security measures, including
            encryption and access controls, to safeguard your data. We retain
            your personal information only for as long as your account remains
            active or as required by South African law.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">7. User Conduct & Ethics</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Users agree to interact respectfully and truthfully. Any promotion
            of illegal activities, harassment, discrimination, or posting of
            fraudulent gigs will result in immediate account termination and
            potential reporting to local authorities. KasiLink is committed to
            fostering a safe, inclusive, and ethical community environment.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">8. Liability Disclaimer</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            KasiLink serves strictly as a connective digital platform between
            independent gig providers and job seekers. We are not an employer,
            recruitment agency, or labor broker. We hold no liability for the
            outcome of gigs, workplace disputes, injuries, or non-payment. Users
            assume all risks associated with engagements sourced through this
            platform.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">9. Your Rights (POPIA)</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
            Under POPIA, you have the right to:
          </p>
          <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-1 ml-4">
            <li>
              Request access to the personal information we hold about you
            </li>
            <li>Request correction or deletion of your personal information</li>
            <li>Object to the processing of your personal information</li>
            <li>
              Lodge a complaint with the Information Regulator of South Africa
            </li>
          </ul>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">10. Contact</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            If you have any questions about these terms, platform ethics, or
            wish to exercise your data rights, please contact our Information
            Officer at:{" "}
            <a
              href="mailto:kasilink.rsa@gmail.com"
              className="text-primary font-bold hover:underline"
            >
              kasilink.rsa@gmail.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="btn btn-outline btn-sm">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
=======
import Link from "next/link";

export const metadata = {
  title: "Terms of Service & POPIA Compliance",
  description:
    "KasiLink Terms of Service and Protection of Personal Information Act (POPIA) compliance.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-screen-md mx-auto pt-8 pb-12 px-4">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2">
          Terms of Service & Privacy
        </h1>
        <p className="text-on-surface-variant font-medium">
          Protection of Personal Information Act (POPIA) Compliance & Platform
          Terms
        </p>
      </div>

      <div className="space-y-6">
        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Welcome to KasiLink. These terms govern your use of our platform. In
            compliance with the Protection of Personal Information Act, 2013
            (POPIA), this document outlines how we collect, process, store, and
            protect your personal information when you use our gig marketplace
            and community services.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">
            2. Eligibility & Age Restrictions
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            By using KasiLink, you represent and warrant that you are at least
            18 years of age. Our platform is intended solely for adult users
            capable of entering into legally binding contracts under South
            African law.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">3. Data We Collect</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
            To provide our services, we collect the following personal
            information:
          </p>
          <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-1 ml-4">
            <li>Identity information (Name, Surname)</li>
            <li>
              Contact information (Phone number, required for secure SMS OTP
              authentication)
            </li>
            <li>
              Location data (Suburb, City, coordinates to match you with nearby
              gigs)
            </li>
            <li>
              Platform activity (Gigs posted, applications, community forum
              posts, messages)
            </li>
          </ul>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">4. How We Use It</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
            Your data is processed strictly for the following purposes:
          </p>
          <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-1 ml-4">
            <li>
              Facilitating the connection between gig providers and job seekers
            </li>
            <li>Verifying user identity and maintaining community safety</li>
            <li>
              Delivering proximity-based search results and relevant
              notifications
            </li>
            <li>Improving our platform and fulfilling legal obligations</li>
          </ul>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">
            5. Data Sharing & Third Parties
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We only share your profile information with prospective employers or
            gig providers when you explicitly apply for a gig. We do not sell
            your personal data to advertisers, data brokers, or external
            marketing agencies.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">
            6. Data Security & Retention
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We implement industry-standard security measures, including
            encryption and access controls, to safeguard your data. We retain
            your personal information only for as long as your account remains
            active or as required by South African law.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">7. User Conduct & Ethics</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Users agree to interact respectfully and truthfully. Any promotion
            of illegal activities, harassment, discrimination, or posting of
            fraudulent gigs will result in immediate account termination and
            potential reporting to local authorities. KasiLink is committed to
            fostering a safe, inclusive, and ethical community environment.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">8. Liability Disclaimer</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            KasiLink serves strictly as a connective digital platform between
            independent gig providers and job seekers. We are not an employer,
            recruitment agency, or labor broker. We hold no liability for the
            outcome of gigs, workplace disputes, injuries, or non-payment. Users
            assume all risks associated with engagements sourced through this
            platform.
          </p>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">9. Your Rights (POPIA)</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
            Under POPIA, you have the right to:
          </p>
          <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-1 ml-4">
            <li>
              Request access to the personal information we hold about you
            </li>
            <li>Request correction or deletion of your personal information</li>
            <li>Object to the processing of your personal information</li>
            <li>
              Lodge a complaint with the Information Regulator of South Africa
            </li>
          </ul>
        </section>

        <section className="kasi-card">
          <h2 className="text-xl font-bold mb-3">10. Contact</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            If you have any questions about these terms, platform ethics, or
            wish to exercise your data rights, please contact our Information
            Officer at:{" "}
            <a
              href="mailto:kasilink.rsa@gmail.com"
              className="text-primary font-bold hover:underline"
            >
              kasilink.rsa@gmail.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="btn btn-outline btn-sm">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
>>>>>>> theirs
