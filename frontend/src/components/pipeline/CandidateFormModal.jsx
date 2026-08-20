import { useEffect, useState } from 'react'

const candidateStages = [
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
]

function CandidateFormModal({ candidate, jobs, defaultJobId, isSaving, error, onClose, onSubmit }) {
  const isEditing = Boolean(candidate)
  const [formData, setFormData] = useState(() => ({
    job_id: String(candidate?.job_id || defaultJobId || jobs[0]?.id || ''),
    name: candidate?.name || '',
    email: candidate?.email || '',
    experience_level: candidate?.experience_level || '',
    stage: candidate?.stage || 'applied',
    notes: candidate?.notes || '',
  }))

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && !isSaving) onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSaving, onClose])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit(formData)
  }

  const candidateJob = jobs.find((job) => job.id === candidate?.job_id)

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-zinc-950/60 px-4 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-modal-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-violet-950/30"
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-6 text-white sm:px-8">
          <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full border border-white/20" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
            {isEditing ? 'Candidate details' : 'New candidate'}
          </p>
          <h2 id="candidate-modal-title" className="mt-2 text-2xl font-semibold tracking-tight">
            {isEditing ? `Update ${candidate.name}` : 'Add someone to the pipeline'}
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            {isEditing
              ? 'Edit their information, notes, or move them to another stage.'
              : 'Capture the essentials and choose their starting stage.'}
          </p>
        </div>

        <form className="max-h-[72vh] space-y-5 overflow-y-auto p-6 sm:p-8" onSubmit={handleSubmit}>
          {isEditing ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium text-blue-600">Job opening</p>
              <p className="mt-1 text-sm font-semibold text-blue-950">{candidateJob?.title || 'Unknown job'}</p>
            </div>
          ) : (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Job opening</span>
              <select
                required
                name="job_id"
                value={formData.job_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </label>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Full name</span>
              <input
                autoFocus
                required
                maxLength="100"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Candidate name"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Email address</span>
              <input
                required
                type="email"
                maxLength="255"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="candidate@example.com"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Experience level</span>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Not specified</option>
                <option value="entry-level">Entry-level</option>
                <option value="mid-level">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Pipeline stage</span>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {candidateStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">Notes</span>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add screening notes, interview feedback, or useful context…"
              className="w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : isEditing ? 'Save changes' : 'Add candidate'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default CandidateFormModal
