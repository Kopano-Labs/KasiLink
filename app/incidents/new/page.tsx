"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const INCIDENT_TYPES = [
  { value: "safety", label: "Safety Concern" },
  { value: "load_shedding", label: "Load Shedding Alert" },
  { value: "water_outage", label: "Water Outage" },
  { value: "road", label: "Road Problem" },
  { value: "other", label: "Other" },
];

const SUBURBS = [
  "Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga",
  "Philippi", "Delft", "Mfuleni", "Crossroads", "Soweto", "Alexandra",
  "Tembisa", "Cape Town CBD", "Bellville", "Johannesburg CBD",
];

export default function ReportIncidentPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState({
    type: "", title: "", description: "", suburb: "", severity: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const errs: Record<string, string> = {};
    if (!form.type) errs.type = "Select an incident type";
    if (form.title.trim().length < 5) errs.title = "At least 5 characters";
    if (form.description.trim().length < 10) errs.description = "At least 10 characters";
    if (!form.suburb) errs.suburb = "Select your suburb";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          reporterName: user?.fullName ?? user?.firstName ?? "Anonymous",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors ?? { general: data.error ?? "Failed to submit" });
        return;
      }
      router.push("/incidents");
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container max-w-screen-sm pt-8 pb-12">
      <h1 className="font-headline text-3xl font-bold mb-2">Report an Incident</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Alert the community about safety issues, outages, or road problems.
      </p>

      {errors.general && (
        <div className="alert alert-danger mb-5">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="form-group">
          <label className="label" htmlFor="type">Incident Type *</label>
          <select id="type" className={`kasi-input ${errors.type ? "border-error" : ""}`}
            value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="">Select type...</option>
            {INCIDENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.type && <span className="error-text">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="suburb">Suburb / Township *</label>
          <select id="suburb" className={`kasi-input ${errors.suburb ? "border-error" : ""}`}
            value={form.suburb} onChange={(e) => set("suburb", e.target.value)}>
            <option value="">Select suburb...</option>
            {SUBURBS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.suburb && <span className="error-text">{errors.suburb}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" className={`kasi-input ${errors.title ? "border-error" : ""}`}
            placeholder="e.g. Water off in Section B since 6am"
            value={form.title} onChange={(e) => set("title", e.target.value)} />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="description">Description *</label>
          <textarea id="description" rows={4}
            className={`kasi-input ${errors.description ? "border-error" : ""}`}
            placeholder="Describe what is happening, where exactly, and how people are affected."
            value={form.description} onChange={(e) => set("description", e.target.value)} />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="severity">Severity</label>
          <select id="severity" className="kasi-input"
            value={form.severity} onChange={(e) => set("severity", e.target.value)}>
            <option value="low">Low — Minor issue, not urgent</option>
            <option value="medium">Medium — Affects daily life</option>
            <option value="high">High — Dangerous or widespread</option>
          </select>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg mt-2">
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
