import { useEffect } from 'react'

function ConfirmDialog({ title, message, confirmLabel, isWorking, error, onCancel, onConfirm }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && !isWorking) onCancel()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isWorking, onCancel])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/60 px-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isWorking) onCancel()
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 shadow-2xl shadow-zinc-950/30 sm:p-8"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-xl text-red-600">!</span>
        <h2 id="confirm-dialog-title" className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-500">{message}</p>

        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isWorking}
            className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isWorking}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isWorking ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog
