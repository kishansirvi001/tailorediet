import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INDIAN_MOBILE_PATTERN = /^(?:\+91|91)?[6-9]\d{9}$/

const initialFormData = {
  name: '',
  email: '',
  mobileNumber: '',
  dateOfBirth: '',
  password: '',
  goal: 'Weight loss',
  dietStyle: 'Balanced',
}

function normalizeMobileNumber(value) {
  return value.replace(/\s+/g, '')
}

function validateSignupForm(formData) {
  if (!formData.name.trim()) {
    return 'Full name is required.'
  }

  if (!formData.email.trim()) {
    return 'Email is required.'
  }

  if (!EMAIL_PATTERN.test(formData.email.trim().toLowerCase())) {
    return 'Enter a valid email address.'
  }

  if (!formData.mobileNumber.trim()) {
    return 'Mobile number is required.'
  }

  if (!INDIAN_MOBILE_PATTERN.test(normalizeMobileNumber(formData.mobileNumber.trim()))) {
    return 'Enter a valid Indian mobile number.'
  }

  if (!formData.dateOfBirth) {
    return 'Date of birth is required.'
  }

  if (Number.isNaN(new Date(formData.dateOfBirth).getTime()) || new Date(formData.dateOfBirth) > new Date()) {
    return 'Enter a valid date of birth.'
  }

  if (formData.password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }

  return ''
}

function SignupPage() {
  const { isAuthenticated, signup } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/account" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationMessage = validateSignupForm(formData)

    if (validationMessage) {
      setErrorMessage(validationMessage)
      setSuccessMessage('')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await signup(formData)
      setSuccessMessage('Your account is ready. Redirecting to your dashboard...')
      navigate('/account', { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-24">
        <div className="overflow-hidden rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,252,244,0.96),rgba(244,236,220,0.9))] p-6 shadow-[0_30px_70px_rgba(120,53,15,0.08)] backdrop-blur sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800/70">
            Join TailorDiet
          </p>
          <h1 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Build your nutrition profile in one smooth step.
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
            We removed the OTP step, so signup is now faster while still collecting the core details your dashboard needs.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                What you add
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Name, email, mobile number, date of birth, goal, and diet preference.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-emerald-200/70 bg-emerald-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Why it helps
              </p>
              <p className="mt-3 text-sm leading-6 text-emerald-900">
                Your profile is ready immediately for calculators, planning tools, and saved preferences.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm leading-7 text-stone-600">
            <p>The mobile number stays in the form, but there is no mobile OTP flow anymore.</p>
            <p>Date of birth is now included to make the profile more complete for future personalization.</p>
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-amber-800 transition hover:text-amber-900">
                Log in here
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(251,248,240,0.9))] p-6 shadow-[0_35px_80px_rgba(28,25,23,0.1)] backdrop-blur sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Sign up
          </p>
          <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Start your plan with a cleaner profile form.
          </h2>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Full name
                </span>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Kishan Sirvi"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Mobile number
                </span>
                <input
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="9876543210"
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Date of birth
                </span>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 focus:border-amber-400 focus:outline-none"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Password
              </span>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Goal
                </span>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 focus:border-amber-400 focus:outline-none"
                >
                  <option>Weight loss</option>
                  <option>Muscle gain</option>
                  <option>Maintain weight</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Diet style
                </span>
                <select
                  name="dietStyle"
                  value={formData.dietStyle}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 focus:border-amber-400 focus:outline-none"
                >
                  <option>Balanced</option>
                  <option>Vegan</option>
                  <option>Keto</option>
                </select>
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-amber-200/70 bg-amber-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800/80">
                Quick note
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Use a valid email and Indian mobile number. Your date of birth is stored with the account for future profile and planning features.
              </p>
            </div>

            {successMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {successMessage}
              </div>
            ) : null}
            {errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(249,115,22,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </section>
    </SiteShell>
  )
}

export default SignupPage
