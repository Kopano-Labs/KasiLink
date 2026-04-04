export default function OfflinePage() {
  return (
    <main className="container flex min-h-[80vh] flex-col items-center justify-center text-center gap-6">
      <div className="text-6xl">⚡</div>
      <div className="kasi-card max-w-md w-full">
        <h1 className="font-headline text-2xl font-bold mb-2">
          You're offline
        </h1>
        <p className="text-on-surface-variant mb-4">
          No connection detected. KasiLink needs internet to load gigs and
          community data.
        </p>
        <p className="text-sm text-outline mb-6">
          Check your data or Wi-Fi and try again. Load-shedding? Your cached
          pages may still be available.
        </p>
        <a href="/" className="btn btn-primary w-full">
          Try again
        </a>
      </div>
    </main>
  );
}
