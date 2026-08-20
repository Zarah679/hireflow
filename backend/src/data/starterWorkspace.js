export const starterJobs = [
  { title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Lagos · Hybrid', status: 'open' },
  { title: 'Product Designer', department: 'Design', location: 'Remote', status: 'open' },
  { title: 'Customer Support Specialist', department: 'Customer Experience', location: 'Abuja · On-site', status: 'open' },
  { title: 'Data Analyst', department: 'Operations', location: 'Remote', status: 'closed' },
]

export const starterCandidates = [
  { jobIndex: 0, name: 'Chiamaka Okafor', email: 'chiamaka.okafor@example.com', experience: 'senior', stage: 'applied', notes: 'Strong React portfolio and product experience.' },
  { jobIndex: 1, name: 'Tunde Adebayo', email: 'tunde.adebayo@example.com', experience: 'mid-level', stage: 'applied', notes: 'Portfolio includes thoughtful design systems work.' },
  { jobIndex: 2, name: 'Emeka Nwankwo', email: 'emeka.nwankwo@example.com', experience: 'entry-level', stage: 'applied', notes: null },
  { jobIndex: 0, name: 'Amina Bello', email: 'amina.bello@example.com', experience: 'senior', stage: 'screening', notes: 'Screening call scheduled for Thursday.' },
  { jobIndex: 1, name: 'Temilade Balogun', email: 'temilade.balogun@example.com', experience: 'mid-level', stage: 'screening', notes: 'Good research process and clear case studies.' },
  { jobIndex: 2, name: 'Yetunde Bakare', email: 'yetunde.bakare@example.com', experience: 'mid-level', stage: 'screening', notes: 'Four years of customer support experience.' },
  { jobIndex: 0, name: 'Chinedu Eze', email: 'chinedu.eze@example.com', experience: 'senior', stage: 'interview', notes: 'Technical interview feedback was positive.' },
  { jobIndex: 1, name: 'Femi Ogunleye', email: 'femi.ogunleye@example.com', experience: 'senior', stage: 'interview', notes: 'Panel interview booked for next week.' },
  { jobIndex: 2, name: 'Ibrahim Yusuf', email: 'ibrahim.yusuf@example.com', experience: 'mid-level', stage: 'interview', notes: 'Excellent communication during screening.' },
  { jobIndex: 0, name: 'Amara Okafor', email: 'amara.okafor@example.com', experience: 'senior', stage: 'offer', notes: 'Offer prepared and awaiting final approval.' },
  { jobIndex: 2, name: 'Zainab Musa', email: 'zainab.musa@example.com', experience: 'mid-level', stage: 'offer', notes: 'References completed successfully.' },
  { jobIndex: 1, name: 'Ngozi Umeh', email: 'ngozi.umeh@example.com', experience: 'lead', stage: 'hired', notes: 'Accepted the offer. Start date confirmed.' },
  { jobIndex: 3, name: 'Eniola Adeyemi', email: 'eniola.adeyemi@example.com', experience: 'senior', stage: 'hired', notes: 'Joined the operations team this month.' },
  { jobIndex: 0, name: 'Seyi Ajayi', email: 'seyi.ajayi@example.com', experience: 'mid-level', stage: 'rejected', notes: 'Role required deeper accessibility experience.' },
  { jobIndex: 2, name: 'Victor Nwosu', email: 'victor.nwosu@example.com', experience: 'entry-level', stage: 'rejected', notes: 'Not enough experience for the current opening.' },
  { jobIndex: 3, name: 'David Etim', email: 'david.etim@example.com', experience: 'mid-level', stage: 'rejected', notes: 'Position was filled by another candidate.' },
]

export async function createStarterWorkspace(client, userId) {
  const createdJobs = []

  for (const job of starterJobs) {
    const jobResult = await client.query(
      `INSERT INTO jobs (user_id, title, department, location, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [userId, job.title, job.department, job.location, job.status],
    )
    createdJobs.push(jobResult.rows[0])
  }

  for (const candidate of starterCandidates) {
    await client.query(
      `INSERT INTO candidates (job_id, name, email, experience_level, stage, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [createdJobs[candidate.jobIndex].id, candidate.name, candidate.email, candidate.experience, candidate.stage, candidate.notes],
    )
  }
}
