const pipelineStages = [
  { key: 'applied', label: 'Applied', color: 'from-blue-500 to-blue-400' },
  { key: 'screening', label: 'Screening', color: 'from-indigo-500 to-blue-500' },
  { key: 'interview', label: 'Interview', color: 'from-violet-500 to-indigo-500' },
  { key: 'offer', label: 'Offer', color: 'from-purple-500 to-violet-500' },
]

function PipelineOverview({ stageCounts }) {
  const activePipelineTotal = pipelineStages.reduce(
    (total, stage) => total + (stageCounts[stage.key] || 0),
    0,
  )

  return (
    <section id="pipeline" className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-white to-violet-50/60 p-6 shadow-[0_18px_50px_-32px_rgba(79,70,229,0.55)] sm:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-violet-300/20 blur-3xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-950">Pipeline overview</p>
          <p className="mt-1 text-sm text-zinc-500">Candidates in active hiring stages</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {activePipelineTotal} active
        </span>
      </div>

      <div className="mt-8 space-y-6">
        {pipelineStages.map((stage) => {
          const count = stageCounts[stage.key] || 0
          const percentage = activePipelineTotal === 0
            ? 0
            : Math.round((count / activePipelineTotal) * 100)

          return (
            <div key={stage.key}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-700">{stage.label}</span>
                <span className="font-semibold text-zinc-950">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stage.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-6">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
          <p className="text-xs font-medium text-emerald-700">Hired</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-950">{stageCounts.hired || 0}</p>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-4 shadow-sm">
          <p className="text-xs font-medium text-violet-700">Rejected</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">{stageCounts.rejected || 0}</p>
        </div>
      </div>
    </section>
  )
}

export default PipelineOverview
