export default function CommandesEcolesLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-9 w-32 bg-muted animate-pulse rounded" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-muted animate-pulse rounded" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-muted animate-pulse rounded" />
              <div className="w-48 h-10 bg-muted animate-pulse rounded" />
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
