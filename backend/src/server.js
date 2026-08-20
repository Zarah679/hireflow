import app from './app.js'
import pool from './db.js'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Add it to the backend .env file.')
}

const port = process.env.PORT || 5001

const server = app.listen(port, () => {
  console.log(`HireFlow API is running on http://localhost:${port}`)
})

async function shutDown() {
  server.close(async () => {
    await pool.end()
    process.exit(0)
  })
}

process.on('SIGINT', shutDown)
process.on('SIGTERM', shutDown)
