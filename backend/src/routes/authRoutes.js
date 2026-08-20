import express from 'express'
import bcrypt from 'bcrypt'
import pool from '../db.js'
import { createAuthToken } from '../auth/createAuthToken.js'
import { createStarterWorkspace } from '../data/starterWorkspace.js'

const router = express.Router()
const passwordHashRounds = 10

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password) {
  if (typeof password !== 'string') return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (password.length > 128) return 'Password must be 128 characters or fewer'
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter'
  if (!/\d/.test(password)) return 'Password must contain a number'
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must contain a special character'
  }

  return null
}

// Create a recruiter account and return a JWT for authenticated requests.
router.post('/register', async (request, response) => {
  const { name, email, password } = request.body || {}

  if (typeof name !== 'string' || !name.trim()) {
    return response.status(400).json({ message: 'Name is required' })
  }

  if (name.trim().length > 100) {
    return response.status(400).json({ message: 'Name must be 100 characters or fewer' })
  }

  if (typeof email !== 'string' || !validateEmail(email.trim())) {
    return response.status(400).json({ message: 'A valid email is required' })
  }

  if (email.trim().length > 255) {
    return response.status(400).json({ message: 'Email must be 255 characters or fewer' })
  }

  const passwordError = validatePassword(password)

  if (passwordError) {
    return response.status(400).json({ message: passwordError })
  }

  const client = await pool.connect()

  try {
    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = await bcrypt.hash(password, passwordHashRounds)
    await client.query('BEGIN')

    const result = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), normalizedEmail, passwordHash],
    )
    const user = result.rows[0]

    // Starter records make a new local workspace useful immediately.
    // Production accounts should begin empty and contain only real hiring data.
    if (process.env.NODE_ENV !== 'production') {
      await createStarterWorkspace(client, user.id)
    }

    await client.query('COMMIT')

    const token = createAuthToken(user.id)

    response.status(201).json({ token, user })
  } catch (error) {
    await client.query('ROLLBACK')

    if (error.code === '23505') {
      return response.status(409).json({ message: 'An account with this email already exists' })
    }

    console.error('Registration failed:', error)
    response.status(500).json({ message: 'Unable to create account' })
  } finally {
    client.release()
  }
})

// Verify a recruiter's credentials and return a new JWT.
router.post('/login', async (request, response) => {
  const { email, password } = request.body || {}

  if (typeof email !== 'string' || typeof password !== 'string') {
    return response.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const normalizedEmail = email.trim().toLowerCase()
    const result = await pool.query(
      `SELECT id, name, email, password_hash, created_at
       FROM users
       WHERE lower(email) = $1`,
      [normalizedEmail],
    )
    const user = result.rows[0]

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return response.status(401).json({ message: 'Invalid email or password' })
    }

    const token = createAuthToken(user.id)
    const { password_hash: passwordHash, ...safeUser } = user

    response.json({ token, user: safeUser })
  } catch (error) {
    console.error('Login failed:', error)
    response.status(500).json({ message: 'Unable to log in' })
  }
})

export default router
