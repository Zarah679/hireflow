import Logo from '../Logo.jsx'
import { Link } from 'react-router-dom'

const navigationItems = [
  { key: 'overview', label: 'Overview', to: '/app', symbol: '⌂' },
  { key: 'jobs', label: 'Job openings', to: '/app/jobs', symbol: '□' },
  { key: 'pipeline', label: 'Pipeline', to: '/app/pipeline', symbol: '⌁' },
  { key: 'candidates', label: 'Candidates', to: '/app/candidates', symbol: '◎' },
]

function DashboardSidebar({ user, onLogout, activePage }) {
  const initials = user?.name
    ?.split(' ')
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'HF'

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-blue-100 bg-gradient-to-b from-white via-white to-blue-50/70 p-5 lg:flex lg:flex-col">
      <div className="px-2 py-2">
        <Logo to="/app" />
      </div>

      <nav className="mt-10 space-y-1" aria-label="Dashboard navigation">
        {navigationItems.map((item) => {
          const isActive = item.key === activePage

          return (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            <span className={`grid h-7 w-7 place-items-center rounded-lg text-base ${
              isActive ? 'bg-white/20 text-white shadow-sm' : 'text-zinc-400'
            }`}
            >
              {item.symbol}
            </span>
            {item.label}
          </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">{user?.name || 'Recruiter'}</p>
            <p className="truncate text-xs text-zinc-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}

export default DashboardSidebar
