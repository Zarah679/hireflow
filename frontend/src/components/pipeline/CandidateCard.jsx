function getInitials(name) {
  return name
    .split(' ')
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function CandidateCard({ candidate, jobTitle, accentClass, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(candidate)}
      className="group w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/70"
    >
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-md ${accentClass}`}>
          {getInitials(candidate.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-950">{candidate.name}</p>
          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {candidate.experience_level || 'Experience not specified'}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
        <p className="truncate text-[11px] font-medium text-zinc-500">{jobTitle}</p>
        <span className="text-xs text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600">→</span>
      </div>
    </button>
  )
}

export default CandidateCard
