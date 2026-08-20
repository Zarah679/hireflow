const stageStyles = {
  applied: 'bg-blue-50 text-blue-700 ring-blue-100',
  screening: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  interview: 'bg-violet-50 text-violet-700 ring-violet-100',
  offer: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100',
  hired: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-100',
}

function getInitials(name) {
  return name
    .split(' ')
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function StageBadge({ stage }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${stageStyles[stage]}`}>
      {stage}
    </span>
  )
}

function CandidateList({ candidates, jobTitles, onOpen }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_18px_50px_-36px_rgba(37,99,235,0.5)] md:block">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gradient-to-r from-blue-50 via-white to-violet-50 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
            <tr>
              <th className="px-6 py-4">Candidate</th>
              <th className="px-5 py-4">Job opening</th>
              <th className="px-5 py-4">Experience</th>
              <th className="px-6 py-4">Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                tabIndex="0"
                onClick={() => onOpen(candidate)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onOpen(candidate)
                  }
                }}
                className="cursor-pointer transition hover:bg-blue-50/50 focus:bg-blue-50/50 focus:outline-none"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white shadow-md shadow-blue-500/20">
                      {getInitials(candidate.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-950">{candidate.name}</p>
                      <p className="mt-0.5 truncate text-xs text-zinc-500">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td className="max-w-52 truncate px-5 py-4 text-sm font-medium text-zinc-700">
                  {jobTitles[candidate.job_id] || 'Unknown job'}
                </td>
                <td className="px-5 py-4 text-sm capitalize text-zinc-500">
                  {candidate.experience_level || 'Not specified'}
                </td>
                <td className="px-6 py-4"><StageBadge stage={candidate.stage} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {candidates.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            onClick={() => onOpen(candidate)}
            className="w-full rounded-2xl border border-blue-100 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
                  {getInitials(candidate.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-950">{candidate.name}</p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">{candidate.email}</p>
                </div>
              </div>
              <StageBadge stage={candidate.stage} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4 text-xs">
              <div>
                <p className="text-zinc-400">Job opening</p>
                <p className="mt-1 font-medium text-zinc-700">{jobTitles[candidate.job_id]}</p>
              </div>
              <div>
                <p className="text-zinc-400">Experience</p>
                <p className="mt-1 capitalize font-medium text-zinc-700">{candidate.experience_level || 'Not specified'}</p>
              </div>
            </div>
            <p className="mt-5 border-t border-zinc-100 pt-4 text-xs font-semibold text-blue-700">
              View candidate details →
            </p>
          </button>
        ))}
      </div>
    </>
  )
}

export default CandidateList
