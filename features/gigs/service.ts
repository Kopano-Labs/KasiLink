import Gig from "@/lib/models/Gig";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { distanceKm } from "@/lib/geo";
import {
  governedGigPayloadHash,
  KPGS_PROGRESSIVE_UPDATE_SOURCE,
  markGigStateApplied,
  markReplayProofPassed,
  markServerProofPassed,
  type KpgsProgressiveReceipt,
} from "@/lib/kpgs/progressiveUpdate";

export class RouteError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ListGigsInput = {
  searchParams: URLSearchParams;
  currentUserId?: string | null;
};

export async function listGigs({ searchParams, currentUserId }: ListGigsInput) {
  await connectDB();

  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const radius = parseFloat(searchParams.get("radius") ?? "10");
  const category = searchParams.get("category");
  const suburb = searchParams.get("suburb")?.trim();
  const city = searchParams.get("city")?.trim();
  const providerIdParam = searchParams.get("providerId");
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};

  if (status) {
    filter.status = status;
  } else if (!providerIdParam) {
    filter.status = "open";
  }

  if (category) filter.category = category;
  if (suburb) filter["location.suburb"] = new RegExp(`^${suburb}$`, "i");
  if (city) filter["location.city"] = new RegExp(`^${city}$`, "i");

  if (providerIdParam) {
    if (providerIdParam === "me") {
      if (!currentUserId) {
        throw new RouteError(401, "Unauthorised");
      }
      filter.providerId = currentUserId;
    } else {
      filter.providerId = providerIdParam;
    }
  }

  if (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  ) {
    filter.location = {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: radius * 1000,
      },
    };
  }

  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  filter.$or = [
    { expiresAt: { $exists: false } },
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } },
  ];

  const [gigs, total] = await Promise.all([
    Gig.find(filter)
      .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Gig.countDocuments(filter),
  ]);

  const gigsWithDistance = gigs.map((gig) => {
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      Array.isArray(gig.location?.coordinates) &&
      gig.location.coordinates.length === 2
    ) {
      const [gigLng, gigLat] = gig.location.coordinates;
      return { ...gig, distance: distanceKm(lat, lng, gigLat, gigLng) };
    }
    return gig;
  });

  return {
    gigs: gigsWithDistance,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

async function prepareGigCreate({
  userId,
  body,
}: {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}) {
  await connectDB();

  const provider = await User.findOne({ clerkId: userId });
  if (!provider) {
    throw new RouteError(
      404,
      "Profile not found. Please complete your profile first.",
    );
  }

  const required = ["title", "description", "category", "payDisplay", "location"];
  for (const field of required) {
    if (!body[field]) {
      throw new RouteError(400, `Missing required field: ${field}`);
    }
  }

  if (
    !body.location.coordinates ||
    !Array.isArray(body.location.coordinates) ||
    body.location.coordinates.length !== 2
  ) {
    throw new RouteError(400, "location.coordinates must be [longitude, latitude]");
  }

  return {
    title: body.title.trim(),
    description: body.description.trim(),
    category: body.category,
    status: "open",
    providerId: userId,
    providerName: provider.displayName,
    providerPhone: provider.phone,
    isProviderVerified: provider.isVerified,
    location: {
      type: "Point",
      coordinates: body.location.coordinates,
      address: body.location.address,
      suburb: body.location.suburb ?? provider.location.suburb ?? "Johannesburg",
      city: body.location.city ?? provider.location.city ?? "Johannesburg",
    },
    payType: body.payType ?? "negotiable",
    payAmount: body.payAmount,
    payDisplay: body.payDisplay.trim(),
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    endDate: body.endDate ? new Date(body.endDate) : undefined,
    isFlexible: body.isFlexible ?? true,
    requirements: body.requirements ?? [],
    slots: body.slots ?? 1,
    loadshedding: {
      aware: body.loadshedding?.aware ?? false,
      stage: body.loadshedding?.stage,
    },
    isUrgent: body.isUrgent ?? false,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
  };
}

export async function createGig({
  userId,
  body,
}: {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}) {
  const document = await prepareGigCreate({ userId, body });
  return Gig.create(document);
}

function duplicateKey(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: number }).code === 11000,
  );
}

function assertReplayMatch({
  providerId,
  storedHash,
  userId,
  payloadHash,
}: {
  providerId: string;
  storedHash?: string;
  userId: string;
  payloadHash: string;
}) {
  if (providerId !== userId || storedHash !== payloadHash) {
    throw new RouteError(
      409,
      "KPGS idempotency conflict: update_id was already used for different governed content.",
    );
  }
}

export async function createGovernedGig({
  userId,
  body,
  preflightReceipt,
}: {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  preflightReceipt: KpgsProgressiveReceipt;
}) {
  const updateId = preflightReceipt.updateId;
  if (!updateId) {
    throw new RouteError(400, "KPGS update_id is required for governed gig creation.");
  }

  const payloadHash = governedGigPayloadHash(body, userId);
  await connectDB();

  const existing = await Gig.findOne({ "kpgsProgressive.updateId": updateId });
  if (existing) {
    assertReplayMatch({
      providerId: existing.providerId,
      storedHash: existing.kpgsProgressive?.payloadHash,
      userId,
      payloadHash,
    });
    const replayReceipt = markReplayProofPassed(preflightReceipt);
    return {
      gig: existing,
      replay: true,
      receipt: markGigStateApplied(
        replayReceipt,
        `kasilink://gigs/${String(existing._id)}`,
        true,
      ),
    };
  }

  // Server-side profile and input validation is the POC evidence gate. It executes
  // before Gig.create(), so client-supplied proof can never self-authorize mutation.
  const document = await prepareGigCreate({ userId, body });
  const proofReceipt = markServerProofPassed(preflightReceipt);

  try {
    const gig = await Gig.create({
      ...document,
      kpgsProgressive: {
        updateId,
        payloadHash,
        canonicalSourceSha: KPGS_PROGRESSIVE_UPDATE_SOURCE.commit,
      },
    });

    return {
      gig,
      replay: false,
      receipt: markGigStateApplied(
        proofReceipt,
        `kasilink://gigs/${String(gig._id)}`,
        false,
      ),
    };
  } catch (error) {
    // The sparse unique update-id index closes the concurrent retry race. If the
    // winner wrote identical content, return it as replay; otherwise fail closed.
    if (duplicateKey(error)) {
      const raced = await Gig.findOne({ "kpgsProgressive.updateId": updateId });
      if (raced) {
        assertReplayMatch({
          providerId: raced.providerId,
          storedHash: raced.kpgsProgressive?.payloadHash,
          userId,
          payloadHash,
        });
        const replayReceipt = markReplayProofPassed(preflightReceipt);
        return {
          gig: raced,
          replay: true,
          receipt: markGigStateApplied(
            replayReceipt,
            `kasilink://gigs/${String(raced._id)}`,
            true,
          ),
        };
      }
    }
    throw error;
  }
}
