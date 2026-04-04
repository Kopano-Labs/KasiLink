"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Session {
  _id: string;
  tutorId: string;
  tutorName: string;
  studentId: string | null;
  studentName: string | null;
  subject: string;
  grade: string;
  date: string;
  duration: number;
  location: "online" | "physical";
  meetingLink: string | null;
  suburb: string;
  notes: string;
  status: string;
  reference: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  open: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  pending: { bg: "bg-warning/10", text: "text-warning", dot: "bg-warning" },
  confirmed: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary animate-pulse" },
  completed: { bg: "bg-success/10", text: "text-success", dot: "bg-success" },
  cancelled: { bg: "bg-error/10", text: "text-error", dot: "bg-error" },
};

export default function TutoringDetailPage() {
  const params = useParams();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tutoring/${params.id}`)
      .then((r) => r.json())
      .then((d) => setSession(d.session ?? null))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="container max-w-screen-sm pt-8 pb-12">
        <p className="text-on-surface-variant text-center py-12">Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container max-w-screen-sm pt-8 pb-12 text-center">
        <p className="text-on-surface-variant mb-4">Session not found.</p>
        <Link href="/tutoring" className="btn btn-primary btn-sm">Browse Sessions</Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[session.status] ?? STATUS_STYLES.open;
  const sessionDate = new Date(session.date);

  return (
    <div className="container max-w-screen-sm pt-8 pb-20">
      {/* Status + Reference */}
      <div className="flex items-center justify-between mb-6">
        <div className={`${statusStyle.bg} border border-current/20 px-3 py-1 rounded-full flex items-center gap-2`}>
          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${statusStyle.text}`}>
            {session.status}
          </span>
        </div>
        <span className="text-xs text-on-surface-variant italic">
          Ref: {session.reference}
        </span>
      </div>

      {/* Main Card */}
      <div className="kasi-card mb-4">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
            {session.tutorName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold mb-1">
              {session.grade} {session.subject} Tutor
            </h1>
            <p className="text-on-surface-variant text-sm">
              {session.tutorName} (Provider)
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="bg-surface-container px-3 py-1 rounded-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {session.subject}
              </span>
              <span className="bg-surface-container px-3 py-1 rounded-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {session.grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="kasi-card flex flex-col items-center text-center py-4">
          <span className="text-primary text-lg mb-1">📅</span>
          <p className="text-[10px] uppercase text-on-surface-variant tracking-tight">Date</p>
          <p className="font-bold text-sm">
            {sessionDate.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })}
          </p>
        </div>
        <div className="kasi-card flex flex-col items-center text-center py-4">
          <span className="text-primary text-lg mb-1">🕐</span>
          <p className="text-[10px] uppercase text-on-surface-variant tracking-tight">Time</p>
          <p className="font-bold text-sm">
            {sessionDate.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })} ({session.duration / 60}h)
          </p>
        </div>
        <div className="kasi-card flex flex-col items-center text-center py-4">
          <span className="text-primary text-lg mb-1">🎓</span>
          <p className="text-[10px] uppercase text-on-surface-variant tracking-tight">Grade</p>
          <p className="font-bold text-sm">{session.grade}</p>
        </div>
      </div>

      {/* Location Card */}
      <div className="kasi-card mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg text-primary text-lg">
            {session.location === "online" ? "💻" : "📍"}
          </div>
          <div>
            <h3 className="font-bold">
              {session.location === "online" ? "Online Session" : "In Person"}
            </h3>
            <p className="text-sm text-on-surface-variant">
              {session.location === "online"
                ? session.meetingLink ?? "Link will be shared"
                : session.suburb}
            </p>
          </div>
        </div>
      </div>

      {/* Student Info */}
      {session.studentName && (
        <div className="kasi-card mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            Student
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
              {session.studentName.charAt(0)}
            </div>
            <div>
              <p className="font-bold">{session.studentName}</p>
              <p className="text-sm text-on-surface-variant">{session.grade}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {session.notes && (
        <div className="kasi-card mb-4 border-l-4 border-primary">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            Learning Goals &amp; Notes
          </p>
          <p className="text-on-surface leading-relaxed italic">
            &ldquo;{session.notes}&rdquo;
          </p>
        </div>
      )}

      {/* Action */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background via-background to-transparent pt-12">
        <Link
          href="/chat"
          className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2 no-underline"
        >
          💬 Message Provider
        </Link>
      </div>
    </div>
  );
}
