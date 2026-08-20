import { apiRequest } from '../lib/api.js'

export async function getDashboardSummary(token) {
  return apiRequest('/api/dashboard', { token })
}
