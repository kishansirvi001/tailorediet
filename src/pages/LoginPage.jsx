import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INDIAN_MOBILE_PATTERN = /^(?:\+91|91)?[6-9]\d{9}$/

function normalizeMobileNumber(value) {
  return value.replace(/\s+/g, '')
}

function validateLoginForm(formData) {
  const identifier = formData.identifier.trim()

  if (!identifier) {
    return 'Email or mobile number is required.'
  }

  if (identifier.includes('@')) {
    if (!EMAIL_PATTERN.test(identifier.toLowerCase())) {
      return 'Enter a valid email address.'
    }
  } else if (!INDIAN_MOBILE_PATTERN.test(normalizeMobileNumber(identifier))) {
    return 'Enter a valid Indian mobile number.'
  }

  if (!formData.password) {
    return 'Password is required.'
  }

  return ''
}

function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = location.state?.from || '/account'

  if (isAuthenticated) {
    return <Navigate to="/account" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationMessage = validateLoginForm(formData)

    if (validationMessage) {
      setErrorMessage(validationMessage)
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login(formData)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-24">
        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(245,239,226,0.92))] p-8 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Welcome back
          </p>
          <h1 className="mt-4 font-['Georgia'] text-5xl font-bold tracking-tight text-stone-950">
            Step back into your dashboard and continue the plan you started.
          </h1>
          <p className="mt-6 text-lg leading-8 text-stone-700">
            Returning users can jump straight into their saved nutrition profile,
            planning tools, and next action without rebuilding everything from scratch.
          </p>
          <div className="mt-8 space-y-4 text-sm leading-7 text-stone-600">
            <p>Login now checks your credentials against the backend API and restores your saved session.</p>
            <p>Your account then unlocks a protected dashboard route for profile details and future planner data.</p>
            <p>
              New to TailorDiet?{' '}
              <Link to="/signup" className="font-semibold text-stone-950">
                Create an account
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-white/80 p-8 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Login
          </p>
          <h2 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950">
            Log in to your planner.
          </h2>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              name="identifier"
              type="text"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Email or mobile number"
              autoComplete="username"
              className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-stone-600 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-stone-600 focus:outline-none"
            />
            <div className="rounded-[1.5rem] border border-stone-900/10 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                After login
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Resume calorie targets, saved preferences, and your latest health planning choices from one dashboard.
              </p>
            </div>
            <p className="text-xs leading-6 text-stone-500">
              Sign in with `name@example.com`, `9876543210`, or `+91 9876543210`.
            </p>
            {errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-stone-900 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-amber-100 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </section>
    </SiteShell>
  )
}

export default LoginPage
