import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()
const validJobStatuses = new Set(['open', 'closed'])
const allowedJobFields = new Set(['title', 'department', 'location', 'status'])

router.use(requireAuth)

function parseJobId(value) {
  if (!/^\d+$/.test(value)) {
    return null
  }

  const jobId = Number(value)
  return Number.isSafeInteger(jobId) && jobId > 0 ? jobId : null
}

function validateTitle(title) {
  if (typeof title !== 'string' || !title.trim()) {
    return 'Title is required'
  }

  if (title.trim().length > 150) {
    return 'Title must be 150 characters or fewer'
  }

  return null
}

function validateOptionalText(value, fieldName, maximumLength) {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value !== 'string') {
    return `${fieldName} must be text`
  }

  if (value.trim().length > maximumLength) {
    return `${fieldName} must be ${maximumLength} characters or fewer`
  }

  return null
}

function normalizeOptionalText(value) {
  if (value === undefined || value === null || !value.trim()) {
    return null
  }

  return value.trim()
}

// Return every job owned by the authenticated recruiter.
router.get('/', async (request, response) => {
  try {
    const result = await pool.query(
      `SELECT id, title, department, location, status, created_at, updated_at
       FROM jobs
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [request.user.id],
    )

    response.json({ jobs: result.rows })
  } catch (error) {
    console.error('Fetching jobs failed:', error)
    response.status(500).json({ message: 'Unable to fetch jobs' })
  }
})

// Create a new job owned by the authenticated recruiter.
router.post('/', async (request, response) => {
  const { title, department, location, status = 'open' } = request.body || {}
  const titleError = validateTitle(title)
  const departmentError = validateOptionalText(department, 'Department', 100)
  const locationError = validateOptionalText(location, 'Location', 150)

  if (titleError || departmentError || locationError) {
    return response.status(400).json({
      message: titleError || departmentError || locationError,
    })
  }

  if (!validJobStatuses.has(status)) {
    return response.status(400).json({ message: 'Status must be open or closed' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO jobs (user_id, title, department, location, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, department, location, status, created_at, updated_at`,
      [
        request.user.id,
        title.trim(),
        normalizeOptionalText(department),
        normalizeOptionalText(location),
        status,
      ],
    )

    response.status(201).json({ job: result.rows[0] })
  } catch (error) {
    console.error('Creating job failed:', error)
    response.status(500).json({ message: 'Unable to create job' })
  }
})

// Return one job only when it belongs to the authenticated recruiter.
router.get('/:id', async (request, response) => {
  const jobId = parseJobId(request.params.id)

  if (!jobId) {
    return response.status(400).json({ message: 'Job ID must be a positive integer' })
  }

  try {
    const result = await pool.query(
      `SELECT id, title, department, location, status, created_at, updated_at
       FROM jobs
       WHERE id = $1 AND user_id = $2`,
      [jobId, request.user.id],
    )

    if (!result.rows[0]) {
      return response.status(404).json({ message: 'Job not found' })
    }

    response.json({ job: result.rows[0] })
  } catch (error) {
    console.error('Fetching job failed:', error)
    response.status(500).json({ message: 'Unable to fetch job' })
  }
})

// Update only the supplied fields on a job owned by the authenticated recruiter.
router.patch('/:id', async (request, response) => {
  const jobId = parseJobId(request.params.id)

  if (!jobId) {
    return response.status(400).json({ message: 'Job ID must be a positive integer' })
  }

  const updates = request.body || {}
  const updateFields = Object.keys(updates)
  const unexpectedField = updateFields.find((field) => !allowedJobFields.has(field))

  if (unexpectedField) {
    return response.status(400).json({ message: `${unexpectedField} cannot be updated` })
  }

  if (updateFields.length === 0) {
    return response.status(400).json({ message: 'Provide at least one field to update' })
  }

  if (updates.title !== undefined) {
    const titleError = validateTitle(updates.title)
    if (titleError) return response.status(400).json({ message: titleError })
  }

  const departmentError = validateOptionalText(updates.department, 'Department', 100)
  const locationError = validateOptionalText(updates.location, 'Location', 150)

  if (departmentError || locationError) {
    return response.status(400).json({ message: departmentError || locationError })
  }

  if (updates.status !== undefined && !validJobStatuses.has(updates.status)) {
    return response.status(400).json({ message: 'Status must be open or closed' })
  }

  const setClauses = []
  const queryValues = []

  if (updates.title !== undefined) {
    queryValues.push(updates.title.trim())
    setClauses.push(`title = $${queryValues.length}`)
  }

  if (updates.department !== undefined) {
    queryValues.push(normalizeOptionalText(updates.department))
    setClauses.push(`department = $${queryValues.length}`)
  }

  if (updates.location !== undefined) {
    queryValues.push(normalizeOptionalText(updates.location))
    setClauses.push(`location = $${queryValues.length}`)
  }

  if (updates.status !== undefined) {
    queryValues.push(updates.status)
    setClauses.push(`status = $${queryValues.length}`)
  }

  queryValues.push(jobId)
  const jobIdPosition = queryValues.length
  queryValues.push(request.user.id)
  const userIdPosition = queryValues.length

  try {
    const result = await pool.query(
      `UPDATE jobs
       SET ${setClauses.join(', ')}
       WHERE id = $${jobIdPosition} AND user_id = $${userIdPosition}
       RETURNING id, title, department, location, status, created_at, updated_at`,
      queryValues,
    )

    if (!result.rows[0]) {
      return response.status(404).json({ message: 'Job not found' })
    }

    response.json({ job: result.rows[0] })
  } catch (error) {
    console.error('Updating job failed:', error)
    response.status(500).json({ message: 'Unable to update job' })
  }
})

// Delete a job only when it belongs to the authenticated recruiter.
router.delete('/:id', async (request, response) => {
  const jobId = parseJobId(request.params.id)

  if (!jobId) {
    return response.status(400).json({ message: 'Job ID must be a positive integer' })
  }

  try {
    const result = await pool.query(
      `DELETE FROM jobs
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [jobId, request.user.id],
    )

    if (!result.rows[0]) {
      return response.status(404).json({ message: 'Job not found' })
    }

    response.status(204).send()
  } catch (error) {
    console.error('Deleting job failed:', error)
    response.status(500).json({ message: 'Unable to delete job' })
  }
})

export default router
