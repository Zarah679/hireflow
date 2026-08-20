import { Link } from 'react-router-dom'

function Logo({ light = false, to = '/' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2" aria-label="HireFlow home">
      <span
        className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-blue-500/20"
      >
        H
      </span>
      <span className={`text-lg font-semibold tracking-tight ${light ? 'text-white' : 'text-zinc-950'}`}>
        Hire<span className={light ? 'text-blue-300' : 'text-blue-600'}>Flow</span>
      </span>
    </Link>
  )
}

export default Logo
