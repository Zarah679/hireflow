import bcrypt from 'bcrypt'
import pool from '../src/db.js'
import { createStarterWorkspace, starterCandidates, starterJobs } from '../src/data/starterWorkspace.js'

const demoEmail = 'demo@hireflow.dev'
const demoPassword = 'Demo1234!'

async function seedDatabase() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('The seed script cannot run in production.')
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Recreate only the known demo account so reruns remain predictable.
    await client.query('DELETE FROM users WHERE lower(email) = $1', [demoEmail])

    const passwordHash = await bcrypt.hash(demoPassword, 10)
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ['Ada Recruiter', demoEmail, passwordHash],
    )

    await createStarterWorkspace(client, userResult.rows[0].id)
    await client.query('COMMIT')

    console.log('HireFlow demo data created successfully.')
    console.log(`Demo email: ${demoEmail}`)
    console.log(`Demo password: ${demoPassword}`)
    console.log(`Created ${starterJobs.length} jobs and ${starterCandidates.length} candidates.`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

try {
  await seedDatabase()
} catch (error) {
  console.error('Seeding failed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
