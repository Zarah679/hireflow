import { useEffect, useState } from 'react'
import { apiRequest, unauthorizedEventName } from '../lib/api.js'
import AuthContext from './AuthContext.js'

const tokenStorageKey = 'hireflow_token'
const userStorageKey = 'hireflow_user'

function getStoredUser() {
  const storedUser = localStorage.getItem(userStorageKey)

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(userStorageKey)
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(tokenStorageKey))
  const [user, setUser] = useState(getStoredUser)
  const [authNotice, setAuthNotice] = useState('')

  useEffect(() => {
    function handleUnauthorizedRequest() {
      localStorage.removeItem(tokenStorageKey)
      localStorage.removeItem(userStorageKey)
      setToken(null)
      setUser(null)
      setAuthNotice('Your session expired. Please log in again.')
    }

    window.addEventListener(unauthorizedEventName, handleUnauthorizedRequest)
    return () => window.removeEventListener(unauthorizedEventName, handleUnauthorizedRequest)
  }, [])

  function saveSession(authData) {
    localStorage.setItem(tokenStorageKey, authData.token)
    localStorage.setItem(userStorageKey, JSON.stringify(authData.user))
    setToken(authData.token)
    setUser(authData.user)
    setAuthNotice('')
  }

  async function register(credentials) {
    setAuthNotice('')
    const authData = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: credentials,
    })
    saveSession(authData)
  }

  async function login(credentials) {
    setAuthNotice('')
    const authData = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })
    saveSession(authData)
  }

  function logout() {
    localStorage.removeItem(tokenStorageKey)
    localStorage.removeItem(userStorageKey)
    setToken(null)
    setUser(null)
    setAuthNotice('')
  }

  return (
    <AuthContext.Provider value={{ token, user, authNotice, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
