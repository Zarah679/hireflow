function formatDate(dateValue) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue))
}

function RecentJobs({ jobs, candidateCounts }) {
  return (
    <section id="recent-jobs" className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_18px_50px_-32px_rgba(124,58,237,0.45)]">
      <div className="flex items-start justify-between gap-4 border-b border-violet-100 bg-gradient-to-r from-blue-50/80 via-white to-violet-50/80 p-6 sm:p-7">
        <div>
          <p className="text-sm font-semibold text-zinc-950">Recent jobs</p>
          <p className="mt-1 text-sm text-zinc-500">Your latest openings and candidate totals</p>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          {jobs.length} shown
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-xl text-blue-700">＋</span>
          <h3 className="mt-5 font-semibold text-zinc-900">No jobs yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Your most recently created job openings will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {jobs.map((job) => (
            <article key={job.id} className="flex flex-col gap-4 p-5 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-blue-500/20">
                  {job.title.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-zinc-950">{job.title}</h3>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {[job.department, job.location].filter(Boolean).join(' · ') || 'No department or location'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-5 pl-14 sm:justify-end sm:pl-0">
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-800">{candidateCounts[job.id] || 0}</p>
                  <p className="text-[11px] text-zinc-400">Candidates</p>
                </div>
                <div className="hidden text-right md:block">
                  <p className="text-xs font-medium text-zinc-600">{formatDate(job.created_at)}</p>
                  <p className="mt-1 text-[11px] text-zinc-400">Created</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                  job.status === 'open'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
                >
                  {job.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecentJobs
