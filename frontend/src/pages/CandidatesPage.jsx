import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CandidateList from '../components/candidates/CandidateList.jsx'
import CandidateDetailsDrawer from '../components/candidates/CandidateDetailsDrawer.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.jsx'
import CandidateFormModal from '../components/pipeline/CandidateFormModal.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import {
  createCandidate,
  deleteCandidate,
  getCandidatesForJob,
  updateCandidate,
} from '../services/candidateService.js'
import { getJobs } from '../services/jobService.js'

const candidateStages = [
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
]

async function fetchCandidatesPageData(token) {
  const jobs = await getJobs(token)
  const candidateLists = await Promise.all(
    jobs.map((job) => getCandidatesForJob(token, job.id)),
  )

  return {
    jobs,
    candidates: candidateLists.flat(),
  }
}

function CandidatesPage() {
  const { token, user, logout } = useAuth()
  const { showToast } = useToast()
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [jobFilter, setJobFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false)
  const [candidateForForm, setCandidateForForm] = useState(null)
  const [activeCandidate, setActiveCandidate] = useState(null)
  const [candidateModalError, setCandidateModalError] = useState('')
  const [drawerError, setDrawerError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [candidateToDelete, setCandidateToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let requestWasCancelled = false

    fetchCandidatesPageData(token)
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
  const visibleCandidates = candidates
    .filter((candidate) => {
      const matchesSearch = !normalizedSearchTerm
        || candidate.name.toLowerCase().includes(normalizedSearchTerm)
        || candidate.email.toLowerCase().includes(normalizedSearchTerm)
      const matchesJob = jobFilter === 'all' || String(candidate.job_id) === jobFilter
      const matchesStage = stageFilter === 'all' || candidate.stage === stageFilter

      return matchesSearch && matchesJob && matchesStage
    })
    .sort((firstCandidate, secondCandidate) => {
      if (sortBy === 'oldest') {
        return new Date(firstCandidate.created_at) - new Date(secondCandidate.created_at)
      }

      if (sortBy === 'name') {
        return firstCandidate.name.localeCompare(secondCandidate.name)
      }

      if (sortBy === 'stage') {
        return candidateStages.indexOf(firstCandidate.stage)
          - candidateStages.indexOf(secondCandidate.stage)
      }

      return new Date(secondCandidate.created_at) - new Date(firstCandidate.created_at)
    })

  function openAddCandidate() {
    setCandidateForForm(null)
    setCandidateModalError('')
    setIsCandidateModalOpen(true)
  }

  function openEditCandidate(candidate) {
    setActiveCandidate(null)
    setCandidateForForm(candidate)
    setCandidateModalError('')
    setIsCandidateModalOpen(true)
  }

  function openCandidateDetails(candidate) {
    setDrawerError('')
    setActiveCandidate(candidate)
  }

  function closeCandidateDetails() {
    if (isSaving) return
    setActiveCandidate(null)
    setDrawerError('')
  }

  function closeCandidateModal() {
    if (isSaving) return
    setIsCandidateModalOpen(false)
    setCandidateForForm(null)
    setCandidateModalError('')
  }

  async function handleSaveCandidate(formData) {
    setIsSaving(true)
    setCandidateModalError('')

    const candidateData = {
      name: formData.name,
      email: formData.email,
      experience_level: formData.experience_level,
      stage: formData.stage,
      notes: formData.notes,
    }

    try {
      if (candidateForForm) {
        const updatedCandidate = await updateCandidate(
          token,
          candidateForForm.id,
          candidateData,
        )
        setCandidates((currentCandidates) => currentCandidates.map((candidate) => (
          candidate.id === updatedCandidate.id ? updatedCandidate : candidate
        )))
        showToast(`${updatedCandidate.name}'s profile was updated.`)
      } else {
        const newCandidate = await createCandidate(token, formData.job_id, candidateData)
        setCandidates((currentCandidates) => [newCandidate, ...currentCandidates])
        showToast(`${newCandidate.name} was added.`)
      }

      setIsCandidateModalOpen(false)
      setCandidateForForm(null)
    } catch (requestError) {
      setCandidateModalError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveDrawer(changes) {
    setIsSaving(true)
    setDrawerError('')

    try {
      const updatedCandidate = await updateCandidate(token, activeCandidate.id, changes)
      setCandidates((currentCandidates) => currentCandidates.map((candidate) => (
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      )))
      setActiveCandidate(updatedCandidate)
      showToast(`${updatedCandidate.name}'s stage and notes were saved.`)
    } catch (requestError) {
      setDrawerError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  function openDeleteDialog(candidate) {
    setActiveCandidate(null)
    setDeleteError('')
    setCandidateToDelete(candidate)
  }

  function closeDeleteDialog() {
    if (isDeleting) return
    setCandidateToDelete(null)
    setDeleteError('')
  }

  async function handleDeleteCandidate() {
    setIsDeleting(true)
    setDeleteError('')
    const deletedCandidateName = candidateToDelete.name

    try {
      await deleteCandidate(token, candidateToDelete.id)
      setCandidates((currentCandidates) => currentCandidates.filter(
        (candidate) => candidate.id !== candidateToDelete.id,
      ))
      setCandidateToDelete(null)
      showToast(`${deletedCandidateName} was deleted.`)
    } catch (requestError) {
      setDeleteError(requestError.message)
    } finally {
      setIsDeleting(false)
    }
  }

  function retryLoading() {
    setPageError('')
    setIsLoading(true)
    setReloadCount((currentCount) => currentCount + 1)
  }

  return (
    <div className="flex min-h-screen bg-[#fffdf8] text-zinc-950">
      <DashboardSidebar user={user} onLogout={logout} activePage="candidates" />

      <div className="min-w-0 flex-1">
        <DashboardHeader
          user={user}
          onLogout={logout}
          eyebrow="Candidate directory"
          activePage="candidates"
        />

        <main className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 sm:py-14">
          <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl">Candidates</h1>
              <p className="mt-3 text-base text-zinc-500 sm:text-lg">
                Everyone across your open roles, in one list.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddCandidate}
              disabled={jobs.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-lg leading-none">＋</span> Add candidate
            </button>
          </section>

          <section className="mt-12">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.75fr_0.85fr]">
              <label className="relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name or email"
                  className="w-full rounded-2xl border border-zinc-300 bg-white py-3.5 pl-10 pr-4 text-sm shadow-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
                aria-label="Filter by stage"
                className="rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-sm font-medium capitalize text-zinc-700 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">All stages</option>
                {candidateStages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>

              <select
                value={jobFilter}
                onChange={(event) => setJobFilter(event.target.value)}
                aria-label="Filter by job"
                className="rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-sm font-medium text-zinc-700 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">All jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>

            <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort candidates"
                className="mt-4 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-sm font-medium text-zinc-700 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-64"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
                <option value="stage">Pipeline stage</option>
              </select>
          </section>

          <div className="mb-4 mt-10 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Candidate records</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Showing {visibleCandidates.length} of {candidates.length}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse overflow-hidden rounded-3xl border border-zinc-200 bg-white">
              <div className="h-14 bg-blue-50" />
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-20 border-t border-zinc-100" />
              ))}
            </div>
          ) : pageError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
              <p className="font-semibold text-red-900">Candidates could not be loaded</p>
              <p className="mt-2 text-sm text-red-700">{pageError}</p>
              <button
                type="button"
                onClick={retryLoading}
                className="mt-5 rounded-xl bg-red-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : visibleCandidates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl text-white">◎</span>
              <h3 className="mt-5 text-lg font-semibold">
                {jobs.length === 0
                  ? 'Create a job before adding candidates'
                  : candidates.length === 0 ? 'No candidates yet' : 'No candidates match these filters'}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                {jobs.length === 0
                  ? 'Every candidate must belong to a valid job opening.'
                  : candidates.length === 0
                  ? 'Add your first candidate to begin building the directory.'
                  : 'Try changing your search or filter selections.'}
              </p>
              {jobs.length === 0 && (
                <Link
                  to="/app/jobs"
                  className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  Go to job openings
                </Link>
              )}
            </div>
          ) : (
            <CandidateList
              candidates={visibleCandidates}
              jobTitles={jobTitles}
              onOpen={openCandidateDetails}
            />
          )}
        </main>
      </div>

      {isCandidateModalOpen && (
        <CandidateFormModal
          candidate={candidateForForm}
          jobs={jobs}
          defaultJobId={jobFilter === 'all' ? null : jobFilter}
          isSaving={isSaving}
          error={candidateModalError}
          onClose={closeCandidateModal}
          onSubmit={handleSaveCandidate}
        />
      )}

      {activeCandidate && (
        <CandidateDetailsDrawer
          candidate={activeCandidate}
          jobTitle={jobTitles[activeCandidate.job_id] || 'Unknown job'}
          isSaving={isSaving}
          error={drawerError}
          onClose={closeCandidateDetails}
          onSave={handleSaveDrawer}
          onEdit={() => openEditCandidate(activeCandidate)}
          onDelete={() => openDeleteDialog(activeCandidate)}
        />
      )}

      {candidateToDelete && (
        <ConfirmDialog
          title={`Delete ${candidateToDelete.name}?`}
          message="This permanently removes the candidate and their notes from HireFlow. This action cannot be undone."
          confirmLabel="Delete candidate"
          isWorking={isDeleting}
          error={deleteError}
          onCancel={closeDeleteDialog}
          onConfirm={handleDeleteCandidate}
        />
      )}
    </div>
  )
}

export default CandidatesPage
