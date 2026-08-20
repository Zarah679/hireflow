const pipelineColumns = [
  {
    title: 'Applied',
    candidates: [
      { initials: 'AO', name: 'Amara Okafor', role: 'Product designer' },
      { initials: 'MK', name: 'Malik Khan', role: 'Frontend engineer' },
    ],
  },
  {
    title: 'Screening',
    candidates: [
      { initials: 'TN', name: 'Tara Nelson', role: 'Product designer' },
    ],
  },
  {
    title: 'Interview',
    candidates: [
      { initials: 'JL', name: 'Jordan Lee', role: 'Frontend engineer' },
    ],
  },
]

function PipelinePreview() {
  return (
    <div className="pipeline-shell relative overflow-hidden rounded-[2rem] border border-blue-300/40 bg-zinc-950 p-3 sm:p-5">
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="relative rounded-[1.4rem] bg-zinc-100 p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-500">Frontend Engineer</p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-950">Candidate pipeline</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span className="h-2 w-2 rounded-full bg-zinc-950" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {pipelineColumns.map((column) => (
            <div key={column.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-zinc-700">{column.title}</p>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  {column.candidates.length}
                </span>
              </div>
              <div className="space-y-2">
                {column.candidates.map((candidate) => (
                  <article key={candidate.name} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
                    <span className="mb-7 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[9px] font-bold text-white shadow-sm shadow-blue-300">
                      {candidate.initials}
                    </span>
                    <p className="text-xs font-semibold text-zinc-900">{candidate.name}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-500">{candidate.role}</p>
                  </article>
                ))}
                {column.candidates.length === 1 && (
                  <div className="h-[118px] rounded-xl border border-dashed border-zinc-200" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 h-1 w-28 -translate-x-1/2 rounded-t-full bg-zinc-700" />
    </div>
  )
}

export default PipelinePreview
