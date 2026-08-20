export const unauthorizedEventName = 'hireflow:unauthorized'
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, token } = options
  const headers = {}

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the HireFlow API. Make sure the backend is running.')
  }

  const data = response.status === 204
    ? null
    : await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(unauthorizedEventName))
    }

    throw new Error(
      data?.message
      || (response.status >= 500
        ? 'The HireFlow API is unavailable. Make sure the backend is running.'
        : 'Something went wrong. Please try again.'),
    )
  }

  return data
}
