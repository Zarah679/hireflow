import pool from '../src/db.js'
import { createStarterWorkspace, starterCandidates, starterJobs } from '../src/data/starterWorkspace.js'

async function populateEmptyAccounts() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('The populate script cannot run in production.')
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await client.query(
      `SELECT users.id, users.email
       FROM users
       WHERE NOT EXISTS (
         SELECT 1 FROM jobs WHERE jobs.user_id = users.id
       )`,
    )

    for (const user of result.rows) {
      await createStarterWorkspace(client, user.id)
      console.log(`Populated ${user.email}`)
    }

    await client.query('COMMIT')
    console.log(`Populated ${result.rowCount} empty account(s) with ${starterJobs.length} jobs and ${starterCandidates.length} candidates each.`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

try {
  await populateEmptyAccounts()
} catch (error) {
  console.error('Population failed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
