import Logo from '../Logo.jsx'
import { Link } from 'react-router-dom'

function DashboardHeader({ user, onLogout, eyebrow, activePage = 'overview' }) {
  const formattedDate = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 shadow-[0_1px_20px_rgba(59,130,246,0.06)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-5 sm:px-8">
        <div className="lg:hidden">
          <Logo to="/app" />
        </div>
        <div className="hidden lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{eyebrow}</p>
          <p className="mt-1 text-sm font-medium text-zinc-700">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-zinc-900">{user?.name || 'Recruiter'}</p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm transition hover:border-zinc-400 hover:text-zinc-950 lg:hidden"
          >
            Log out
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-zinc-200 px-5 py-2 lg:hidden" aria-label="Mobile dashboard navigation">
        {[
          { key: 'overview', label: 'Overview', to: '/app' },
          { key: 'jobs', label: 'Job openings', to: '/app/jobs' },
          { key: 'pipeline', label: 'Pipeline', to: '/app/pipeline' },
          { key: 'candidates', label: 'Candidates', to: '/app/candidates' },
        ].map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
              activePage === item.key
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20'
                : 'text-zinc-500'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default DashboardHeader
