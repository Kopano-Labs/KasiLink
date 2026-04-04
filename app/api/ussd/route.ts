import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Gig from "@/lib/models/Gig";
import Application from "@/lib/models/Application";
import User from "@/lib/models/User";
import Notification from "@/lib/models/Notification";
import { formatSAPhone, isValidSAPhone } from "@/lib/auth.config";
import { sanitize } from "@/lib/validation";

function con(message: string) {
  return new Response(`CON ${message}`, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function end(message: string) {
  return new Response(`END ${message}`, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function normalizeSegments(text: string) {
  if (!text.trim()) return [];
  return text
    .split("*")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findOpenGigsBySuburb(suburb: string) {
  await connectDB();

  return Gig.find({
    status: "open",
    "location.suburb": new RegExp(escapeRegex(suburb), "i"),
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  })
    .sort({ isUrgent: -1, isProviderVerified: -1, createdAt: -1 })
    .limit(5)
    .lean();
}

async function findSeekerByPhone(phoneNumber: string) {
  const normalized = formatSAPhone(phoneNumber);
  if (!isValidSAPhone(normalized)) return null;

  await connectDB();
  return User.findOne({ phone: normalized, isActive: true });
}

async function applyToGigByPhone(phoneNumber: string, gigId: string) {
  const seeker = await findSeekerByPhone(phoneNumber);
  if (!seeker) {
    return {
      ok: false,
      message:
        "Profile not found for this number. Sign in on kasilink.com first, then try USSD again.",
    };
  }

  const gig = await Gig.findById(gigId);
  if (!gig || gig.status !== "open") {
    return {
      ok: false,
      message: "This gig is no longer available.",
    };
  }

  if (gig.providerId === seeker.clerkId) {
    return {
      ok: false,
      message: "You cannot apply to your own gig.",
    };
  }

  try {
    await Application.create({
      gigId: gig._id,
      gigTitle: gig.title,
      seekerId: seeker.clerkId,
      seekerName: seeker.displayName,
      seekerPhone: seeker.phone,
      providerId: gig.providerId,
      providerName: gig.providerName,
      message: sanitize("Applied via KasiLink USSD"),
      status: "pending",
    });

    await Gig.findByIdAndUpdate(gig._id, { $inc: { applicationCount: 1 } });
    await Notification.create({
      userId: gig.providerId,
      type: "application",
      title: "New USSD application received",
      message: `${seeker.displayName} applied to your gig: ${gig.title}`,
      link: `/gigs/${gig._id}`,
    });

    return {
      ok: true,
      message: `Application sent for ${gig.title}. The provider will be notified.`,
    };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return {
        ok: false,
        message: "You already applied to this gig.",
      };
    }

    console.error("[POST /api/ussd apply]", err);
    return {
      ok: false,
      message: "Application failed. Please try again later.",
    };
  }
}

async function fetchMyApplications(phoneNumber: string) {
  const seeker = await findSeekerByPhone(phoneNumber);
  if (!seeker) return null;

  await connectDB();
  return Application.find({ seekerId: seeker.clerkId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
}

async function fetchVerifiedProviders() {
  await connectDB();
  return User.find({ isVerified: true, isActive: true })
    .sort({ "rating.average": -1, createdAt: -1 })
    .limit(5)
    .lean();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
    const text = String(formData.get("text") ?? "");
    const segments = normalizeSegments(text);

    if (!phoneNumber) {
      return end("Phone number missing. Please dial again from your mobile line.");
    }

    if (segments.length === 0) {
      return con(
        [
          "Welcome to KasiLink",
          "",
          "1. Find gigs near me",
          "2. My applications",
          "3. Verified providers",
          "4. Help",
        ].join("\n"),
      );
    }

    if (segments[0] === "1") {
      if (segments.length === 1) {
        return con(
          "Enter your suburb or township\nExample: Soweto, Tembisa, Alexandra",
        );
      }

      const suburb = sanitize(segments[1]).slice(0, 60);
      if (!suburb) {
        return end("Enter a valid suburb or township name and try again.");
      }

      const gigs = await findOpenGigsBySuburb(suburb);

      if (segments.length === 2) {
        if (gigs.length === 0) {
          return end(
            `No open gigs found near ${suburb} right now. Try another suburb or check kasilink.com/marketplace.`,
          );
        }

        const lines = gigs.map(
          (gig, index) =>
            `${index + 1}. ${gig.title.slice(0, 28)} - ${gig.payDisplay}`,
        );

        return con(
          [`Gigs near ${suburb}`, "", ...lines, "", "Choose a gig number"]
            .join("\n")
            .slice(0, 1500),
        );
      }

      const selectedIndex = Number(segments[2]) - 1;
      const selectedGig = gigs[selectedIndex];

      if (!selectedGig) {
        return end("Invalid gig selection. Start again and choose a valid number.");
      }

      if (segments.length === 3) {
        return con(
          [
            `${selectedGig.title}`,
            `${selectedGig.location.suburb}, ${selectedGig.location.city}`,
            `${selectedGig.payDisplay}`,
            "",
            "1. Apply now",
            "2. Exit",
          ].join("\n"),
        );
      }

      if (segments[3] === "1") {
        const result = await applyToGigByPhone(phoneNumber, String(selectedGig._id));
        return end(result.message);
      }

      return end("Session closed.");
    }

    if (segments[0] === "2") {
      const applications = await fetchMyApplications(phoneNumber);
      if (!applications) {
        return end(
          "No KasiLink profile found for this number yet. Sign in on kasilink.com to activate mobile applications.",
        );
      }

      if (applications.length === 0) {
        return end("You have no applications yet.");
      }

      const lines = applications.map(
        (application, index) =>
          `${index + 1}. ${application.gigTitle.slice(0, 24)} - ${application.status}`,
      );

      return end(["My applications", "", ...lines].join("\n").slice(0, 1500));
    }

    if (segments[0] === "3") {
      const providers = await fetchVerifiedProviders();
      if (providers.length === 0) {
        return end("No verified providers are available right now.");
      }

      const lines = providers.map((provider, index) => {
        const category = provider.categories?.[0] || "General";
        const suburb = provider.location?.suburb || "South Africa";
        return `${index + 1}. ${provider.displayName.slice(0, 20)} - ${category} - ${suburb}`;
      });

      return end(
        [
          "Verified providers",
          "",
          ...lines,
          "",
          "For full profiles visit kasilink.com/verified",
        ]
          .join("\n")
          .slice(0, 1500),
      );
    }

    if (segments[0] === "4") {
      return end(
        [
          "KasiLink Help",
          "",
          "Use option 1 to search nearby gigs.",
          "Use option 2 to view your recent applications.",
          "Use option 3 to view verified providers.",
          "",
          "Support: kasilink.com",
        ].join("\n"),
      );
    }

    return end("Invalid option. Dial again and choose 1 to 4.");
  } catch (err) {
    console.error("[POST /api/ussd]", err);
    return end("Service unavailable right now. Please try again later.");
  }
}
