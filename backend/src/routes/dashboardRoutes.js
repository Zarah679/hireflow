import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()
const candidateStages = [
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
]

router.use(requireAuth)

// Return lightweight recruitment metrics and recent jobs for the authenticated recruiter.
router.get('/', async (request, response) => {
  try {
    const [openJobsResult, stageCountsResult, recentJobsResult] = await Promise.all([
      pool.query(
        `SELECT COUNT(*)::integer AS open_jobs
         FROM jobs
         WHERE user_id = $1 AND status = 'open'`,
        [request.user.id],
      ),
      pool.query(
        `SELECT candidates.stage, COUNT(*)::integer AS count
         FROM candidates
         JOIN jobs ON jobs.id = candidates.job_id
         WHERE jobs.user_id = $1
         GROUP BY candidates.stage`,
        [request.user.id],
      ),
      pool.query(
        `SELECT jobs.id, jobs.title, jobs.department, jobs.location, jobs.status,
                jobs.created_at, jobs.updated_at,
                COUNT(candidates.id)::integer AS candidate_count
         FROM jobs
         LEFT JOIN candidates ON candidates.job_id = jobs.id
         WHERE jobs.user_id = $1
         GROUP BY jobs.id
         ORDER BY jobs.created_at DESC
         LIMIT 5`,
        [request.user.id],
      ),
    ])

    const stageCounts = Object.fromEntries(candidateStages.map((stage) => [stage, 0]))

    stageCountsResult.rows.forEach((row) => {
      stageCounts[row.stage] = row.count
    })

    const totalCandidates = Object.values(stageCounts).reduce(
      (total, stageCount) => total + stageCount,
      0,
    )

    response.json({
      stats: {
        openJobs: openJobsResult.rows[0].open_jobs,
        totalCandidates,
        interviewing: stageCounts.interview,
        hired: stageCounts.hired,
      },
      stageCounts,
      recentJobs: recentJobsResult.rows,
    })
  } catch (error) {
    console.error('Fetching dashboard summary failed:', error)
    response.status(500).json({ message: 'Unable to fetch dashboard summary' })
  }
})

export default router
