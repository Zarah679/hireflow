import { useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.jsx'
import JobFormModal from '../components/jobs/JobFormModal.jsx'
import JobOpeningCard from '../components/jobs/JobOpeningCard.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { getCandidatesForJob } from '../services/candidateService.js'
import { createJob, deleteJob, getJobs, updateJob } from '../services/jobService.js'

async function fetchJobOpenings(token) {
  const jobs = await getJobs(token)
  const candidateLists = await Promise.all(
    jobs.map((job) => getCandidatesForJob(token, job.id)),
  )
  const candidateCounts = {}

  jobs.forEach((job, index) => {
    candidateCounts[job.id] = candidateLists[index].length
  })

  return { jobs, candidateCounts }
}

function JobsPage() {
  const { token, user, logout } = useAuth()
  const { showToast } = useToast()
  const [jobs, setJobs] = useState([])
  const [candidateCounts, setCandidateCounts] = useState({})
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jobForForm, setJobForForm] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [modalError, setModalError] = useState('')
  const [updatingJobId, setUpdatingJobId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [jobToDelete, setJobToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let requestWasCancelled = false

    fetchJobOpenings(token)
      .then((pageData) => {
        if (requestWasCancelled) return
        setJobs(pageData.jobs)
        setCandidateCounts(pageData.candidateCounts)
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

  const filteredJobs = statusFilter === 'all'
    ? jobs
    : jobs.filter((job) => job.status === statusFilter)

  function openCreateModal() {
    setJobForForm(null)
    setModalError('')
    setIsModalOpen(true)
  }

  function openEditModal(job) {
    setJobForForm(job)
    setModalError('')
    setIsModalOpen(true)
  }

  function closeJobModal() {
    if (isSaving) return
    setIsModalOpen(false)
    setJobForForm(null)
    setModalError('')
  }

  async function handleSaveJob(formData) {
    setIsSaving(true)
    setModalError('')

    try {
      if (jobForForm) {
        const updatedJob = await updateJob(token, jobForForm.id, formData)
        setJobs((currentJobs) => currentJobs.map((job) => (
          job.id === updatedJob.id ? updatedJob : job
        )))
        showToast(`${updatedJob.title} was updated.`)
      } else {
        const newJob = await createJob(token, formData)
        setJobs((currentJobs) => [newJob, ...currentJobs])
        setCandidateCounts((currentCounts) => ({ ...currentCounts, [newJob.id]: 0 }))
        showToast(`${newJob.title} was created.`)
      }

      setIsModalOpen(false)
      setJobForForm(null)
      return true
    } catch (requestError) {
      setModalError(requestError.message)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  async function handleToggleStatus(job) {
    setUpdatingJobId(job.id)
    setActionError('')

    try {
      const updatedJob = await updateJob(token, job.id, {
        status: job.status === 'open' ? 'closed' : 'open',
      })
      setJobs((currentJobs) => currentJobs.map((currentJob) => (
        currentJob.id === updatedJob.id ? updatedJob : currentJob
      )))
      showToast(`${updatedJob.title} is now ${updatedJob.status}.`)
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setUpdatingJobId(null)
    }
  }

  function openDeleteDialog(job) {
    setDeleteError('')
    setJobToDelete(job)
  }

  function closeDeleteDialog() {
    if (isDeleting) return
    setJobToDelete(null)
    setDeleteError('')
  }

  async function handleDeleteJob() {
    setIsDeleting(true)
    setDeleteError('')
    const deletedJobTitle = jobToDelete.title

    try {
      await deleteJob(token, jobToDelete.id)
      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobToDelete.id))
      setCandidateCounts((currentCounts) => {
        const nextCounts = { ...currentCounts }
        delete nextCounts[jobToDelete.id]
        return nextCounts
      })
      setJobToDelete(null)
      showToast(`${deletedJobTitle} was deleted.`)
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
    <div className="dashboard-canvas flex min-h-screen bg-zinc-50 text-zinc-950">
      <DashboardSidebar user={user} onLogout={logout} activePage="jobs" />

      <div className="min-w-0 flex-1">
        <DashboardHeader
          user={user}
          onLogout={logout}
          eyebrow="Job management"
          activePage="jobs"
        />

        <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10">
          <section className="dashboard-hero relative overflow-hidden rounded-3xl px-6 py-8 text-white sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute right-20 top-16 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Your openings</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  Job openings
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                  Create roles, monitor candidate volume, and keep every opening organized.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-xl shadow-indigo-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <span className="text-lg leading-none">＋</span> New job opening
              </button>
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">All openings</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} in your workspace
              </p>
            </div>
            <div className="inline-flex w-fit rounded-xl border border-blue-100 bg-white p-1 shadow-sm">
              {['all', 'open', 'closed'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${
                    statusFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {actionError && (
            <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionError}
            </p>
          )}

          {isLoading ? (
            <div className="mt-6 grid animate-pulse gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-72 rounded-3xl border border-zinc-200 bg-white" />
              ))}
            </div>
          ) : pageError ? (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-8">
              <p className="font-semibold text-red-900">Job openings could not be loaded</p>
              <p className="mt-2 text-sm text-red-700">{pageError}</p>
              <button
                type="button"
                onClick={retryLoading}
                className="mt-5 rounded-xl bg-red-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-blue-200 bg-gradient-to-br from-white to-blue-50/60 px-6 py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl text-white shadow-lg shadow-blue-500/20">＋</span>
              <h3 className="mt-5 text-lg font-semibold">
                {jobs.length === 0 ? 'Create your first job opening' : `No ${statusFilter} jobs`}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                {jobs.length === 0
                  ? 'Add a role to begin building its candidate pipeline.'
                  : 'Choose another status filter to see your other openings.'}
              </p>
              {jobs.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  Create opening
                </button>
              )}
            </div>
          ) : (
            <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Job openings">
              {filteredJobs.map((job) => (
                <JobOpeningCard
                  key={job.id}
                  job={job}
                  candidateCount={candidateCounts[job.id] || 0}
                  isUpdating={updatingJobId === job.id}
                  onEdit={openEditModal}
                  onToggleStatus={handleToggleStatus}
                  onDelete={openDeleteDialog}
                />
              ))}
            </section>
          )}
        </main>
      </div>

      {isModalOpen && (
        <JobFormModal
          job={jobForForm}
          isSaving={isSaving}
          error={modalError}
          onClose={closeJobModal}
          onSubmit={handleSaveJob}
        />
      )}

      {jobToDelete && (
        <ConfirmDialog
          title={`Delete ${jobToDelete.title}?`}
          message={`This permanently removes the job and its ${candidateCounts[jobToDelete.id] || 0} associated candidate record${candidateCounts[jobToDelete.id] === 1 ? '' : 's'}. This action cannot be undone.`}
          confirmLabel="Delete job"
          isWorking={isDeleting}
          error={deleteError}
          onCancel={closeDeleteDialog}
          onConfirm={handleDeleteJob}
        />
      )}
    </div>
  )
}

export default JobsPage
