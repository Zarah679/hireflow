import { useEffect, useState } from 'react'

const candidateStages = [
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
]

const stageStyles = {
  applied: 'bg-blue-50 text-blue-700',
  screening: 'bg-indigo-50 text-indigo-700',
  interview: 'bg-violet-50 text-violet-700',
  offer: 'bg-fuchsia-50 text-fuchsia-700',
  hired: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
}

function getInitials(name) {
  return name
    .split(' ')
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function CandidateDetailsDrawer({
  candidate,
  jobTitle,
  isSaving,
  error,
  onClose,
  onSave,
  onEdit,
  onDelete,
}) {
  const [stage, setStage] = useState(candidate.stage)
  const [notes, setNotes] = useState(candidate.notes || '')
  const hasChanges = stage !== candidate.stage || notes !== (candidate.notes || '')

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && !isSaving) onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSaving, onClose])

  async function handleSubmit(event) {
    event.preventDefault()
    await onSave({ stage, notes })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-950/65 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose()
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-drawer-title"
        className="drawer-enter absolute inset-y-0 right-0 w-full overflow-y-auto border-l border-blue-100 bg-[#fffdf8] shadow-2xl shadow-zinc-950/30 sm:max-w-xl lg:max-w-2xl"
      >
        <div className="p-6 sm:p-10">
          <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
                {getInitials(candidate.name)}
              </span>
              <div className="min-w-0">
                <h2 id="candidate-drawer-title" className="truncate text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  {candidate.name}
                </h2>
                <p className="mt-1 truncate text-sm text-zinc-500">{jobTitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close candidate details"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-zinc-300 bg-white text-xl text-zinc-500 transition hover:border-blue-300 hover:text-blue-700"
            >
              ×
            </button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">Email</p>
              <p className="mt-2 break-all text-sm font-medium text-zinc-800">{candidate.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">Experience</p>
              <p className="mt-2 text-sm font-medium capitalize text-zinc-800">
                {candidate.experience_level || 'Not specified'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">Job opening</p>
              <p className="mt-2 text-sm font-medium text-zinc-800">{jobTitle}</p>
            </div>
          </div>

          <form className="mt-10 border-t border-zinc-200 pt-8" onSubmit={handleSubmit}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">Stage</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${stageStyles[candidate.stage]}`}>
                  {candidate.stage}
                </span>
                <select
                  value={stage}
                  onChange={(event) => setStage(event.target.value)}
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {candidateStages.map((stageOption) => (
                    <option key={stageOption.value} value={stageOption.value}>
                      Move to {stageOption.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="mt-8 block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows="6"
                placeholder="Screening feedback, interview impressions, or next steps…"
                className="mt-3 w-full resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-4 text-sm leading-6 text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSaving ? 'Saving…' : 'Save stage and notes'}
              </button>
              <button
                type="button"
                onClick={onEdit}
                disabled={isSaving}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
              >
                Edit profile
              </button>
            </div>
          </form>

          <div className="mt-12 border-t border-zinc-200 pt-6">
            <button
              type="button"
              onClick={onDelete}
              disabled={isSaving}
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Delete candidate
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default CandidateDetailsDrawer
