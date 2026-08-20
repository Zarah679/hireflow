import { useEffect, useState } from 'react'

const initialFormData = {
  title: '',
  department: '',
  location: '',
  status: 'open',
}

function JobFormModal({ job, isSaving, error, onClose, onSubmit }) {
  const isEditing = Boolean(job)
  const [formData, setFormData] = useState(() => (
    job
      ? {
          title: job.title,
          department: job.department || '',
          location: job.location || '',
          status: job.status,
        }
      : initialFormData
  ))

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
    const wasSaved = await onSubmit(formData)

    if (wasSaved && !isEditing) setFormData(initialFormData)
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/55 px-4 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-job-title"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-violet-950/30"
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-6 text-white sm:px-8">
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-white/20" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
            {isEditing ? 'Job settings' : 'New opening'}
          </p>
          <h2 id="create-job-title" className="mt-2 text-2xl font-semibold tracking-tight">
            {isEditing ? `Edit ${job.title}` : 'Create a job opening'}
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            {isEditing ? 'Update the role information or change its status.' : 'Add the essentials now. You can update them later.'}
          </p>
        </div>

        <form className="space-y-5 p-6 sm:p-8" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">Job title</span>
            <input
              autoFocus
              required
              maxLength="150"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Senior Product Designer"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Department</span>
              <input
                maxLength="100"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Design"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Location</span>
              <input
                maxLength="150"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Lagos or Remote"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
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
              {isSaving ? 'Saving…' : isEditing ? 'Save changes' : 'Create opening'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default JobFormModal
