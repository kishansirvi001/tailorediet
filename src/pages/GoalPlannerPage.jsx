import { useState } from 'react'
import SiteShell from '../components/SiteShell.jsx'
import { generateWorkoutPlan } from '../services/workoutPlanApi.js'

const initialForm = {
  fitnessLevel: 'beginner',
  goal: 'muscle-gain',
  exercisesPerDay: '8',
}

const fitnessLevelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const goalOptions = [
  { value: 'muscle-gain', label: 'Muscle gain' },
  { value: 'fat-loss', label: 'Fat loss' },
  { value: 'strength', label: 'Strength' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'recomposition', label: 'Recomposition' },
]

const exerciseCountOptions = ['6', '8', '10']

function FieldShell({ label, hint, children }) {
  return (
    <label className="block rounded-[1.75rem] border border-stone-900/10 bg-white/80 p-5 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </span>
      {hint ? (
        <p className="mt-2 text-sm leading-6 text-stone-600">{hint}</p>
      ) : null}
      <div className="mt-3">{children}</div>
    </label>
  )
}

function GoalPlannerPage() {
  const [form, setForm] = useState(initialForm)
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const nextPlan = await generateWorkoutPlan({
        fitnessLevel: form.fitnessLevel,
        goal: form.goal,
        exercisesPerDay: Number(form.exercisesPerDay),
      })

      setPlan(nextPlan)
    } catch (submitError) {
      setPlan(null)
      setError(
        submitError instanceof Error ? submitError.message : 'Something went wrong.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-16 lg:pt-18">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-stone-900/10 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
              Structured JSON planner
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl font-['Georgia'] text-4xl font-bold leading-[0.95] tracking-tight text-stone-950 sm:text-5xl md:text-7xl">
            Generate a 7-day gym workout plan without relying on brittle GIF URLs.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg md:text-xl md:leading-8">
            Pick a fitness level, goal, and exercise count per day. The backend
            returns strict JSON with sets, reps, rest time, muscle group,
            descriptions, and a search term for each exercise GIF.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Split
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">
                7 days
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Exercise counts
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">
                6 / 8 / 10
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                GIF strategy
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">
                Search terms
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-4 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.18)] sm:p-6">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">
              Output contract
            </p>
            <div className="mt-6 grid gap-4">
              {[
                '7 workout days in a consistent JSON shape',
                '6, 8, or 10 exercises per day',
                'Sets, reps, rest time, muscle group, description, and gifSearchTerm',
                'No hardcoded remote GIF dependency in the planner response',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] bg-white/5 p-4 text-sm leading-6 text-stone-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-900/10 bg-white/70 py-14 backdrop-blur sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Planner form
                </p>
                <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl md:text-5xl">
                  Configure the weekly split you want returned as JSON.
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <FieldShell label="Fitness level">
                  <select
                    name="fitnessLevel"
                    value={form.fitnessLevel}
                    onChange={handleChange}
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none"
                  >
                    {fitnessLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell label="Goal">
                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none"
                  >
                    {goalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell
                  label="Exercises per day"
                  hint="Allowed values: 6, 8, or 10."
                >
                  <select
                    name="exercisesPerDay"
                    value={form.exercisesPerDay}
                    onChange={handleChange}
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none"
                  >
                    {exerciseCountOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FieldShell>
              </div>

              {error ? (
                <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex rounded-full bg-stone-900 px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-amber-100 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Generating workout JSON...' : 'Generate 7-day workout plan'}
              </button>
            </form>

            <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-4 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.18)] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
                API response
              </p>
              <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
                The generated JSON appears here.
              </h2>

              {!plan ? (
                <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-base leading-7 text-stone-300">
                    Submit the form to generate a weekly plan with a stable JSON
                    shape and per-exercise `gifSearchTerm` values.
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[1.25rem] bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                        Goal
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {plan.goalLabel}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                        Level
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {plan.fitnessLevel}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                        Daily count
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {plan.exerciseCountPerDay}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                      Summary
                    </p>
                    <p className="mt-3 text-base leading-7 text-stone-100">
                      {plan.summary}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-stone-950/60 p-4">
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6 text-stone-200">
                      {JSON.stringify(plan, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default GoalPlannerPage
