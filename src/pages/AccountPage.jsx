import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const initialTrackerForm = {
  goalFocus: '',
  currentWeightKg: '',
  mealsSummary: '',
  snacksSummary: '',
  waterIntakeLiters: '',
  exerciseSummary: '',
  walkingMinutes: '',
  joggingMinutes: '',
  sleepHours: '',
  energyLevel: 'steady',
  mood: 'good',
  appetiteLevel: 'normal',
  digestionNotes: '',
  notes: '',
}

function formatCheckInDate(value) {
  if (!value) {
    return 'Not saved yet'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not saved yet'
  }

  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

function buildTrackerFormFromUser(user) {
  const lastCheckIn = user?.tracker?.lastCheckIn

  if (!lastCheckIn) {
    return {
      ...initialTrackerForm,
      goalFocus: user?.goal || '',
    }
  }

  return {
    goalFocus: lastCheckIn.goalFocus || user?.goal || '',
    currentWeightKg: lastCheckIn.currentWeightKg ?? '',
    mealsSummary: lastCheckIn.mealsSummary || '',
    snacksSummary: lastCheckIn.snacksSummary || '',
    waterIntakeLiters: lastCheckIn.waterIntakeLiters ?? '',
    exerciseSummary: lastCheckIn.exerciseSummary || '',
    walkingMinutes: lastCheckIn.walkingMinutes ?? '',
    joggingMinutes: lastCheckIn.joggingMinutes ?? '',
    sleepHours: lastCheckIn.sleepHours ?? '',
    energyLevel: lastCheckIn.energyLevel || 'steady',
    mood: lastCheckIn.mood || 'good',
    appetiteLevel: lastCheckIn.appetiteLevel || 'normal',
    digestionNotes: lastCheckIn.digestionNotes || '',
    notes: lastCheckIn.notes || '',
  }
}

function TrackerField({ label, hint, className = '', children }) {
  return (
    <label className={`block rounded-[1.25rem] border border-stone-200 bg-white p-4 shadow-sm ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</span>
      {hint ? <p className="mt-1.5 text-sm leading-6 text-stone-600">{hint}</p> : null}
      <div className="mt-2.5">{children}</div>
    </label>
  )
}

function AccountPage() {
  const { isLoading, isAuthenticated, logout, saveTrackerCheckIn, user } = useAuth()
  const birthDateLabel = user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not added'
  const [trackerForm, setTrackerForm] = useState(() => buildTrackerFormFromUser(user))
  const [trackerError, setTrackerError] = useState('')
  const [trackerSuccess, setTrackerSuccess] = useState('')
  const [isSavingTracker, setIsSavingTracker] = useState(false)

  useEffect(() => {
    setTrackerForm(buildTrackerFormFromUser(user))
  }, [user])

  const latestCheckIn = user?.tracker?.lastCheckIn || null
  const history = user?.tracker?.history || []

  const trackerHighlights = useMemo(
    () => [
      { label: 'Goal focus', value: latestCheckIn?.goalFocus || user?.goal || 'Not added' },
      { label: 'Food logged', value: latestCheckIn?.mealsSummary || 'No meal details yet' },
      {
        label: 'Movement',
        value: `${latestCheckIn?.walkingMinutes ?? 0} min walk • ${latestCheckIn?.joggingMinutes ?? 0} min jog`,
      },
      {
        label: 'Exercise',
        value: latestCheckIn?.exerciseSummary || 'No workout logged yet',
      },
    ],
    [latestCheckIn, user?.goal],
  )

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  function updateTrackerField(event) {
    const { name, value } = event.target
    setTrackerForm((current) => ({ ...current, [name]: value }))
  }

  async function handleTrackerSubmit(event) {
    event.preventDefault()
    setTrackerError('')
    setTrackerSuccess('')
    setIsSavingTracker(true)

    try {
      await saveTrackerCheckIn(trackerForm)
      setTrackerSuccess('Your tracking check-in has been saved to your profile.')
    } catch (error) {
      setTrackerError(error instanceof Error ? error.message : 'Unable to save your tracker data right now.')
    } finally {
      setIsSavingTracker(false)
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,239,226,0.92))] p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Your account
            </p>
            <h1 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
              Welcome back, {user?.name || 'TailorDiet member'}.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
              Your profile now includes a daily tracker for meals, movement, exercise, and recovery habits.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {trackerHighlights.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-stone-900/10 bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {item.label}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-stone-950">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/calculators"
                className="rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(249,115,22,0.28)]"
              >
                Open calculators
              </Link>
              <Link
                to="/meal-scanner"
                className="rounded-full border border-stone-300 bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-stone-900 transition hover:border-amber-300 hover:bg-amber-50"
              >
                Scan a meal
              </Link>
              <Link
                to="/diet-plans"
                className="rounded-full border border-stone-300 bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-stone-900 transition hover:border-stone-500 hover:bg-stone-50"
              >
                View diet plans
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-stone-900/10 bg-white p-6 text-stone-800 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Profile details
            </p>
            <div className="mt-8 space-y-5">
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Full name</p>
                <p className="mt-2 text-lg font-semibold text-stone-800">{user?.name}</p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Email</p>
                <p className="mt-2 break-all text-lg font-semibold text-stone-800">
                  {user?.email || 'Not added'}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Mobile</p>
                <p className="mt-2 text-lg font-semibold text-stone-800">
                  {user?.mobileNumber || 'Not added'}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Date of birth</p>
                <p className="mt-2 text-lg font-semibold text-stone-800">{birthDateLabel}</p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Last check-in</p>
                <p className="mt-2 text-lg font-semibold text-stone-800">
                  {formatCheckInDate(latestCheckIn?.recordedAt)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-md transition hover:opacity-95"
            >
              Log out
            </button>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-10 lg:pb-24">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={handleTrackerSubmit}
            className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,252,248,0.98),rgba(255,255,255,0.98))] p-6 shadow-sm sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Daily tracker
            </p>
            <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Save today&apos;s food, movement, and recovery data.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">
              Tell TailorDiet what you are aiming for, what you ate, what exercise you did, and whether you walked or jogged. Each check-in is saved inside your profile.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <TrackerField label="Goal focus" hint="Examples: fat loss, maintenance, muscle gain.">
                <input
                  name="goalFocus"
                  value={trackerForm.goalFocus}
                  onChange={updateTrackerField}
                  placeholder="Weight loss"
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Current weight (kg)">
                <input
                  name="currentWeightKg"
                  type="number"
                  value={trackerForm.currentWeightKg}
                  onChange={updateTrackerField}
                  placeholder="68"
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Food eaten" hint="Meals across the day." className="md:col-span-2">
                <textarea
                  name="mealsSummary"
                  value={trackerForm.mealsSummary}
                  onChange={updateTrackerField}
                  rows="3"
                  placeholder="Breakfast: oats and eggs. Lunch: dal, rice, salad. Dinner: paneer roti."
                  className="w-full resize-none bg-transparent text-base leading-7 text-stone-900 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Snacks or extras" hint="Optional.">
                <input
                  name="snacksSummary"
                  value={trackerForm.snacksSummary}
                  onChange={updateTrackerField}
                  placeholder="Fruit, tea, protein shake"
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Water intake (liters)">
                <input
                  name="waterIntakeLiters"
                  type="number"
                  step="0.1"
                  value={trackerForm.waterIntakeLiters}
                  onChange={updateTrackerField}
                  placeholder="2.5"
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Exercise done" hint="Workout details, sport, yoga, gym, etc." className="md:col-span-2">
                <textarea
                  name="exerciseSummary"
                  value={trackerForm.exerciseSummary}
                  onChange={updateTrackerField}
                  rows="3"
                  placeholder="45 min upper-body workout, 10 min stretching"
                  className="w-full resize-none bg-transparent text-base leading-7 text-stone-900 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Walking time (minutes)">
                <input
                  name="walkingMinutes"
                  type="number"
                  value={trackerForm.walkingMinutes}
                  onChange={updateTrackerField}
                  placeholder="30"
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Jogging time (minutes)">
                <input
                  name="joggingMinutes"
                  type="number"
                  value={trackerForm.joggingMinutes}
                  onChange={updateTrackerField}
                  placeholder="15"
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Sleep hours">
                <input
                  name="sleepHours"
                  type="number"
                  step="0.5"
                  value={trackerForm.sleepHours}
                  onChange={updateTrackerField}
                  placeholder="7.5"
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Energy level">
                <select
                  name="energyLevel"
                  value={trackerForm.energyLevel}
                  onChange={updateTrackerField}
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="steady">Steady</option>
                  <option value="high">High</option>
                </select>
              </TrackerField>

              <TrackerField label="Mood">
                <select
                  name="mood"
                  value={trackerForm.mood}
                  onChange={updateTrackerField}
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none"
                >
                  <option value="good">Good</option>
                  <option value="okay">Okay</option>
                  <option value="stressed">Stressed</option>
                  <option value="tired">Tired</option>
                </select>
              </TrackerField>

              <TrackerField label="Appetite">
                <select
                  name="appetiteLevel"
                  value={trackerForm.appetiteLevel}
                  onChange={updateTrackerField}
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </TrackerField>

              <TrackerField label="Digestion notes">
                <input
                  name="digestionNotes"
                  value={trackerForm.digestionNotes}
                  onChange={updateTrackerField}
                  placeholder="Bloating, acidity, felt fine"
                  className="w-full bg-transparent text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </TrackerField>

              <TrackerField label="Anything else to remember?" className="md:col-span-2">
                <textarea
                  name="notes"
                  value={trackerForm.notes}
                  onChange={updateTrackerField}
                  rows="4"
                  placeholder="Late dinner, travel day, low appetite, felt strong in training..."
                  className="w-full resize-none bg-transparent text-base leading-7 text-stone-900 outline-none placeholder:text-stone-400"
                />
              </TrackerField>
            </div>

            {trackerError ? (
              <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
                {trackerError}
              </div>
            ) : null}

            {trackerSuccess ? (
              <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700">
                {trackerSuccess}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-stone-600">
                Saving a check-in updates your profile with the latest routine snapshot and recent history.
              </p>
              <button
                type="submit"
                disabled={isSavingTracker}
                className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-amber-100 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSavingTracker ? 'Saving check-in...' : 'Save today’s check-in'}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-6 text-white shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
                Latest saved snapshot
              </p>
              <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight">
                {latestCheckIn ? 'Your latest routine is stored in your profile.' : 'Your first saved check-in will appear here.'}
              </h2>

              {!latestCheckIn ? (
                <p className="mt-4 text-base leading-7 text-stone-300">
                  Start by entering your daily goal, food intake, exercise, and walking or jogging time.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="rounded-[1.5rem] bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Saved on</p>
                    <p className="mt-2 text-lg font-semibold text-white">{formatCheckInDate(latestCheckIn.recordedAt)}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Meals</p>
                      <p className="mt-2 text-sm leading-6 text-stone-100">{latestCheckIn.mealsSummary || 'Not added'}</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Exercise</p>
                      <p className="mt-2 text-sm leading-6 text-stone-100">{latestCheckIn.exerciseSummary || 'Not added'}</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Movement</p>
                      <p className="mt-2 text-sm leading-6 text-stone-100">
                        Walk: {latestCheckIn.walkingMinutes ?? 0} min
                        <br />
                        Jog: {latestCheckIn.joggingMinutes ?? 0} min
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Recovery</p>
                      <p className="mt-2 text-sm leading-6 text-stone-100">
                        Sleep: {latestCheckIn.sleepHours ?? 'Not added'} hrs
                        <br />
                        Mood: {latestCheckIn.mood || 'Not added'}
                        <br />
                        Energy: {latestCheckIn.energyLevel || 'Not added'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                Recent check-ins
              </p>

              {history.length === 0 ? (
                <p className="mt-4 text-base leading-7 text-stone-700">
                  No history saved yet. Once you submit a tracker entry, your recent profile check-ins will show up here.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {history.map((entry) => (
                    <article key={entry.recordedAt || `${entry.goalFocus}-${entry.mealsSummary}`} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-lg font-semibold text-stone-950">{entry.goalFocus || 'Daily check-in'}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-600">
                          {formatCheckInDate(entry.recordedAt)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-stone-700">
                        {entry.mealsSummary || 'No meal notes'} | Exercise: {entry.exerciseSummary || 'Not added'} | Walk {entry.walkingMinutes ?? 0} min | Jog {entry.joggingMinutes ?? 0} min
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default AccountPage
