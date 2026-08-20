import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.jsx'
import CandidateFormModal from '../components/pipeline/CandidateFormModal.jsx'
import PipelineColumn from '../components/pipeline/PipelineColumn.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import {
  createCandidate,
  getCandidatesForJob,
  updateCandidate,
} from '../services/candidateService.js'
import { getJobs } from '../services/jobService.js'

const pipelineStages = [
  {
    key: 'applied',
    label: 'Applied',
    accentClass: 'from-blue-500 to-cyan-400',
    headerClass: 'from-blue-50 to-cyan-50/50',
    countClass: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'screening',
    label: 'Screening',
    accentClass: 'from-indigo-500 to-blue-500',
    headerClass: 'from-indigo-50 to-blue-50/50',
    countClass: 'bg-indigo-100 text-indigo-700',
  },
  {
    key: 'interview',
    label: 'Interview',
    accentClass: 'from-violet-500 to-indigo-500',
    headerClass: 'from-violet-50 to-indigo-50/50',
    countClass: 'bg-violet-100 text-violet-700',
  },
  {
    key: 'offer',
    label: 'Offer',
    accentClass: 'from-fuchsia-500 to-violet-500',
    headerClass: 'from-fuchsia-50 to-violet-50/50',
    countClass: 'bg-fuchsia-100 text-fuchsia-700',
  },
  {
    key: 'hired',
    label: 'Hired',
    accentClass: 'from-emerald-500 to-teal-400',
    headerClass: 'from-emerald-50 to-teal-50/50',
    countClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    accentClass: 'from-rose-500 to-orange-400',
    headerClass: 'from-rose-50 to-orange-50/50',
    countClass: 'bg-rose-100 text-rose-700',
  },
]

async function fetchPipelineData(token) {
  const jobs = await getJobs(token)
  const candidateLists = await Promise.all(
    jobs.map((job) => getCandidatesForJob(token, job.id)),
  )

  return {
    jobs,
    candidates: candidateLists.flat(),
  }
}

function PipelinePage() {
  const { token, user, logout } = useAuth()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [modalError, setModalError] = useState('')
  const selectedJobId = searchParams.get('job') || 'all'

  useEffect(() => {
    let requestWasCancelled = false

    fetchPipelineData(token)
      .then((pageData) => {
        if (requestWasCancelled) return
        setJobs(pageData.jobs)
        setCandidates(pageData.candidates)
      })
      .catch((requestError) => {
        if (!requestWasCancelled) setPageError(requestError.message)
      })
      .finally(() => {
        if (!requestWasCancelled) setIsLoading(false)
      })

    return () => {
      requestWasCancelled = true
    }
  }, [token, reloadCount])

  const jobTitles = Object.fromEntries(jobs.map((job) => [job.id, job.title]))
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const visibleCandidates = candidates.filter((candidate) => {
    const matchesJob = selectedJobId === 'all'
      || String(candidate.job_id) === selectedJobId
    const matchesSearch = !normalizedSearchTerm
      || candidate.name.toLowerCase().includes(normalizedSearchTerm)
      || candidate.email.toLowerCase().includes(normalizedSearchTerm)

    return matchesJob && matchesSearch
  })

  function handleJobFilter(event) {
    const jobId = event.target.value
    setSearchParams(jobId === 'all' ? {} : { job: jobId })
  }

  function openAddCandidate() {
    setSelectedCandidate(null)
    setModalError('')
    setIsModalOpen(true)
  }

  function openCandidate(candidate) {
    setSelectedCandidate(candidate)
    setModalError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    if (isSaving) return
    setIsModalOpen(false)
    setSelectedCandidate(null)
    setModalError('')
  }

  async function handleSaveCandidate(formData) {
    setIsSaving(true)
    setModalError('')

    const candidateData = {
      name: formData.name,
      email: formData.email,
      experience_level: formData.experience_level,
      stage: formData.stage,
      notes: formData.notes,
    }

    try {
      if (selectedCandidate) {
        const updatedCandidate = await updateCandidate(
          token,
          selectedCandidate.id,
          candidateData,
        )
        setCandidates((currentCandidates) => currentCandidates.map((candidate) => (
          candidate.id === updatedCandidate.id ? updatedCandidate : candidate
        )))
        showToast(`${updatedCandidate.name} was updated.`)
      } else {
        const newCandidate = await createCandidate(token, formData.job_id, candidateData)
        setCandidates((currentCandidates) => [newCandidate, ...currentCandidates])
        showToast(`${newCandidate.name} was added to the pipeline.`)
      }

      setIsModalOpen(false)
      setSelectedCandidate(null)
    } catch (requestError) {
      setModalError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  function retryLoading() {
    setPageError('')
    setIsLoading(true)
    setReloadCount((currentCount) => currentCount + 1)
  }

  return (
    <div className="dashboard-canvas flex min-h-screen bg-zinc-50 text-zinc-950">
      <DashboardSidebar user={user} onLogout={logout} activePage="pipeline" />

      <div className="min-w-0 flex-1">
        <DashboardHeader
          user={user}
          onLogout={logout}
          eyebrow="Candidate management"
          activePage="pipeline"
        />

        <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 sm:py-10">
          <section className="dashboard-hero relative overflow-hidden rounded-3xl px-6 py-8 text-white sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute right-28 top-12 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Every candidate, one clear view</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Candidate pipeline</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                  Open a candidate card to update their stage, details, or recruitment notes.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddCandidate}
                disabled={jobs.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-xl shadow-indigo-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-lg leading-none">＋</span> Add candidate
              </button>
            </div>
          </section>

          <section className="mt-7 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Job</span>
              <select
                value={selectedJobId}
                onChange={handleJobFilter}
                className="min-w-52 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">All job openings</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </label>

            <label className="relative block w-full sm:max-w-xs">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search candidates"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </section>

          {isLoading ? (
            <div className="mt-6 grid animate-pulse gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-96 rounded-3xl border border-zinc-200 bg-white" />
              ))}
            </div>
          ) : pageError ? (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-8">
              <p className="font-semibold text-red-900">The pipeline could not be loaded</p>
              <p className="mt-2 text-sm text-red-700">{pageError}</p>
              <button
                type="button"
                onClick={retryLoading}
                className="mt-5 rounded-xl bg-red-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-semibold">Create a job before adding candidates</h2>
              <p className="mt-2 text-sm text-zinc-500">Every candidate must belong to a valid job opening.</p>
            </div>
          ) : (
            <section className="mt-6 grid items-start gap-5 md:grid-cols-2 2xl:grid-cols-3" aria-label="Candidate pipeline">
              {pipelineStages.map((stage) => (
                <PipelineColumn
                  key={stage.key}
                  stage={stage}
                  candidates={visibleCandidates.filter((candidate) => candidate.stage === stage.key)}
                  jobTitles={jobTitles}
                  onOpenCandidate={openCandidate}
                />
              ))}
            </section>
          )}
        </main>
      </div>

      {isModalOpen && (
        <CandidateFormModal
          candidate={selectedCandidate}
          jobs={jobs}
          defaultJobId={selectedJobId === 'all' ? null : selectedJobId}
          isSaving={isSaving}
          error={modalError}
          onClose={closeModal}
          onSubmit={handleSaveCandidate}
        />
      )}
    </div>
  )
}

export default PipelinePage
