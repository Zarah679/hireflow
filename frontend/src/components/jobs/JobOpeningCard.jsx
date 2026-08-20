function formatDate(dateValue) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue))
}

function JobOpeningCard({ job, candidateCount, isUpdating, onEdit, onToggleStatus, onDelete }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_14px_45px_-30px_rgba(37,99,235,0.5)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-blue-200/40">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-base font-bold text-white shadow-lg shadow-blue-500/20">
          {job.title.charAt(0).toUpperCase()}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          job.status === 'open'
            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
            : 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200'
        }`}
        >
          {job.status}
        </span>
      </div>

      <h2 className="mt-7 text-xl font-semibold tracking-tight text-zinc-950">{job.title}</h2>
      <p className="mt-2 min-h-5 text-sm text-zinc-500">
        {[job.department, job.location].filter(Boolean).join(' · ') || 'Department and location not set'}
      </p>

      <div className="mt-7 flex items-end justify-between border-t border-zinc-100 pt-5">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-blue-700">{candidateCount}</p>
          <p className="mt-1 text-xs text-zinc-500">{candidateCount === 1 ? 'Candidate' : 'Candidates'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-zinc-600">{formatDate(job.created_at)}</p>
          <p className="mt-1 text-[11px] text-zinc-400">Created</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onEdit(job)}
          disabled={isUpdating}
          className="rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-semibold text-zinc-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onToggleStatus(job)}
          disabled={isUpdating}
          className="rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-semibold text-zinc-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
        >
          {isUpdating ? 'Saving…' : job.status === 'open' ? 'Close' : 'Reopen'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(job)}
          disabled={isUpdating}
          className="rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
      <Link
        to={`/app/pipeline?job=${job.id}`}
        className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
      >
        View pipeline <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}

export default JobOpeningCard
import { Link } from 'react-router-dom'
