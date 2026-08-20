import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const jobCandidateRoutes = express.Router({ mergeParams: true })
const candidateRoutes = express.Router()
const validCandidateStages = new Set([
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
])
const allowedCandidateFields = new Set([
  'name',
  'email',
  'experience_level',
  'stage',
  'notes',
])

jobCandidateRoutes.use(requireAuth)
candidateRoutes.use(requireAuth)

function parseId(value) {
  if (!/^\d+$/.test(value)) {
    return null
  }

  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

function validateName(name) {
  if (typeof name !== 'string' || !name.trim()) {
    return 'Name is required'
  }

  if (name.trim().length > 100) {
    return 'Name must be 100 characters or fewer'
  }

  return null
}

function validateEmail(email) {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'A valid email is required'
  }

  if (email.trim().length > 255) {
    return 'Email must be 255 characters or fewer'
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

  if (maximumLength && value.trim().length > maximumLength) {
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

async function recruiterOwnsJob(jobId, userId) {
  const result = await pool.query(
    'SELECT id FROM jobs WHERE id = $1 AND user_id = $2',
    [jobId, userId],
  )

  return Boolean(result.rows[0])
}

// Return every candidate in a job owned by the authenticated recruiter.
jobCandidateRoutes.get('/', async (request, response) => {
  const jobId = parseId(request.params.jobId)

  if (!jobId) {
    return response.status(400).json({ message: 'Job ID must be a positive integer' })
  }

  try {
    if (!(await recruiterOwnsJob(jobId, request.user.id))) {
      return response.status(404).json({ message: 'Job not found' })
    }

    const result = await pool.query(
      `SELECT id, job_id, name, email, experience_level, stage, notes,
              created_at, updated_at
       FROM candidates
       WHERE job_id = $1
       ORDER BY created_at DESC`,
      [jobId],
    )

    response.json({ candidates: result.rows })
  } catch (error) {
    console.error('Fetching candidates failed:', error)
    response.status(500).json({ message: 'Unable to fetch candidates' })
  }
})

// Add a candidate to a job owned by the authenticated recruiter.
jobCandidateRoutes.post('/', async (request, response) => {
  const jobId = parseId(request.params.jobId)

  if (!jobId) {
    return response.status(400).json({ message: 'Job ID must be a positive integer' })
  }

  const {
    name,
    email,
    experience_level: experienceLevel,
    stage = 'applied',
    notes,
  } = request.body || {}
  const nameError = validateName(name)
  const emailError = validateEmail(email)
  const experienceError = validateOptionalText(experienceLevel, 'Experience level', 50)
  const notesError = validateOptionalText(notes, 'Notes')

  if (nameError || emailError || experienceError || notesError) {
    return response.status(400).json({
      message: nameError || emailError || experienceError || notesError,
    })
  }

  if (!validCandidateStages.has(stage)) {
    return response.status(400).json({ message: 'Invalid candidate stage' })
  }

  try {
    if (!(await recruiterOwnsJob(jobId, request.user.id))) {
      return response.status(404).json({ message: 'Job not found' })
    }

    const result = await pool.query(
      `INSERT INTO candidates (job_id, name, email, experience_level, stage, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, job_id, name, email, experience_level, stage, notes,
                 created_at, updated_at`,
      [
        jobId,
        name.trim(),
        email.trim().toLowerCase(),
        normalizeOptionalText(experienceLevel),
        stage,
        normalizeOptionalText(notes),
      ],
    )

    response.status(201).json({ candidate: result.rows[0] })
  } catch (error) {
    console.error('Creating candidate failed:', error)
    response.status(500).json({ message: 'Unable to create candidate' })
  }
})

// Return one candidate only when its job belongs to the authenticated recruiter.
candidateRoutes.get('/:id', async (request, response) => {
  const candidateId = parseId(request.params.id)

  if (!candidateId) {
    return response.status(400).json({ message: 'Candidate ID must be a positive integer' })
  }

  try {
    const result = await pool.query(
      `SELECT candidates.id, candidates.job_id, candidates.name, candidates.email,
              candidates.experience_level, candidates.stage, candidates.notes,
              candidates.created_at, candidates.updated_at
       FROM candidates
       JOIN jobs ON jobs.id = candidates.job_id
       WHERE candidates.id = $1 AND jobs.user_id = $2`,
      [candidateId, request.user.id],
    )

    if (!result.rows[0]) {
      return response.status(404).json({ message: 'Candidate not found' })
    }

    response.json({ candidate: result.rows[0] })
  } catch (error) {
    console.error('Fetching candidate failed:', error)
    response.status(500).json({ message: 'Unable to fetch candidate' })
  }
})

// Update supplied fields on a candidate owned through the recruiter's job.
candidateRoutes.patch('/:id', async (request, response) => {
  const candidateId = parseId(request.params.id)

  if (!candidateId) {
    return response.status(400).json({ message: 'Candidate ID must be a positive integer' })
  }

  const updates = request.body || {}
  const updateFields = Object.keys(updates)
  const unexpectedField = updateFields.find((field) => !allowedCandidateFields.has(field))

  if (unexpectedField) {
    return response.status(400).json({ message: `${unexpectedField} cannot be updated` })
  }

  if (updateFields.length === 0) {
    return response.status(400).json({ message: 'Provide at least one field to update' })
  }

  if (updates.name !== undefined) {
    const nameError = validateName(updates.name)
    if (nameError) return response.status(400).json({ message: nameError })
  }

  if (updates.email !== undefined) {
    const emailError = validateEmail(updates.email)
    if (emailError) return response.status(400).json({ message: emailError })
  }

  const experienceError = validateOptionalText(
    updates.experience_level,
    'Experience level',
    50,
  )
  const notesError = validateOptionalText(updates.notes, 'Notes')

  if (experienceError || notesError) {
    return response.status(400).json({ message: experienceError || notesError })
  }

  if (updates.stage !== undefined && !validCandidateStages.has(updates.stage)) {
    return response.status(400).json({ message: 'Invalid candidate stage' })
  }

  const setClauses = []
  const queryValues = []

  if (updates.name !== undefined) {
    queryValues.push(updates.name.trim())
    setClauses.push(`name = $${queryValues.length}`)
  }

  if (updates.email !== undefined) {
    queryValues.push(updates.email.trim().toLowerCase())
    setClauses.push(`email = $${queryValues.length}`)
  }

  if (updates.experience_level !== undefined) {
    queryValues.push(normalizeOptionalText(updates.experience_level))
    setClauses.push(`experience_level = $${queryValues.length}`)
  }

  if (updates.stage !== undefined) {
    queryValues.push(updates.stage)
    setClauses.push(`stage = $${queryValues.length}`)
  }

  if (updates.notes !== undefined) {
    queryValues.push(normalizeOptionalText(updates.notes))
    setClauses.push(`notes = $${queryValues.length}`)
  }

  queryValues.push(candidateId)
  const candidateIdPosition = queryValues.length
  queryValues.push(request.user.id)
  const userIdPosition = queryValues.length

  try {
    const result = await pool.query(
      `UPDATE candidates
       SET ${setClauses.join(', ')}
       FROM jobs
       WHERE candidates.id = $${candidateIdPosition}
         AND jobs.id = candidates.job_id
         AND jobs.user_id = $${userIdPosition}
       RETURNING candidates.id, candidates.job_id, candidates.name, candidates.email,
                 candidates.experience_level, candidates.stage, candidates.notes,
                 candidates.created_at, candidates.updated_at`,
      queryValues,
    )

    if (!result.rows[0]) {
      return response.status(404).json({ message: 'Candidate not found' })
    }

    response.json({ candidate: result.rows[0] })
  } catch (error) {
    console.error('Updating candidate failed:', error)
    response.status(500).json({ message: 'Unable to update candidate' })
  }
})

// Delete a candidate only when its job belongs to the authenticated recruiter.
candidateRoutes.delete('/:id', async (request, response) => {
  const candidateId = parseId(request.params.id)

  if (!candidateId) {
    return response.status(400).json({ message: 'Candidate ID must be a positive integer' })
  }

  try {
    const result = await pool.query(
      `DELETE FROM candidates
       USING jobs
       WHERE candidates.id = $1
         AND jobs.id = candidates.job_id
         AND jobs.user_id = $2
       RETURNING candidates.id`,
      [candidateId, request.user.id],
    )

    if (!result.rows[0]) {
      return response.status(404).json({ message: 'Candidate not found' })
    }

    response.status(204).send()
  } catch (error) {
    console.error('Deleting candidate failed:', error)
    response.status(500).json({ message: 'Unable to delete candidate' })
  }
})

export { candidateRoutes, jobCandidateRoutes }
