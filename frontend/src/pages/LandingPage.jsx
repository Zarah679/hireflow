import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import PipelinePreview from '../components/PipelinePreview.jsx'
import { useAuth } from '../hooks/useAuth.js'

const features = [
  {
    number: '01',
    title: 'Jobs stay organized',
    description: 'Keep every opening, department, location, and status in one focused workspace.',
  },
  {
    number: '02',
    title: 'Every candidate has context',
    description: 'See candidate details, experience, notes, and the current hiring stage together.',
  },
  {
    number: '03',
    title: 'The pipeline stays visible',
    description: 'Move applicants from Applied to Hired without losing track of the next decision.',
  },
]

function LandingPage() {
  const { token } = useAuth()

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />

          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
            <a className="transition hover:text-zinc-950" href="#product">Product</a>
            <a className="transition hover:text-zinc-950" href="#workflow">Workflow</a>
            <a className="transition hover:text-zinc-950" href="#why-hireflow">Why HireFlow</a>
          </div>

          {token ? (
            <Link
              to="/app"
              className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
            >
              Open workspace
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 sm:block"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
              >
                Get started
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        <section id="product" className="hero-grid overflow-hidden border-b border-zinc-200">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:py-32">
            <div className="fade-up max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
                Applicant tracking for focused teams
              </div>
              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950 sm:text-7xl lg:text-[5.4rem]">
                Hiring moves better when{' '}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  everything flows.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl">
                Organize openings, keep candidate context close, and move every applicant through a clear hiring pipeline.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25"
                >
                  Start hiring <span aria-hidden="true">→</span>
                </Link>
                <a
                  href="#workflow"
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-7 py-3.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-100"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-zinc-600">
                <span>✓ Built for small hiring teams</span>
                <span>✓ No complicated setup</span>
              </div>
            </div>

            <div className="fade-up-delay lg:pl-5">
              <PipelinePreview />
            </div>
          </div>
        </section>

        <section id="why-hireflow" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Why HireFlow</p>
                <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Less admin. More confident decisions.
                </h2>
              </div>
              <div className="grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 md:grid-cols-3">
                {features.map((feature) => (
                  <article key={feature.number} className="bg-zinc-50 p-7 sm:p-8">
                    <span className="text-xs font-bold text-blue-600">{feature.number}</span>
                    <h3 className="mt-12 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">{feature.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="dark-glow border-y border-zinc-800 bg-zinc-950 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid items-end gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">A clear workflow</p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  From opening to offer, without the spreadsheet maze.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-zinc-400 lg:justify-self-end">
                Create a role, add candidates, capture the details that matter, and update each stage as the process moves forward.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {['Create the opening', 'Add your candidates', 'Move through each stage'].map((step, index) => (
                <div key={step} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-blue-400/40 bg-blue-500/10 text-xs font-bold text-blue-300 shadow-[0_0_24px_rgba(59,130,246,0.16)]">
                    {index + 1}
                  </span>
                  <p className="mt-10 text-lg font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Ready when you are</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Build a hiring process your team can actually follow.
            </h2>
            <Link
              to="/register"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
            >
              Create your workspace <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <p>Simple applicant tracking for focused hiring teams.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
