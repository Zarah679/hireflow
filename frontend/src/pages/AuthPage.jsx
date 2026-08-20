import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../hooks/useAuth.js'
import {
  getPasswordValidationError,
  passwordRequirements,
} from '../lib/passwordValidation.js'

function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { token, authNotice, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (token) {
    return <Navigate to="/app" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (isRegister) {
      const passwordError = getPasswordValidationError(formData.password)

      if (passwordError) {
        setError(passwordError)
        return
      }
    }

    setIsSubmitting(true)

    try {
      if (isRegister) {
        await register(formData)
      } else {
        await login({ email: formData.email, password: formData.password })
      }

      const destination = location.state?.from?.pathname || '/app'
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="auth-panel relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col">
        <Logo light />
        <div className="my-auto max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">Your hiring workspace</p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-[-0.04em]">
            Keep every candidate moving in the right direction.
          </h1>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {['Clear stages', 'Shared notes', 'Focused job lists', 'Simple decisions'].map((item) => (
              <div key={item} className="rounded-2xl border border-blue-400/15 bg-white/5 p-4 text-sm text-zinc-300 backdrop-blur-sm">
                <span className="mr-2 text-blue-300">✓</span>{item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-zinc-500">Applicant tracking without unnecessary complexity.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-12 lg:hidden">
            <Logo />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            {isRegister ? 'Get started' : 'Welcome back'}
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
            {isRegister ? 'Create your workspace' : 'Log in to HireFlow'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {isRegister
              ? 'Set up your recruiter account and start organizing your hiring process.'
              : 'Enter your details to return to your hiring workspace.'}
          </p>

          <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
            {!isRegister && authNotice && (
              <p role="status" className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                {authNotice}
              </p>
            )}

            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-700">Full name</span>
                <input
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Recruiter Name"
                  required
                  maxLength="100"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Email address</span>
              <input
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@company.com"
                required
                maxLength="255"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">Password</span>
              <input
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                required
                minLength="8"
                maxLength="128"
                aria-describedby={isRegister ? 'password-requirements' : undefined}
              />

              {isRegister && (
                <ul id="password-requirements" className="mt-3 grid gap-1.5 text-xs sm:grid-cols-2">
                  {passwordRequirements.map((requirement) => {
                    const isMet = requirement.test(formData.password)

                    return (
                      <li
                        key={requirement.label}
                        className={isMet ? 'text-emerald-700' : 'text-zinc-500'}
                      >
                        <span aria-hidden="true" className="mr-1.5">
                          {isMet ? '✓' : '○'}
                        </span>
                        {requirement.label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </label>

            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Please wait…'
                : isRegister ? 'Create workspace' : 'Log in'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-zinc-500">
            {isRegister ? 'Already have an account?' : 'New to HireFlow?'}{' '}
            <Link
              className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4"
              to={isRegister ? '/login' : '/register'}
            >
              {isRegister ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default AuthPage
