function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-7" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-44 rounded-2xl border border-zinc-200 bg-white" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="h-[430px] rounded-3xl border border-zinc-200 bg-white" />
        <div className="h-[430px] rounded-3xl border border-zinc-200 bg-white" />
      </div>
    </div>
  )
}

export default DashboardSkeleton
