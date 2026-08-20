import { apiRequest } from '../lib/api.js'

export async function getJobs(token) {
  const response = await apiRequest('/api/jobs', { token })
  return response.jobs
}

export async function createJob(token, jobData) {
  const response = await apiRequest('/api/jobs', {
    method: 'POST',
    body: jobData,
    token,
  })

  return response.job
}

export async function updateJob(token, jobId, jobData) {
  const response = await apiRequest(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    body: jobData,
    token,
  })

  return response.job
}

export async function deleteJob(token, jobId) {
  await apiRequest(`/api/jobs/${jobId}`, {
    method: 'DELETE',
    token,
  })
}
