import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg
const useDatabaseSsl = process.env.DATABASE_SSL === 'true'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env and update it.')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useDatabaseSsl ? { rejectUnauthorized: false } : undefined,
})

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL connection error:', error)
})

export default pool
