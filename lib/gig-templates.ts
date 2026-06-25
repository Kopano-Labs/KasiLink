/**
 * lib/gig-templates.ts
 * ───────────────────────────────────────────────────────────
 * Pre-built gig templates for common township work.
 *
 * KC Apprenticeship Phase 15, Task 145
 *
 * Reduces friction when posting gigs — providers select
 * a template, tweak the details, and post.
 * ───────────────────────────────────────────────────────────
 */

export interface GigTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  defaultPay: string;
  requirements: string[];
  estimatedDuration: string;
  icon: string;
  isPowerDependent: boolean;
}

export const GIG_TEMPLATES: GigTemplate[] = [
  {
    id: "car-wash-basic",
    category: "car_wash",
    title: "Car wash helper needed",
    description: "Looking for someone to help wash cars at our stand. Must be reliable and able to work weekends. We provide all equipment and supplies.",
    defaultPay: "R150/day",
    requirements: ["Reliable", "Weekend availability"],
    estimatedDuration: "Full day (8hrs)",
    icon: "🚗",
    isPowerDependent: false,
  },
  {
    id: "car-wash-detail",
    category: "car_wash",
    title: "Car detailing specialist",
    description: "Need an experienced detailer for interior and exterior detailing. Must know how to use a polisher and clay bar. Our clients expect premium results.",
    defaultPay: "R300/car",
    requirements: ["Detailing experience", "Polisher skills"],
    estimatedDuration: "2-3 hours per car",
    icon: "✨",
    isPowerDependent: true,
  },
  {
    id: "cleaning-house",
    category: "cleaning",
    title: "House cleaning — deep clean",
    description: "Deep clean needed for a 3-bedroom house. Includes kitchen, bathroom, floors, and windows. All cleaning supplies provided.",
    defaultPay: "R250/session",
    requirements: ["Cleaning experience", "Attention to detail"],
    estimatedDuration: "4-5 hours",
    icon: "🧹",
    isPowerDependent: false,
  },
  {
    id: "cleaning-office",
    category: "cleaning",
    title: "Office cleaning — after hours",
    description: "Regular after-hours office cleaning. Monday to Friday, 5pm to 8pm. Includes vacuuming, mopping, dusting, and restroom cleaning.",
    defaultPay: "R180/session",
    requirements: ["Reliable", "Evening availability"],
    estimatedDuration: "3 hours",
    icon: "🏢",
    isPowerDependent: true,
  },
  {
    id: "tutoring-primary",
    category: "tutoring",
    title: "Primary school maths tutor",
    description: "Looking for a patient tutor for Grade 4-7 maths. Must be able to explain concepts clearly. Lessons at the learner's home or local library.",
    defaultPay: "R120/hour",
    requirements: ["Matric maths pass", "Patient", "Good communicator"],
    estimatedDuration: "1-2 hours per session",
    icon: "📚",
    isPowerDependent: false,
  },
  {
    id: "tutoring-matric",
    category: "tutoring",
    title: "Matric science tutor needed",
    description: "Need a tutor for Physical Science and Life Sciences for a Grade 12 learner. Final exam preparation focus. Must have strong results in these subjects.",
    defaultPay: "R180/hour",
    requirements: ["University student or graduate", "Strong matric results"],
    estimatedDuration: "1.5 hours per session",
    icon: "🔬",
    isPowerDependent: false,
  },
  {
    id: "repairs-plumbing",
    category: "repairs",
    title: "Plumber needed — leaking pipe",
    description: "Leaking pipe in the kitchen. Need someone who can fix it today. Must have own tools. Will pay extra for same-day service.",
    defaultPay: "R350/job",
    requirements: ["Plumbing experience", "Own tools"],
    estimatedDuration: "1-2 hours",
    icon: "🔧",
    isPowerDependent: false,
  },
  {
    id: "repairs-electrical",
    category: "repairs",
    title: "Electrician — power outlet repair",
    description: "Power outlet not working in the bedroom. Need a qualified electrician to diagnose and fix. Must have valid COC capability.",
    defaultPay: "R400/job",
    requirements: ["Electrical qualification", "Own tools", "COC capable"],
    estimatedDuration: "1-3 hours",
    icon: "⚡",
    isPowerDependent: true,
  },
  {
    id: "delivery-local",
    category: "delivery",
    title: "Local delivery driver",
    description: "Need someone with a car or bakkie to deliver parcels within the area. Multiple stops, all within 10km radius. Fuel covered.",
    defaultPay: "R200/trip",
    requirements: ["Valid driver's licence", "Own vehicle"],
    estimatedDuration: "2-3 hours",
    icon: "🚚",
    isPowerDependent: false,
  },
  {
    id: "delivery-food",
    category: "delivery",
    title: "Food delivery — lunch rush",
    description: "Help deliver food orders from our kitchen to local businesses. 11am to 2pm. Must have own transport (car, scooter, or bicycle).",
    defaultPay: "R150 + tips",
    requirements: ["Own transport", "Phone for GPS"],
    estimatedDuration: "3 hours",
    icon: "🍱",
    isPowerDependent: false,
  },
  {
    id: "handyman-general",
    category: "handyman",
    title: "General handyman — odd jobs",
    description: "Various small tasks: fix a door handle, hang a shelf, repair a fence. Must be handy with basic tools and able to work independently.",
    defaultPay: "R200/half day",
    requirements: ["Basic tools", "Problem solver"],
    estimatedDuration: "Half day",
    icon: "🛠️",
    isPowerDependent: false,
  },
  {
    id: "construction-helper",
    category: "construction",
    title: "Construction helper — building site",
    description: "Need a reliable helper for a building site. Tasks include mixing cement, carrying materials, and general site cleanup. Hard work but good pay.",
    defaultPay: "R250/day",
    requirements: ["Physically fit", "Safety boots"],
    estimatedDuration: "Full day (8hrs)",
    icon: "🏗️",
    isPowerDependent: true,
  },
  {
    id: "solar-installation",
    category: "solar",
    title: "Solar panel installation assistant",
    description: "Assist with solar panel installation on residential rooftops. Experience with electrical work preferred. Training provided for the right candidate.",
    defaultPay: "R350/day",
    requirements: ["Heights comfortable", "Basic electrical knowledge"],
    estimatedDuration: "Full day",
    icon: "☀️",
    isPowerDependent: false,
  },
  {
    id: "retail-cashier",
    category: "retail",
    title: "Spaza shop assistant",
    description: "Help run a busy spaza shop. Duties include serving customers, restocking shelves, and keeping the shop clean. Weekend shifts available.",
    defaultPay: "R120/day",
    requirements: ["Honest", "Good with people", "Basic maths"],
    estimatedDuration: "Full day",
    icon: "🏪",
    isPowerDependent: true,
  },
];

/**
 * Get templates for a specific category.
 */
export function getTemplatesByCategory(category: string): GigTemplate[] {
  return GIG_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Get a template by ID.
 */
export function getTemplateById(id: string): GigTemplate | undefined {
  return GIG_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get all unique categories that have templates.
 */
export function getTemplateCategories(): string[] {
  return [...new Set(GIG_TEMPLATES.map((t) => t.category))];
}
