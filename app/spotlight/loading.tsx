export default function Loading() {
  return (
    <div className="container pt-8 pb-12">
      <div className="h-8 w-52 bg-surface-container-high rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="kasi-card animate-pulse">
            <div className="h-12 w-12 rounded-xl bg-surface-container-high mb-3" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded mb-2" />
            <div className="h-3 w-full bg-surface-container-high rounded mb-2" />
            <div className="h-3 w-2/3 bg-surface-container-high rounded mb-4" />
            <div className="h-5 w-24 bg-surface-container-high rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
