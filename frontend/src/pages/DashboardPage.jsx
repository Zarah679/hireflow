import { useEffect, useState } from 'react'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.jsx'
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton.jsx'
import PipelineOverview from '../components/dashboard/PipelineOverview.jsx'
import RecentJobs from '../components/dashboard/RecentJobs.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getDashboardSummary } from '../services/dashboardService.js'

function DashboardPage() {
  const { token, user, logout } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let requestWasCancelled = false

    getDashboardSummary(token)
      .then((loadedDashboardData) => {
        if (requestWasCancelled) return
        setDashboardData(loadedDashboardData)
      })
      .catch((requestError) => {
        if (!requestWasCancelled) setError(requestError.message)
      })
      .finally(() => {
        if (!requestWasCancelled) setIsLoading(false)
      })

    return () => {
      requestWasCancelled = true
    }
  }, [token, reloadCount])

  function retryDashboard() {
    setError('')
    setIsLoading(true)
    setReloadCount((currentCount) => currentCount + 1)
  }

  const candidateCounts = Object.fromEntries(
    (dashboardData?.recentJobs || []).map((job) => [job.id, job.candidate_count]),
  )
  const stats = [
    {
      label: 'Open jobs',
      value: dashboardData?.stats.openJobs || 0,
      description: 'Roles currently accepting candidates',
      accentClass: 'from-blue-500 to-cyan-400',
    },
    {
      label: 'Total candidates',
      value: dashboardData?.stats.totalCandidates || 0,
      description: 'Applicants across all your jobs',
      accentClass: 'from-violet-500 to-purple-400',
    },
    {
      label: 'Interviewing',
      value: dashboardData?.stats.interviewing || 0,
      description: 'Candidates currently in interviews',
      accentClass: 'from-indigo-500 to-blue-500',
    },
    {
      label: 'Hired',
      value: dashboardData?.stats.hired || 0,
      description: 'Successful candidates to date',
      accentClass: 'from-emerald-500 to-teal-400',
    },
  ]

  return (
    <div className="dashboard-canvas flex min-h-screen bg-zinc-50 text-zinc-950">
      <DashboardSidebar user={user} onLogout={logout} activePage="overview" />

      <div className="min-w-0 flex-1">
        <DashboardHeader
          user={user}
          onLogout={logout}
          eyebrow="Recruiting overview"
          activePage="overview"
        />

        <main id="overview" className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10">
          <div className="dashboard-hero relative mb-8 overflow-hidden rounded-3xl px-6 py-8 text-white sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -right-2 -top-5 h-28 w-28 rounded-full border border-white/15" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
              <p className="text-sm font-medium text-blue-100">Your hiring workspace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Welcome back, {user?.name?.split(' ')[0] || 'Recruiter'}
              </h1>
              </div>
            <p className="max-w-md text-sm leading-6 text-blue-100">
              A quick view of your openings, candidates, and hiring progress.
            </p>
            </div>
          </div>

          {isLoading ? (
            <DashboardSkeleton />
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
              <p className="font-semibold text-red-900">Dashboard data could not be loaded</p>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={retryDashboard}
                className="mt-5 rounded-xl bg-red-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Recruitment statistics">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </section>

              <div className="mt-7 grid items-start gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <PipelineOverview stageCounts={dashboardData.stageCounts} />
                <RecentJobs jobs={dashboardData.recentJobs} candidateCounts={candidateCounts} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
