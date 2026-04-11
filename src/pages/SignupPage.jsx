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
  dateOfBirth: '',
  password: '',
  goal: 'Weight loss',
  dietStyle: 'Balanced',
}

const initialOtpData = {
  emailOtp: '',
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

function validateOtpForm(otpData) {
  if (!/^\d{6}$/.test(otpData.emailOtp.trim())) {
    return 'Enter the 6-digit email OTP.'
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

  async function submitOtpRequest() {
    const validationMessage = validateSignupForm(formData)

    if (validationMessage) {
      setErrorMessage(validationMessage)
      setSuccessMessage('')
      return false
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const response = await beginSignupVerification(formData)
      setVerification(response.verification)
      setOtpData(initialOtpData)
      setSuccessMessage('Email OTP sent. Enter the 6-digit code to finish signup.')
      return true
    } catch (error) {
      setVerification(null)
      setErrorMessage(error.message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRequestOtp(event) {
    event.preventDefault()
    await submitOtpRequest()
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
        email: verification.email,
        mobileNumber: formData.mobileNumber,
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
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
        <div className="mx-auto rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(251,248,240,0.9))] p-6 shadow-[0_35px_80px_rgba(28,25,23,0.1)] backdrop-blur sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">Sign up</p>
          <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">Start your plan with a lighter, faster flow.</h2>

          {!verification ? (
            <form className="mt-8 space-y-5" onSubmit={handleRequestOtp}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Full name</span>
                  <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Kishan Sirvi" autoComplete="name" className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Email</span>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" autoComplete="email" className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Mobile number</span>
                  <input name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} placeholder="9876543210" autoComplete="tel" className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Date of birth</span>
                  <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} max={new Date().toISOString().split('T')[0]} className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 focus:border-amber-400 focus:outline-none" />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Password</span>
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create password" autoComplete="new-password" className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Goal</span>
                  <select name="goal" value={formData.goal} onChange={handleChange} className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 focus:border-amber-400 focus:outline-none">
                    <option>Weight loss</option>
                    <option>Muscle gain</option>
                    <option>Maintain weight</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Diet style</span>
                  <select name="dietStyle" value={formData.dietStyle} onChange={handleChange} className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 focus:border-amber-400 focus:outline-none">
                    <option>Balanced</option>
                    <option>Vegan</option>
                    <option>Keto</option>
                  </select>
                </label>
              </div>


              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>
              ) : null}

              <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(249,115,22,0.28)] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Sending email OTP...' : 'Send email OTP'}</button>
            </form>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleVerifyOtp}>
              <div className="rounded-[1.5rem] border border-stone-200 bg-white/80 p-5 text-sm text-stone-700">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Email verification</p>
                <p className="mt-3 leading-6">We sent a 6-digit OTP to <span className="font-semibold text-stone-950">{verification.email}</span>.</p>
                <p className="mt-2 text-xs leading-6 text-stone-500">Code expires at {expiresAtLabel || 'soon'}.</p>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Email OTP</span>
                <input name="emailOtp" type="text" inputMode="numeric" value={otpData.emailOtp} onChange={handleOtpChange} placeholder="Enter 6-digit OTP" className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none" />
              </label>

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{successMessage}</div>
              ) : null}
              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(249,115,22,0.28)] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Verifying...' : 'Verify and create account'}</button>
                <button type="button" onClick={submitOtpRequest} disabled={isSubmitting} className="w-full rounded-full border border-stone-300 bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-stone-800 transition hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Resending...' : 'Resend email OTP'}</button>
                <button type="button" onClick={() => {
                    setVerification(null)
                    setOtpData(initialOtpData)
                    setErrorMessage('')
                    setSuccessMessage('')
                  }} className="w-full rounded-full border border-stone-300 bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-stone-800 transition hover:border-amber-300 hover:bg-amber-50">Edit details</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  )
}

export default SignupPage
