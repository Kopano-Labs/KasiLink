export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      <div className="h-8 w-48 bg-surface-container-high rounded animate-pulse mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse flex gap-4 items-start">
            <div className="h-10 w-10 rounded-xl bg-surface-container-high shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-2/3 bg-surface-container-high rounded mb-2" />
              <div className="h-3 w-full bg-surface-container-high rounded mb-2" />
              <div className="h-3 w-1/2 bg-surface-container-high rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
