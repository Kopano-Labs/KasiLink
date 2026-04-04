/**
 * ONE-TIME SEED ENDPOINT — DELETE AFTER USE
 * Protected by SEED_SECRET header. Do NOT commit this to production long-term.
 */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const SEED_SECRET = "kasilink-seed-2026-04-04";

const GigSchema = new mongoose.Schema(
  {
    title: String, description: String, category: String,
    status: { type: String, default: "open" },
    providerId: String, providerName: String, providerPhone: String,
    isProviderVerified: { type: Boolean, default: false },
    location: { type: { type: String, default: "Point" }, coordinates: [Number], address: String, suburb: String, city: String },
    payType: String, payAmount: Number, payDisplay: String,
    isFlexible: { type: Boolean, default: true }, requirements: [String],
    slots: { type: Number, default: 1 }, applicationCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 }, loadshedding: { aware: Boolean, stage: Number },
    isUrgent: { type: Boolean, default: false }, expiresAt: Date,
  },
  { timestamps: true }
);
GigSchema.index({ location: "2dsphere" });

const ForumSchema = new mongoose.Schema(
  { authorId: String, authorName: String, authorPhone: String, isAuthorVerified: Boolean,
    title: String, content: String, category: String, suburb: String,
    upvotes: { type: Number, default: 0 }, replies: { type: Number, default: 0 }, isPinned: { type: Boolean, default: false } },
  { timestamps: true }
);
const CalendarSchema = new mongoose.Schema(
  { title: String, description: String, suburb: String, city: String, date: Date, endDate: Date,
    category: String, organizer: String, location: String, isFree: { type: Boolean, default: true } },
  { timestamps: true }
);
const WaterSchema = new mongoose.Schema(
  { title: String, description: String, suburb: String, city: String, type: String,
    severity: String, status: { type: String, default: "active" }, startDate: Date,
    estimatedRestoration: Date, affectedAreas: [String], source: String },
  { timestamps: true }
);

const PROVIDER_ID = "seed_provider_001";
const now = Date.now();
const day = 24 * 60 * 60 * 1000;

const GIGS = [
  { title: "Shelf Packer — Shoprite Soweto", description: "Shoprite branch in Soweto needs reliable shelf packers for the evening shift. Stock rotation, price labelling, and maintaining shelf presentation. No experience required — training provided on day one.", category: "retail", providerId: PROVIDER_ID, providerName: "Shoprite Hiring", providerPhone: "+27110000001", isProviderVerified: true, location: { type: "Point", coordinates: [27.8546, -26.2678], suburb: "Soweto", city: "Johannesburg", address: "Maponya Mall, Soweto" }, payType: "daily", payAmount: 180, payDisplay: "R180/day", requirements: ["South African ID", "Punctual"], slots: 4, isUrgent: true, loadshedding: { aware: true, stage: 2 }, expiresAt: new Date(now + 7 * day) },
  { title: "Till Operator — Boxer Tembisa", description: "Boxer Superstore in Tembisa needs a till operator for weekends. Must handle cash and card payments, greet customers, and manage queues during busy periods.", category: "retail", providerId: PROVIDER_ID, providerName: "Boxer Stores", providerPhone: "+27110000002", isProviderVerified: true, location: { type: "Point", coordinates: [28.2058, -26.0089], suburb: "Tembisa", city: "Ekurhuleni", address: "Rabie Ridge, Tembisa" }, payType: "daily", payAmount: 200, payDisplay: "R200/day", requirements: ["Basic numeracy", "Customer-facing experience a plus"], slots: 2, isUrgent: false, loadshedding: { aware: true, stage: 0 }, expiresAt: new Date(now + 14 * day) },
  { title: "General Labourer — Alexandra Housing Project", description: "RDP housing construction project in Alexandra needs general labourers. Work involves mixing cement, carrying materials, and assisting bricklayers. Steady income for 3 weeks.", category: "construction", providerId: PROVIDER_ID, providerName: "BuildSA Projects", providerPhone: "+27110000003", isProviderVerified: false, location: { type: "Point", coordinates: [28.1095, -26.1012], suburb: "Alexandra", city: "Johannesburg", address: "Alexandra Township, Johannesburg" }, payType: "daily", payAmount: 220, payDisplay: "R220/day", requirements: ["Physically fit", "Own safety boots"], slots: 6, isUrgent: true, loadshedding: { aware: false }, expiresAt: new Date(now + 21 * day) },
  { title: "Painter — Diepsloot Residential", description: "Need experienced house painter for interior and exterior work in Diepsloot. Must have own brushes and rollers. 2-bedroom house, 2 days work.", category: "construction", providerId: PROVIDER_ID, providerName: "Diepsloot Home Owners", providerPhone: "+27110000004", isProviderVerified: false, location: { type: "Point", coordinates: [28.0135, -25.9262], suburb: "Diepsloot", city: "Johannesburg", address: "Diepsloot, Johannesburg" }, payType: "once_off", payAmount: 800, payDisplay: "R800 (2 days)", requirements: ["Own tools", "References preferred"], slots: 1, isUrgent: false, loadshedding: { aware: false }, expiresAt: new Date(now + 5 * day) },
  { title: "Car Wash Assistant — Thokoza", description: "Busy car wash in Thokoza needs two assistants for Saturday and Sunday. Washing, drying, and interior vacuuming. Tips possible on top of daily rate.", category: "car_wash", providerId: PROVIDER_ID, providerName: "Sparkling Kasi Wash", providerPhone: "+27110000005", isProviderVerified: false, location: { type: "Point", coordinates: [28.3524, -26.3612], suburb: "Thokoza", city: "Ekurhuleni", address: "Thokoza, Ekurhuleni" }, payType: "daily", payAmount: 150, payDisplay: "R150/day + tips", requirements: ["Hardworking", "Weekends only"], slots: 2, isUrgent: false, loadshedding: { aware: true, stage: 1 }, expiresAt: new Date(now + 3 * day) },
  { title: "House Cleaner — Midrand", description: "Looking for a reliable house cleaner for a 3-bedroom home in Midrand. Weekly cleaning, 5 hours per visit. Must be trustworthy. References required.", category: "cleaning", providerId: PROVIDER_ID, providerName: "Midrand Homeowner", providerPhone: "+27110000006", isProviderVerified: false, location: { type: "Point", coordinates: [28.1282, -25.9951], suburb: "Midrand", city: "Johannesburg", address: "Midrand, Johannesburg" }, payType: "once_off", payAmount: 250, payDisplay: "R250 per visit", requirements: ["References required"], slots: 1, isUrgent: false, loadshedding: { aware: false }, expiresAt: new Date(now + 30 * day) },
  { title: "Care Assistant — Elderly Resident, Orange Farm", description: "Elderly resident in Orange Farm needs a part-time care assistant, Mon-Wed. Meal preparation, light housekeeping, and companionship. No medical qualifications required.", category: "healthcare", providerId: PROVIDER_ID, providerName: "Orange Farm Family", providerPhone: "+27110000007", isProviderVerified: false, location: { type: "Point", coordinates: [27.8361, -26.4852], suburb: "Orange Farm", city: "Johannesburg", address: "Orange Farm, Johannesburg South" }, payType: "daily", payAmount: 170, payDisplay: "R170/day", requirements: ["Patient and kind", "Mon-Wed availability"], slots: 1, isUrgent: false, loadshedding: { aware: true, stage: 2 }, expiresAt: new Date(now + 14 * day) },
  { title: "Delivery Driver — Vosloorus", description: "Small spaza supply business needs a driver with own vehicle to deliver stock to spaza shops in Vosloorus. 3-4 days per week.", category: "delivery", providerId: PROVIDER_ID, providerName: "Kasi Supply Co", providerPhone: "+27110000008", isProviderVerified: false, location: { type: "Point", coordinates: [28.3401, -26.3789], suburb: "Vosloorus", city: "Ekurhuleni", address: "Vosloorus, Ekurhuleni" }, payType: "daily", payAmount: 350, payDisplay: "R350/day + fuel", requirements: ["Valid driver's licence", "Own vehicle preferred"], slots: 1, isUrgent: true, loadshedding: { aware: false }, expiresAt: new Date(now + 7 * day) },
  { title: "Electrician (Domestic) — Katlehong", description: "Need a qualified electrician to fix faulty wiring and install a new DB board in Katlehong. Must have a valid wireman's licence. One-day job.", category: "repairs", providerId: PROVIDER_ID, providerName: "Katlehong Homeowner", providerPhone: "+27110000009", isProviderVerified: false, location: { type: "Point", coordinates: [28.3132, -26.3402], suburb: "Katlehong", city: "Ekurhuleni", address: "Katlehong, Ekurhuleni" }, payType: "once_off", payAmount: 600, payDisplay: "R600 once-off", requirements: ["Wireman's licence", "Own tools"], slots: 1, isUrgent: true, loadshedding: { aware: true, stage: 2 }, expiresAt: new Date(now + 3 * day) },
  { title: "Plumber — Burst Pipe, Diepkloof", description: "Pipe burst in Diepkloof, Soweto. Need an experienced plumber. Urgent — water has been cut off. Contact as soon as possible.", category: "repairs", providerId: PROVIDER_ID, providerName: "Diepkloof Resident", providerPhone: "+27110000010", isProviderVerified: false, location: { type: "Point", coordinates: [27.8893, -26.2451], suburb: "Diepkloof", city: "Johannesburg", address: "Diepkloof, Soweto" }, payType: "negotiable", payDisplay: "Negotiable", requirements: ["Experience with burst pipes", "Own tools"], slots: 1, isUrgent: true, loadshedding: { aware: false }, expiresAt: new Date(now + 1 * day) },
];

const FORUM = [
  { authorId: "seed_author_001", authorName: "Sipho M.", authorPhone: "+27650000001", isAuthorVerified: true, title: "Load-shedding Stage 2 tonight — Soweto work planning", content: "Heads up to everyone in Soweto — Stage 2 is confirmed tonight from 18:00 to 22:00. If you have outdoor gigs or evening delivery work, plan around it. Generators and solar alternatives being coordinated in Meadowlands. Reply here if you need help with load-shedding schedules for your area.", category: "load_shedding", suburb: "Soweto", upvotes: 24, replies: 8, isPinned: true },
  { authorId: "seed_author_002", authorName: "Thandi K.", authorPhone: "+27650000002", isAuthorVerified: false, title: "Got my first gig through KasiLink — car wash in Tembisa", content: "Just wanted to share — I've been unemployed for 8 months and was starting to lose hope. Found a car wash assistant gig through KasiLink last week, provider was legit (verified badge), showed up and the money was paid same day. Small start but it's something. Keep posting gigs everyone, we need more jobs in the townships.", category: "success_story", suburb: "Tembisa", upvotes: 67, replies: 12, isPinned: false },
  { authorId: "seed_author_003", authorName: "Bongani T.", authorPhone: "+27650000003", isAuthorVerified: true, title: "Water outage — Alexandra Ext 7, still no water after 3 days", content: "Alexandra Extension 7 has been without water since Tuesday. Joburg Water says the main pipe burst is being fixed but no ETA. If you're in the area, don't rely on municipal supply. Portable tanks available at the community hall on 5th Ave.", category: "water", suburb: "Alexandra", upvotes: 45, replies: 19, isPinned: false },
  { authorId: "seed_author_004", authorName: "Lerato N.", authorPhone: "+27650000004", isAuthorVerified: false, title: "Safety tip — verify providers before going to an unfamiliar area", content: "Quick reminder to everyone — always check if a provider has the Verified badge before accepting a gig in an area you don't know. KasiLink's verified system is there for a reason, use it. Stay safe out there.", category: "safety", suburb: "Johannesburg", upvotes: 89, replies: 7, isPinned: true },
  { authorId: "seed_author_005", authorName: "Mpho D.", authorPhone: "+27650000005", isAuthorVerified: false, title: "Maths tutoring available — Orange Farm", content: "I'm a Grade 12 Maths and Physical Science teacher based in Orange Farm. Starting to take private tutoring gigs on weekends. R150/hour, group sessions available. If you're in Orange Farm or Lenasia area and need help ahead of mid-year exams, drop a comment.", category: "general", suburb: "Orange Farm", upvotes: 31, replies: 14, isPinned: false },
];

const CALENDAR = [
  { title: "Job Skills Workshop — Soweto Youth Centre", description: "Free job readiness workshop for youth aged 18-35. Topics: CV writing, interview skills, using digital platforms to find work. Funded by the Gauteng EPWP programme.", suburb: "Soweto", city: "Johannesburg", date: new Date(now + 3 * day), endDate: new Date(now + 3 * day + 4 * 60 * 60 * 1000), category: "workshop", organizer: "Gauteng EPWP", location: "Soweto Youth Centre, Diepkloof", isFree: true },
  { title: "Alexandra Community Market", description: "Monthly community market in Alexandra — fresh produce, street food, handmade crafts, and local services. Great place to connect with local providers.", suburb: "Alexandra", city: "Johannesburg", date: new Date(now + 7 * day), endDate: new Date(now + 7 * day + 8 * 60 * 60 * 1000), category: "market", organizer: "Alexandra Community Forum", location: "Pan Africa Shopping Centre, Alexandra", isFree: true },
  { title: "SASSA Grant Registration — Tembisa", description: "SASSA conducting grant registration and renewal sessions. Bring your South African ID. SRD and other grants processed on the day.", suburb: "Tembisa", city: "Ekurhuleni", date: new Date(now + 5 * day), endDate: new Date(now + 5 * day + 6 * 60 * 60 * 1000), category: "government", organizer: "SASSA Ekurhuleni", location: "Tembisa Civic Centre", isFree: true },
];

const WATER = [
  { title: "Planned Maintenance — Diepsloot, Zone 5", description: "Johannesburg Water will be conducting routine pipe maintenance in Diepsloot Zone 5. Water supply will be interrupted. Residents are advised to store water in advance.", suburb: "Diepsloot", city: "Johannesburg", type: "planned_maintenance", severity: "moderate", status: "active", startDate: new Date(now + 1 * day), estimatedRestoration: new Date(now + 1 * day + 8 * 60 * 60 * 1000), affectedAreas: ["Zone 5", "Zone 6", "Waterval"], source: "Johannesburg Water" },
  { title: "Burst Main — Alexandra Extension 7", description: "A burst water main has been reported in Alexandra Extension 7. Joburg Water repair teams have been dispatched. Restoration estimated at 24-48 hours.", suburb: "Alexandra", city: "Johannesburg", type: "burst_pipe", severity: "high", status: "active", startDate: new Date(now - 2 * day), estimatedRestoration: new Date(now + 1 * day), affectedAreas: ["Extension 7", "Extension 8", "5th Avenue"], source: "Joburg Water via Community Report" },
];

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-seed-secret");
  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const GigModel = mongoose.models.Gig ?? mongoose.model("Gig", GigSchema);
    const ForumModel = mongoose.models.ForumPost ?? mongoose.model("ForumPost", ForumSchema);
    const CalModel = mongoose.models.CommunityCalendar ?? mongoose.model("CommunityCalendar", CalendarSchema);
    const WaterModel = mongoose.models.WaterAlert ?? mongoose.model("WaterAlert", WaterSchema);

    await GigModel.deleteMany({ providerId: PROVIDER_ID });
    await ForumModel.deleteMany({ authorId: { $in: FORUM.map(f => f.authorId) } });
    await CalModel.deleteMany({ organizer: { $in: CALENDAR.map(c => c.organizer) } });
    await WaterModel.deleteMany({ source: { $in: WATER.map(w => w.source) } });

    const [gigs, posts, events, alerts] = await Promise.all([
      GigModel.insertMany(GIGS),
      ForumModel.insertMany(FORUM),
      CalModel.insertMany(CALENDAR),
      WaterModel.insertMany(WATER),
    ]);

    return NextResponse.json({
      success: true,
      seeded: { gigs: gigs.length, forumPosts: posts.length, calendarEvents: events.length, waterAlerts: alerts.length },
    });
  } catch (err) {
    console.error("[GET /api/seed]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
