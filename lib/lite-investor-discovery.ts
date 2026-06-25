export type SwfusStatus = "SAVE" | "WATCH" | "FAIL" | "UPDATE" | "SEVER";

export interface LiteOpportunity {
  id: number;
  location_id: number;
  location: string;
  city: string;
  province: string;
  business_name: string;
  category: string;
  description: string;
  funding_needed: number;
  jobs_supported: number;
  jobs_possible: number;
  risk_level: "Low" | "Medium" | "High";
  risk_score: number;
  impact_score: number;
  confidence_score: number;
  opportunity_score: number;
  recommendation: string;
  reason: string;
  swfus_status: SwfusStatus;
  source_type: string;
}

export interface LiteLocation {
  id: number;
  name: string;
  province: string;
  city: string;
  latitude: number;
  longitude: number;
  population: number;
  unemployment_rate: number;
  risk_score: number;
}

export interface LiteLocationSummary extends LiteLocation {
  opportunity_score: number;
  total_funding_needed: number;
  total_jobs_possible: number;
  total_opportunities: number;
}

interface LiteOverview {
  totalLocations: number;
  totalOpportunities: number;
  totalJobsPossible: number;
  totalFundingNeeded: number;
  strongSignals: number;
}

const liteLocations: LiteLocation[] = [
  {
    id: 1,
    name: "Soweto",
    province: "Gauteng",
    city: "Johannesburg",
    latitude: -26.2678,
    longitude: 27.8585,
    population: 1271628,
    unemployment_rate: 35,
    risk_score: 42,
  },
  {
    id: 2,
    name: "Khayelitsha",
    province: "Western Cape",
    city: "Cape Town",
    latitude: -34.0393,
    longitude: 18.677,
    population: 391749,
    unemployment_rate: 38,
    risk_score: 45,
  },
  {
    id: 3,
    name: "Alexandra",
    province: "Gauteng",
    city: "Johannesburg",
    latitude: -26.1049,
    longitude: 28.0966,
    population: 179624,
    unemployment_rate: 34,
    risk_score: 47,
  },
  {
    id: 4,
    name: "Gugulethu",
    province: "Western Cape",
    city: "Cape Town",
    latitude: -33.9844,
    longitude: 18.566,
    population: 98000,
    unemployment_rate: 36,
    risk_score: 43,
  },
  {
    id: 5,
    name: "Mitchells Plain",
    province: "Western Cape",
    city: "Cape Town",
    latitude: -34.0481,
    longitude: 18.6186,
    population: 310485,
    unemployment_rate: 33,
    risk_score: 41,
  },
  {
    id: 6,
    name: "Dunoon",
    province: "Western Cape",
    city: "Cape Town",
    latitude: -33.8779,
    longitude: 18.5211,
    population: 52341,
    unemployment_rate: 39,
    risk_score: 46,
  },
  {
    id: 7,
    name: "Philippi",
    province: "Western Cape",
    city: "Cape Town",
    latitude: -34.0035,
    longitude: 18.5419,
    population: 191073,
    unemployment_rate: 37,
    risk_score: 44,
  },
  {
    id: 8,
    name: "Delft",
    province: "Western Cape",
    city: "Cape Town",
    latitude: -33.9738,
    longitude: 18.6431,
    population: 152030,
    unemployment_rate: 36,
    risk_score: 45,
  },
];

const liteOpportunities: LiteOpportunity[] = [
  {
    id: 1,
    location_id: 2,
    location: "Khayelitsha",
    city: "Cape Town",
    province: "Western Cape",
    business_name: "Khayelitsha Mobile Repair Kiosk",
    category: "Technology / Repair",
    description:
      "Phone repair kiosk supporting affordable device maintenance and digital inclusion near taxi and commuter traffic.",
    funding_needed: 30000,
    jobs_supported: 2,
    jobs_possible: 4,
    risk_level: "Low",
    risk_score: 28,
    impact_score: 90,
    confidence_score: 91,
    opportunity_score: 94,
    recommendation: "Fund repair tools and spare parts inventory.",
    reason:
      "Strong demand for affordable phone repairs and digital inclusion impact.",
    swfus_status: "SAVE",
    source_type: "seed",
  },
  {
    id: 2,
    location_id: 1,
    location: "Soweto",
    city: "Johannesburg",
    province: "Gauteng",
    business_name: "Mama D's Spaza Shop",
    category: "Retail / Food Access",
    description:
      "Local spaza shop serving essential groceries in a high-foot-traffic area with repeat daily demand.",
    funding_needed: 25000,
    jobs_supported: 2,
    jobs_possible: 3,
    risk_level: "Medium",
    risk_score: 34,
    impact_score: 86,
    confidence_score: 88,
    opportunity_score: 91,
    recommendation: "Fund stock expansion and a basic digital POS system.",
    reason:
      "High foot traffic, essential goods demand, and immediate job creation potential.",
    swfus_status: "SAVE",
    source_type: "seed",
  },
  {
    id: 3,
    location_id: 4,
    location: "Gugulethu",
    city: "Cape Town",
    province: "Western Cape",
    business_name: "Gugulethu Food Vendor Collective",
    category: "Food / Informal Trade",
    description:
      "Small food vendors needing coordinated equipment and bulk stock support to increase daily output.",
    funding_needed: 20000,
    jobs_supported: 4,
    jobs_possible: 6,
    risk_level: "Medium",
    risk_score: 36,
    impact_score: 84,
    confidence_score: 86,
    opportunity_score: 90,
    recommendation: "Fund cooking equipment and bulk stock purchasing.",
    reason:
      "Food demand is stable and vendor collectives can scale with small coordinated investment.",
    swfus_status: "WATCH",
    source_type: "seed",
  },
  {
    id: 4,
    location_id: 6,
    location: "Dunoon",
    city: "Cape Town",
    province: "Western Cape",
    business_name: "Dunoon Local Logistics Runner",
    category: "Delivery / Local Logistics",
    description:
      "Neighbourhood delivery runner model reducing transport friction for households and informal traders.",
    funding_needed: 18000,
    jobs_supported: 1,
    jobs_possible: 2,
    risk_level: "Medium",
    risk_score: 35,
    impact_score: 80,
    confidence_score: 82,
    opportunity_score: 87,
    recommendation: "Fund delivery equipment, airtime, and route coordination.",
    reason:
      "Local delivery demand is rising and proximity reduces transport friction.",
    swfus_status: "WATCH",
    source_type: "seed",
  },
  {
    id: 5,
    location_id: 5,
    location: "Mitchells Plain",
    city: "Cape Town",
    province: "Western Cape",
    business_name: "Mitchells Plain Homework Hub",
    category: "Education / Tutoring",
    description:
      "After-school tutoring collective focused on maths, science, and exam support for secondary learners.",
    funding_needed: 22000,
    jobs_supported: 3,
    jobs_possible: 5,
    risk_level: "Low",
    risk_score: 27,
    impact_score: 88,
    confidence_score: 84,
    opportunity_score: 89,
    recommendation: "Fund learning materials, data bundles, and weekend tutor stipends.",
    reason:
      "Strong education demand and immediate youth support with a clear neighbourhood footprint.",
    swfus_status: "SAVE",
    source_type: "seed",
  },
  {
    id: 6,
    location_id: 7,
    location: "Philippi",
    city: "Cape Town",
    province: "Western Cape",
    business_name: "Philippi Fresh Produce Cold Hub",
    category: "Food Supply / Logistics",
    description:
      "Micro cold-storage and sorting node supporting produce vendors and reducing spoilage losses.",
    funding_needed: 45000,
    jobs_supported: 4,
    jobs_possible: 7,
    risk_level: "Medium",
    risk_score: 38,
    impact_score: 92,
    confidence_score: 79,
    opportunity_score: 93,
    recommendation: "Fund cold storage, crates, and first-stage operations support.",
    reason:
      "Spoilage reduction improves margins for multiple traders and supports a wider local food network.",
    swfus_status: "WATCH",
    source_type: "seed",
  },
  {
    id: 7,
    location_id: 3,
    location: "Alexandra",
    city: "Johannesburg",
    province: "Gauteng",
    business_name: "Alexandra Youth Car Wash",
    category: "Services / Youth Employment",
    description:
      "Community car wash with expansion potential for weekend queues, fleet cleaning, and youth shifts.",
    funding_needed: 15000,
    jobs_supported: 3,
    jobs_possible: 5,
    risk_level: "Medium",
    risk_score: 33,
    impact_score: 82,
    confidence_score: 84,
    opportunity_score: 89,
    recommendation: "Fund equipment upgrades, uniforms, and street-visible signage.",
    reason:
      "Low capital requirement with direct youth employment upside and repeat local usage.",
    swfus_status: "SAVE",
    source_type: "seed",
  },
  {
    id: 8,
    location_id: 8,
    location: "Delft",
    city: "Cape Town",
    province: "Western Cape",
    business_name: "Delft Community Service Desk",
    category: "Community Services",
    description:
      "Neighbourhood admin desk supporting grant forms, printing, CV updates, and document submission help.",
    funding_needed: 28000,
    jobs_supported: 2,
    jobs_possible: 4,
    risk_level: "Low",
    risk_score: 29,
    impact_score: 85,
    confidence_score: 80,
    opportunity_score: 88,
    recommendation: "Fund printer equipment, connectivity, and frontline admin support.",
    reason:
      "Local admin friction is high and the service creates a visible access point for residents.",
    swfus_status: "UPDATE",
    source_type: "seed",
  },
];

const swfusUiLabels: Record<SwfusStatus, string> = {
  SAVE: "Strong Signal",
  WATCH: "Needs Verification",
  FAIL: "Not Recommended",
  UPDATE: "Improve Data",
  SEVER: "Removed",
};

const swfusBadgeClass: Record<SwfusStatus, string> = {
  SAVE: "badge badge-success",
  WATCH: "badge badge-secondary",
  FAIL: "badge badge-danger",
  UPDATE: "badge badge-info",
  SEVER: "badge badge-danger",
};

function cloneOpportunity(opportunity: LiteOpportunity): LiteOpportunity {
  return { ...opportunity };
}

function sortByOpportunityScore(
  left: LiteOpportunity,
  right: LiteOpportunity,
): number {
  return right.opportunity_score - left.opportunity_score;
}

export function formatLiteCurrency(value: number): string {
  return `R${value.toLocaleString("en-US")}`;
}

export function getLiteLocations(): LiteLocationSummary[] {
  return liteLocations
    .map((location) => {
      const related = liteOpportunities.filter(
        (opportunity) => opportunity.location_id === location.id,
      );
      const totalFundingNeeded = related.reduce(
        (sum, opportunity) => sum + opportunity.funding_needed,
        0,
      );
      const totalJobsPossible = related.reduce(
        (sum, opportunity) => sum + opportunity.jobs_possible,
        0,
      );
      const averageOpportunityScore =
        related.length > 0
          ? Math.round(
              related.reduce(
                (sum, opportunity) => sum + opportunity.opportunity_score,
                0,
              ) / related.length,
            )
          : 0;

      return {
        ...location,
        opportunity_score: averageOpportunityScore,
        total_funding_needed: totalFundingNeeded,
        total_jobs_possible: totalJobsPossible,
        total_opportunities: related.length,
      };
    })
    .sort((left, right) => right.opportunity_score - left.opportunity_score);
}

export function getLiteLocationById(
  locationId: number,
): { location: LiteLocationSummary; businesses: LiteOpportunity[] } | null {
  const location = getLiteLocations().find((entry) => entry.id === locationId);

  if (!location) {
    return null;
  }

  const businesses = liteOpportunities
    .filter((opportunity) => opportunity.location_id === locationId)
    .map(cloneOpportunity)
    .sort(sortByOpportunityScore);

  return { location, businesses };
}

export function getLiteBusinesses(): LiteOpportunity[] {
  return [...liteOpportunities].map(cloneOpportunity).sort(sortByOpportunityScore);
}

export function getLiteRecommendations(limit = 6): LiteOpportunity[] {
  return getLiteBusinesses().slice(0, limit);
}

export function searchLiteOpportunities(query: string): LiteOpportunity[] {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    return getLiteRecommendations();
  }

  return getLiteBusinesses().filter((opportunity) => {
    return [
      opportunity.location,
      opportunity.city,
      opportunity.province,
      opportunity.business_name,
      opportunity.category,
      opportunity.description,
      opportunity.reason,
      opportunity.recommendation,
    ].some((field) => field.toLowerCase().includes(trimmed));
  });
}

export function getLiteOverview(): LiteOverview {
  const businesses = getLiteBusinesses();

  return {
    totalLocations: liteLocations.length,
    totalOpportunities: businesses.length,
    totalJobsPossible: businesses.reduce(
      (sum, opportunity) => sum + opportunity.jobs_possible,
      0,
    ),
    totalFundingNeeded: businesses.reduce(
      (sum, opportunity) => sum + opportunity.funding_needed,
      0,
    ),
    strongSignals: businesses.filter(
      (opportunity) => opportunity.swfus_status === "SAVE",
    ).length,
  };
}

export function getSwfusUiLabel(status: SwfusStatus): string {
  return swfusUiLabels[status];
}

export function getSwfusBadgeClass(status: SwfusStatus): string {
  return swfusBadgeClass[status];
}
