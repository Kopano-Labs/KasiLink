"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Session {
  _id: string;
  tutorName: string;
  subject: string;
  grade: string;
  date: string;
  duration: number;
  location: "online" | "physical";
  suburb: string;
  notes: string;
  reference: string;
}

const SUBJECTS = [
  "Mathematics", "Physical Science", "English", "Accounting",
  "Life Sciences", "Geography", "History", "Business Studies",
  "IsiXhosa", "IsiZulu", "Afrikaans",
];

export default function TutoringPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [suburb, setSuburb] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (suburb) params.set("suburb", suburb);
    setLoading(true);
    fetch(`/api/tutoring?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [subject, suburb]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-ZA", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">Find a Tutor</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Browse available tutoring sessions in your area.
          </p>
        </div>
        <Link href="/tutoring/new" className="btn btn-primary btn-sm">
          Offer Tutoring
        </Link>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          className="kasi-input max-w-[200px]"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          className="kasi-input max-w-[180px]"
          placeholder="Filter by suburb"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-8">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <div className="kasi-card text-center">
          <p className="text-on-surface-variant mb-3">No tutoring sessions available right now.</p>
          <Link href="/tutoring/new" className="btn btn-primary btn-sm">
            Offer Your Skills
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((s) => (
            <Link key={s._id} href={`/tutoring/${s._id}`} className="kasi-card hover:border-primary/50 transition-colors no-underline">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {s.subject}
                    </span>
                    <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {s.grade}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg text-on-surface">
                    {s.subject} — {s.grade}
                  </h2>
                  <p className="text-sm text-on-surface-variant">with {s.tutorName}</p>
                </div>
                <span className="text-xs text-on-surface-variant shrink-0 bg-surface-container px-2 py-1 rounded">
                  {s.location === "online" ? "Online" : s.suburb}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-outline flex-wrap mt-3">
                <span>{formatDate(s.date)}</span>
                <span>·</span>
                <span>{formatTime(s.date)}</span>
                <span>·</span>
                <span>{s.duration} min</span>
                <span>·</span>
                <span>Ref: {s.reference}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
