"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const CATEGORIES = [
  { value: "car_wash", label: "Car Wash" },
  { value: "cleaning", label: "Cleaning" },
  { value: "tutoring", label: "Tutoring" },
  { value: "repairs", label: "Repairs" },
  { value: "delivery", label: "Delivery" },
  { value: "handyman", label: "Handyman" },
  { value: "solar", label: "Solar / Electricity" },
  { value: "retail", label: "Retail / Shop" },
  { value: "construction", label: "Construction" },
  { value: "healthcare", label: "Healthcare" },
  { value: "logistics", label: "Logistics" },
  { value: "other", label: "Other" },
];

// Suburb → [longitude, latitude] (GeoJSON order: lng first)
const SUBURB_COORDS: Record<string, [number, number]> = {
  "Khayelitsha":      [18.6840, -34.0350],
  "Mitchells Plain":  [18.6181, -34.0534],
  "Gugulethu":        [18.5784, -33.9898],
  "Langa":            [18.5324, -33.9583],
  "Nyanga":           [18.5937, -34.0095],
  "Philippi":         [18.6000, -34.0000],
  "Delft":            [18.6400, -33.9800],
  "Mfuleni":          [18.7100, -34.0100],
  "Crossroads":       [18.5700, -33.9900],
  "Soweto":           [27.8585, -26.2678],
  "Alexandra":        [28.0913, -26.1035],
  "Tembisa":          [28.2267, -25.9975],
  "Cape Town CBD":    [18.4232, -33.9249],
  "Bellville":        [18.6333, -33.9000],
  "Johannesburg CBD": [28.0473, -26.2041],
};

const SUBURBS = Object.keys(SUBURB_COORDS);

function inferCity(suburb: string) {
  if (
    suburb.includes("Cape Town") ||
    ["Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga", "Philippi", "Delft", "Mfuleni", "Crossroads", "Bellville"].includes(suburb)
  ) {
    return "Cape Town";
  }

  return "Johannesburg";
}

export default function PostGigPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    suburb: "",
    payDisplay: "",
    payType: "negotiable",
    payAmount: "",
    slots: "1",
    isUrgent: false,
    isFlexible: true,
    requirements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fieldClass = (name: keyof typeof form) =>
    `kasi-input ${errors[name] ? "border-error" : ""}`;

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const set = (field: string, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // Client-side validation
    const errs: Record<string, string> = {};
    if (form.title.trim().length < 5) errs.title = "At least 5 characters";
    if (form.description.trim().length < 10)
      errs.description = "At least 10 characters";
    if (!form.category) errs.category = "Select a category";
    if (!form.suburb) errs.suburb = "Select your suburb";
    if (!form.payDisplay.trim())
      errs.payDisplay = "Describe the pay (e.g. R150/day)";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          payDisplay: form.payDisplay.trim(),
          payType: form.payType,
          payAmount: form.payAmount ? parseFloat(form.payAmount) : undefined,
          slots: parseInt(form.slots) || 1,
          isUrgent: form.isUrgent,
          isFlexible: form.isFlexible,
          requirements: form.requirements
            ? form.requirements
                .split(",")
                .map((r) => r.trim())
                .filter(Boolean)
            : [],
          location: {
            type: "Point",
            coordinates: SUBURB_COORDS[form.suburb] ?? [28.0473, -26.2041],
            suburb: form.suburb,
            city: inferCity(form.suburb),
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(
          data.errors ?? { general: data.error ?? "Failed to post gig" },
        );
        return;
      }

      const data = await res.json();
      router.push(`/gigs/${data.gig._id}`);
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-screen-sm pt-8 pb-12 container">
      <h1 className="mb-2 font-headline text-3xl font-bold">Post a Gig</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Find someone in your neighbourhood fast.
      </p>

      {errors.general && (
        <div className="alert alert-danger mb-5">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="gap-5 flex flex-col">
        {/* Title */}
        <div className="form-group">
          <label className="label" htmlFor="title">
            Gig Title *
          </label>
          <input
            id="title"
            className={fieldClass("title")}
            placeholder="e.g. Car wash needed in Soweto"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
          {errors.title && (
            <span className="error-text mt-1 block">{errors.title}</span>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="label" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            className={fieldClass("category")}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="error-text mt-1 block">{errors.category}</span>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="label" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            className={fieldClass("description")}
            rows={4}
            placeholder="What needs to be done? Any specific requirements?"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          {errors.description && (
            <span className="error-text mt-1 block">{errors.description}</span>
          )}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="label" htmlFor="suburb">
            Suburb / Township *
          </label>
          <select
            id="suburb"
            className={fieldClass("suburb")}
            value={form.suburb}
            onChange={(e) => set("suburb", e.target.value)}
          >
            <option value="">Select suburb…</option>
            {SUBURBS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.suburb && (
            <span className="error-text mt-1 block">{errors.suburb}</span>
          )}
        </div>

        {/* Pay */}
        <div className="form-group">
          <label className="label" htmlFor="payDisplay">
            Pay *
          </label>
          <input
            id="payDisplay"
            className={fieldClass("payDisplay")}
            placeholder="e.g. R150/day, R80/car, Negotiable"
            value={form.payDisplay}
            onChange={(e) => set("payDisplay", e.target.value)}
          />
          {errors.payDisplay && (
            <span className="error-text mt-1 block">{errors.payDisplay}</span>
          )}
        </div>

        {/* Slots */}
        <div className="form-group">
          <label className="label" htmlFor="slots">
            Number of people needed
          </label>
          <input
            id="slots"
            type="number"
            min={1}
            max={20}
            className="kasi-input"
            value={form.slots}
            onChange={(e) => set("slots", e.target.value)}
          />
        </div>

        {/* Requirements */}
        <div className="form-group">
          <label className="label" htmlFor="requirements">
            Requirements (optional, comma-separated)
          </label>
          <input
            id="requirements"
            className="kasi-input"
            placeholder="e.g. own transport, experience preferred"
            value={form.requirements}
            onChange={(e) => set("requirements", e.target.value)}
          />
        </div>

        {/* Flags */}
        <div className="gap-5 flex flex-wrap">
          <label className="gap-2 flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={form.isUrgent}
              onChange={(e) => set("isUrgent", e.target.checked)}
            />
            <span className="text-sm text-on-surface-variant">
              🔥 Urgent — needed ASAP
            </span>
          </label>
          <label className="gap-2 flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={form.isFlexible}
              onChange={(e) => set("isFlexible", e.target.checked)}
            />
            <span className="text-sm text-on-surface-variant">
              🕐 Flexible timing
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-lg mt-3"
        >
          {submitting ? "Posting…" : "Post Gig"}
        </button>
      </form>
    </div>
  );
}
