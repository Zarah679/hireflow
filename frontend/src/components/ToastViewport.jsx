function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          className={`toast-enter pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
            toast.type === 'error'
              ? 'border-red-200 bg-red-50/95 text-red-900 shadow-red-950/10'
              : 'border-blue-200 bg-white/95 text-zinc-900 shadow-blue-950/15'
          }`}
        >
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold text-white ${
            toast.type === 'error'
              ? 'bg-red-600'
              : 'bg-gradient-to-br from-blue-500 to-violet-600'
          }`}
          >
            {toast.type === 'error' ? '!' : '✓'}
          </span>
          <p className="flex-1 pt-1.5 text-sm font-medium leading-5">{toast.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="text-lg leading-none text-zinc-400 transition hover:text-zinc-700"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastViewport
