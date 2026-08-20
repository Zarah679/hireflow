import express from 'express'
import pool from './db.js'
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import { candidateRoutes, jobCandidateRoutes } from './routes/candidateRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

const app = express()
const allowedFrontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '')

app.use((request, response, next) => {
  const requestOrigin = request.headers.origin
  const isAllowedOrigin = requestOrigin && requestOrigin === allowedFrontendUrl

  if (isAllowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', requestOrigin)
    response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    response.setHeader('Vary', 'Origin')
  }

  if (request.method === 'OPTIONS') {
    return isAllowedOrigin
      ? response.sendStatus(204)
      : response.status(403).json({ message: 'Origin is not allowed' })
  }

  next()
})

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/jobs/:jobId/candidates', jobCandidateRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/candidates', candidateRoutes)

// Confirm that the API can connect to PostgreSQL.
app.get('/api/health', async (request, response) => {
  try {
    await pool.query('SELECT 1')

    response.json({
      status: 'ok',
      database: 'connected',
    })
  } catch (error) {
    console.error('Database health check failed:', error.message)

    response.status(503).json({
      status: 'error',
      database: 'disconnected',
    })
  }
})

app.use((request, response) => {
  response.status(404).json({ message: 'Route not found' })
})

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ message: 'Request body contains invalid JSON' })
  }

  console.error('Unhandled request error:', error)
  response.status(500).json({ message: 'Internal server error' })
})

export default app
