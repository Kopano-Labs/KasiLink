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

const SUBURBS = [
  "Soweto","Alexandra","Tembisa","Katlehong","Diepsloot","Ivory Park",
  "Orange Farm","Soshanguve","Mamelodi","Thokoza","Vosloorus","Sebokeng",
  "Johannesburg CBD","Sandton","Randburg","Roodepoort","Pretoria",
];

export default function PostGigPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const [form, setForm] = useState({
    title: "", description: "", category: "",
    suburb: "", payDisplay: "", payType: "negotiable",
    payAmount: "", slots: "1", isUrgent: false, isFlexible: true,
    requirements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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
    if (form.description.trim().length < 10) errs.description = "At least 10 characters";
    if (!form.category) errs.category = "Select a category";
    if (!form.suburb) errs.suburb = "Select your suburb";
    if (!form.payDisplay.trim()) errs.payDisplay = "Describe the pay (e.g. R150/day)";

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
            ? form.requirements.split(",").map((r) => r.trim()).filter(Boolean)
            : [],
          location: {
            type: "Point",
            coordinates: [28.0473, -26.2041], // default Joburg; real app uses Geocoding API
            suburb: form.suburb,
            city: "Johannesburg",
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors ?? { general: data.error ?? "Failed to post gig" });
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
    <div className="container" style={{ maxWidth: 640, paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
      <h1 style={{ marginBottom: "var(--space-2)" }}>Post a Gig</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)", marginBottom: "var(--space-8)" }}>
        Find someone in your neighbourhood fast.
      </p>

      {errors.general && (
        <div className="alert alert-danger" style={{ marginBottom: "var(--space-5)" }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

        {/* Title */}
        <div className="form-group">
          <label className="label" htmlFor="title">Gig Title *</label>
          <input id="title" className={`input ${errors.title ? "input-error" : ""}`}
            placeholder="e.g. Car wash needed in Soweto"
            value={form.title} onChange={(e) => set("title", e.target.value)} />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="label" htmlFor="category">Category *</label>
          <select id="category" className={`input ${errors.category ? "input-error" : ""}`}
            value={form.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="label" htmlFor="description">Description *</label>
          <textarea id="description" className={`input ${errors.description ? "input-error" : ""}`}
            rows={4} placeholder="What needs to be done? Any specific requirements?"
            value={form.description} onChange={(e) => set("description", e.target.value)} />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="label" htmlFor="suburb">Suburb / Township *</label>
          <select id="suburb" className={`input ${errors.suburb ? "input-error" : ""}`}
            value={form.suburb} onChange={(e) => set("suburb", e.target.value)}>
            <option value="">Select suburb…</option>
            {SUBURBS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.suburb && <span className="error-text">{errors.suburb}</span>}
        </div>

        {/* Pay */}
        <div className="form-group">
          <label className="label" htmlFor="payDisplay">Pay *</label>
          <input id="payDisplay" className={`input ${errors.payDisplay ? "input-error" : ""}`}
            placeholder="e.g. R150/day, R80/car, Negotiable"
            value={form.payDisplay} onChange={(e) => set("payDisplay", e.target.value)} />
          {errors.payDisplay && <span className="error-text">{errors.payDisplay}</span>}
        </div>

        {/* Slots */}
        <div className="form-group">
          <label className="label" htmlFor="slots">Number of people needed</label>
          <input id="slots" type="number" min={1} max={20} className="input"
            value={form.slots} onChange={(e) => set("slots", e.target.value)} />
        </div>

        {/* Requirements */}
        <div className="form-group">
          <label className="label" htmlFor="requirements">Requirements (optional, comma-separated)</label>
          <input id="requirements" className="input"
            placeholder="e.g. own transport, experience preferred"
            value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
        </div>

        {/* Flags */}
        <div style={{ display: "flex", gap: "var(--space-5)", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
            <input type="checkbox" checked={form.isUrgent} onChange={(e) => set("isUrgent", e.target.checked)} />
            <span style={{ fontSize: "var(--font-size-sm)" }}>🔥 Urgent — needed ASAP</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
            <input type="checkbox" checked={form.isFlexible} onChange={(e) => set("isFlexible", e.target.checked)} />
            <span style={{ fontSize: "var(--font-size-sm)" }}>🕐 Flexible timing</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}
          style={{ marginTop: "var(--space-3)" }}>
          {submitting ? "Posting…" : "Post Gig"}
        </button>
      </form>
    </div>
  );
}
