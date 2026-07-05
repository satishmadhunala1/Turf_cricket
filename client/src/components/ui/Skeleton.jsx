export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function TurfCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function TurfGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TurfCardSkeleton key={i} />
      ))}
    </div>
  );
}
