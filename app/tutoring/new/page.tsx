"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const SUBJECTS = [
  "Mathematics", "Physical Science", "English", "Accounting",
  "Life Sciences", "Geography", "History", "Business Studies",
  "IsiXhosa", "IsiZulu", "Afrikaans",
];

const GRADES = [
  "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "University",
];

const SUBURBS = [
  "Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga",
  "Philippi", "Delft", "Mfuleni", "Crossroads", "Soweto", "Alexandra",
  "Tembisa", "Soshanguve", "Mamelodi", "Diepsloot",
];

export default function NewTutoringPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState({
    subject: "", grade: "", date: "", duration: "120",
    location: "online", meetingLink: "", suburb: "", notes: "",
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
    if (!form.subject) errs.subject = "Select a subject";
    if (!form.grade) errs.grade = "Select a grade";
    if (!form.date) errs.date = "Select a date and time";
    if (!form.suburb) errs.suburb = "Select your suburb";
    const dur = parseInt(form.duration, 10);
    if (isNaN(dur) || dur < 30 || dur > 480) errs.duration = "30–480 minutes";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/tutoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration: dur,
          tutorName: user?.fullName ?? user?.firstName ?? "Tutor",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors ?? { general: data.error ?? "Failed to create session" });
        return;
      }
      router.push("/tutoring");
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container max-w-screen-sm pt-8 pb-12">
      <h1 className="font-headline text-3xl font-bold mb-2">Offer Tutoring</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Create a session so students in your area can find and book you.
      </p>

      {errors.general && (
        <div className="alert alert-danger mb-5">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="form-group">
          <label className="label" htmlFor="subject">Subject *</label>
          <select id="subject" className={`kasi-input ${errors.subject ? "border-error" : ""}`}
            value={form.subject} onChange={(e) => set("subject", e.target.value)}>
            <option value="">Select subject...</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.subject && <span className="error-text">{errors.subject}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="grade">Grade *</label>
          <select id="grade" className={`kasi-input ${errors.grade ? "border-error" : ""}`}
            value={form.grade} onChange={(e) => set("grade", e.target.value)}>
            <option value="">Select grade...</option>
            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          {errors.grade && <span className="error-text">{errors.grade}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="date">Date &amp; Time *</label>
          <input id="date" type="datetime-local"
            className={`kasi-input ${errors.date ? "border-error" : ""}`}
            value={form.date} onChange={(e) => set("date", e.target.value)} />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="duration">Duration (minutes)</label>
          <select id="duration" className="kasi-input"
            value={form.duration} onChange={(e) => set("duration", e.target.value)}>
            <option value="30">30 min</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
          </select>
          {errors.duration && <span className="error-text">{errors.duration}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="location">Location *</label>
          <select id="location" className="kasi-input"
            value={form.location} onChange={(e) => set("location", e.target.value)}>
            <option value="online">Online (Google Meet / Zoom)</option>
            <option value="physical">In Person</option>
          </select>
        </div>

        {form.location === "online" && (
          <div className="form-group">
            <label className="label" htmlFor="meetingLink">Meeting Link</label>
            <input id="meetingLink" className="kasi-input"
              placeholder="e.g. meet.google.com/abc-defg-hij"
              value={form.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} />
          </div>
        )}

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
          <label className="label" htmlFor="notes">Learning Goals / Notes</label>
          <textarea id="notes" rows={3} className="kasi-input"
            placeholder="e.g. Focus on trigonometry past papers. Bring a calculator."
            value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg mt-2">
          {submitting ? "Creating..." : "Create Session"}
        </button>
      </form>
    </div>
  );
}
