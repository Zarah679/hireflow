import { apiRequest } from '../lib/api.js'

export async function getCandidatesForJob(token, jobId) {
  const response = await apiRequest(`/api/jobs/${jobId}/candidates`, { token })
  return response.candidates
}

export async function createCandidate(token, jobId, candidateData) {
  const response = await apiRequest(`/api/jobs/${jobId}/candidates`, {
    method: 'POST',
    body: candidateData,
    token,
  })

  return response.candidate
}

export async function updateCandidate(token, candidateId, candidateData) {
  const response = await apiRequest(`/api/candidates/${candidateId}`, {
    method: 'PATCH',
    body: candidateData,
    token,
  })

  return response.candidate
}

export async function deleteCandidate(token, candidateId) {
  await apiRequest(`/api/candidates/${candidateId}`, {
    method: 'DELETE',
    token,
  })
}
