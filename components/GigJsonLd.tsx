/**
 * components/GigJsonLd.tsx
 * ───────────────────────────────────────────────────────────
 * JSON-LD structured data for gig listings.
 *
 * KC Apprenticeship Phase 13, Task 124
 *
 * Generates Schema.org JobPosting markup for search engines.
 * Helps KasiLink gigs appear in Google Jobs search results.
 * ───────────────────────────────────────────────────────────
 */

interface GigJsonLdProps {
  title: string;
  description: string;
  payDisplay: string;
  suburb: string;
  city: string;
  providerName: string;
  createdAt: string;
  category: string;
  isUrgent?: boolean;
}

export default function GigJsonLd({
  title,
  description,
  payDisplay,
  suburb,
  city,
  providerName,
  createdAt,
  category,
  isUrgent,
}: GigJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted: createdAt,
    employmentType: "TEMPORARY",
    hiringOrganization: {
      "@type": "Organization",
      name: providerName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: suburb,
        addressRegion: city,
        addressCountry: "ZA",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "ZAR",
      value: {
        "@type": "QuantitativeValue",
        value: payDisplay,
      },
    },
    industry: category.replace("_", " "),
    ...(isUrgent && { jobImmediateStart: true }),
    applicantLocationRequirements: {
      "@type": "Country",
      name: "South Africa",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
