import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INDIAN_MOBILE_PATTERN = /^(?:\+91|91)?[6-9]\d{9}$/

const initialFormData = {
  name: '',
  email: '',
  mobileNumber: '',
  password: '',
  goal: 'Weight loss',
  dietStyle: 'Balanced',
}

const initialOtpData = {
  emailOtp: '',
  mobileOtp: '',
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

  if (formData.password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }

  return ''
}

function validateOtpForm(otpData) {
  if (!/^\d{6}$/.test(otpData.emailOtp.trim())) {
    return 'Enter the 6-digit email OTP.'
  }

  if (!/^\d{6}$/.test(otpData.mobileOtp.trim())) {
    return 'Enter the 6-digit mobile OTP.'
  }

  return ''
}

function SignupPage() {
  const { isAuthenticated, beginSignupVerification, completeSignupVerification } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [otpData, setOtpData] = useState(initialOtpData)
  const [verification, setVerification] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const expiresAtLabel = useMemo(() => {
    if (!verification?.expiresAt) {
      return ''
    }

    return new Date(verification.expiresAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [verification])

  if (isAuthenticated) {
    return <Navigate to="/account" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleOtpChange(event) {
    const { name, value } = event.target
    setOtpData((current) => ({ ...current, [name]: value.replace(/\D/g, '').slice(0, 6) }))
  }

  async function handleRequestOtp(event) {
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
      const nextVerification = await beginSignupVerification(formData)
      setVerification(nextVerification)
      setOtpData(initialOtpData)
      setSuccessMessage('Email and mobile OTPs sent. Enter both codes below to finish signup.')
    } catch (error) {
      setVerification(null)
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault()
    const validationMessage = validateOtpForm(otpData)

    if (validationMessage) {
      setErrorMessage(validationMessage)
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await completeSignupVerification({
        verificationId: verification.verificationId,
        emailOtp: otpData.emailOtp,
        mobileOtp: otpData.mobileOtp,
      })
      navigate('/account', { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-24">
        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(245,239,226,0.92))] p-6 shadow-sm backdrop-blur sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Join TailorDiet
          </p>
          <h1 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Create an account with your details confirmed by email and mobile.
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
            Signup now collects your email and mobile number, with account creation confirmed
            through quick OTPs sent to both channels.
          </p>
          <div className="mt-8 space-y-4 text-sm leading-7 text-stone-600">
            <p>Email and Indian mobile number are both mandatory before an account can be created.</p>
            <p>Each signup attempt generates 6-digit email and mobile OTPs to verify the account owner.</p>
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-stone-950">
                Log in here
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-stone-900 p-6 text-stone-100 shadow-[0_30px_70px_rgba(28,25,23,0.15)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200/70">
            Sign up
          </p>
          <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start your nutrition profile.
          </h2>

          {!verification ? (
            <form className="mt-8 space-y-4" onSubmit={handleRequestOtp}>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                autoComplete="name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-stone-400 focus:border-amber-300 focus:outline-none"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-stone-400 focus:border-amber-300 focus:outline-none"
              />
              <input
                name="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Mobile number"
                autoComplete="tel"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-stone-400 focus:border-amber-300 focus:outline-none"
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-stone-400 focus:border-amber-300 focus:outline-none"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white focus:border-amber-300 focus:outline-none"
                >
                  <option className="text-stone-950">Weight loss</option>
                  <option className="text-stone-950">Muscle gain</option>
                  <option className="text-stone-950">Maintain weight</option>
                </select>
                <select
                  name="dietStyle"
                  value={formData.dietStyle}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white focus:border-amber-300 focus:outline-none"
                >
                  <option className="text-stone-950">Balanced</option>
                  <option className="text-stone-950">Vegan</option>
                  <option className="text-stone-950">Keto</option>
                </select>
              </div>
              <p className="text-xs leading-6 text-stone-400">
                Use a valid email like `name@example.com` and a valid Indian number like
                `9876543210` or `+91 9876543210`.
              </p>
              {errorMessage ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {errorMessage}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-amber-300 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleVerifyOtp}>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-stone-200">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                  Verification details
                </p>
                <p className="mt-3 leading-6">
                  An OTP code was generated for <span className="font-semibold text-white">{formData.email}</span>. Your
                  mobile number{' '}
                  <span className="font-semibold text-white">{formData.mobileNumber}</span>.
                </p>
                <p className="mt-2 text-xs leading-6 text-stone-400">
                  Codes expire at {expiresAtLabel || 'soon'}.
                </p>
                <p className="mt-2 text-xs leading-6 text-stone-400">
                  Email delivery: {verification.deliveryStatus?.email?.sent ? 'sent' : 'pending'}.
                </p>
                <p className="mt-2 text-xs leading-6 text-stone-400">
                  Mobile delivery: {verification.deliveryStatus?.mobile?.sent ? 'sent via Message Central' : 'pending'}.
                </p>
              </div>

              <input
                name="emailOtp"
                type="text"
                inputMode="numeric"
                value={otpData.emailOtp}
                onChange={handleOtpChange}
                placeholder="Email OTP"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-stone-400 focus:border-amber-300 focus:outline-none"
              />
              <input
                name="mobileOtp"
                type="text"
                inputMode="numeric"
                value={otpData.mobileOtp}
                onChange={handleOtpChange}
                placeholder="Mobile OTP"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-stone-400 focus:border-amber-300 focus:outline-none"
              />

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {successMessage}
                </div>
              ) : null}
              {errorMessage ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-amber-300 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify and create account'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerification(null)
                    setOtpData(initialOtpData)
                    setErrorMessage('')
                    setSuccessMessage('')
                  }}
                  className="w-full rounded-full border border-white/15 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                >
                  Edit details
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  )
}

export default SignupPage
