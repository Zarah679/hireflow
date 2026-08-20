function StatCard({ label, value, description, accentClass }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50/60 p-5 shadow-[0_10px_35px_-20px_rgba(37,99,235,0.4)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-blue-200/50">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClass}`} />
      <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-md ${accentClass}`}>
        ↗
      </div>
      <p className="mt-5 text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">{value}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-400">{description}</p>
    </article>
  )
}

export default StatCard
