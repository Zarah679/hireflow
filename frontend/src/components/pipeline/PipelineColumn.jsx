import CandidateCard from './CandidateCard.jsx'

function PipelineColumn({ stage, candidates, jobTitles, onOpenCandidate }) {
  return (
    <section className="flex min-h-72 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white/75 shadow-[0_14px_45px_-34px_rgba(79,70,229,0.5)] backdrop-blur-sm">
      <header className={`border-b border-zinc-100 bg-gradient-to-r px-5 py-4 ${stage.headerClass}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br shadow-sm ${stage.accentClass}`} />
            <h2 className="text-xs font-bold uppercase tracking-[0.13em] text-zinc-800">{stage.label}</h2>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stage.countClass}`}>
            {candidates.length}
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-3 p-4">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            jobTitle={jobTitles[candidate.job_id] || 'Unknown job'}
            accentClass={stage.accentClass}
            onOpen={onOpenCandidate}
          />
        ))}

        {candidates.length === 0 && (
          <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-zinc-200 bg-white/50 px-4 text-center">
            <p className="text-xs leading-5 text-zinc-400">No candidates in this stage</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default PipelineColumn
