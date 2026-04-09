import { useEffect, useMemo, useState } from 'react'
import SiteShell from '../components/SiteShell.jsx'
import { generateWorkoutPlan } from '../services/workoutPlanApi.js'

const fitnessLevelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const goalOptions = [
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'fat-loss', label: 'Fat Loss' },
  { value: 'strength', label: 'Strength' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'recomposition', label: 'Recomposition' },
]

const categoryOptions = [
  { value: 'Chest & Triceps', label: 'Chest & Triceps' },
  { value: 'Back & Biceps', label: 'Back & Biceps' },
  { value: 'Legs & Shoulders', label: 'Legs & Shoulders' },
]

function SelectField({ label, name, value, onChange, options, disabled = false }) {
  return (
    <label className="block rounded-[1.5rem] border border-stone-900/10 bg-white/90 p-5 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-3 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none disabled:cursor-not-allowed disabled:text-stone-400"
      >
        <option value="">
          {disabled ? 'Select above first' : `Select ${label.toLowerCase()}`}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ExerciseCard({ exercise }) {
  const frameUrls = useMemo(
    () =>
      Array.isArray(exercise.demoFrames) && exercise.demoFrames.length > 0
        ? exercise.demoFrames
        : [exercise.gifUrl].filter(Boolean),
    [exercise.demoFrames, exercise.gifUrl],
  )
  const [hasImageError, setHasImageError] = useState(false)
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isPlaying || frameUrls.length < 2) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frameUrls.length)
    }, 1600)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [frameUrls, isPlaying])

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,239,227,0.94))] shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {!hasImageError && frameUrls.length > 0 ? (
          <img
            src={frameUrls[frameIndex]}
            alt={`${exercise.name} demonstration`}
            className="h-full w-full bg-[#f6f0e3] object-contain"
            loading="lazy"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.28),transparent_45%),linear-gradient(180deg,#f5efe3,#ebe3d4)] px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-600">
              Demo unavailable
            </p>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-stone-950/82 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          {exercise.name}
        </div>
        {frameUrls.length > 1 ? (
          <button
            type="button"
            onClick={() => setIsPlaying((current) => !current)}
            className="absolute bottom-4 right-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-800 shadow-sm transition hover:bg-white"
          >
            {isPlaying ? 'Pause demo' : 'Play demo'}
          </button>
        ) : null}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {exercise.targetMuscles.map((muscle) => (
            <span
              key={muscle}
              className="rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-900"
            >
              {muscle}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.1rem] bg-stone-900 p-4 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Sets
            </p>
            <p className="mt-2 text-2xl font-semibold">{exercise.sets}</p>
          </div>
          <div className="rounded-[1.1rem] bg-rose-200 p-4 text-stone-950">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700">
              Reps
            </p>
            <p className="mt-2 text-2xl font-semibold">{exercise.reps}</p>
          </div>
          <div className="rounded-[1.1rem] border border-stone-900/10 bg-white p-4 text-stone-950">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              Rest
            </p>
            <p className="mt-2 text-lg font-semibold">{exercise.rest}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function GoalPlannerPage() {
  const [fitnessLevel, setFitnessLevel] = useState('')
  const [goal, setGoal] = useState('')
  const [category, setCategory] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function loadWorkoutSelection(nextFitnessLevel, nextGoal, nextCategory) {
    if (!nextFitnessLevel || !nextGoal || !nextCategory) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const payload = await generateWorkoutPlan({
        fitnessLevel: nextFitnessLevel,
        goal: nextGoal,
        category: nextCategory,
      })

      setResult(payload)
    } catch (requestError) {
      setResult(null)
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load the workout selection.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleFitnessLevelChange(event) {
    setFitnessLevel(event.target.value)
    setCategory('')
    setResult(null)
    setError('')
  }

  function handleGoalChange(event) {
    setGoal(event.target.value)
    setCategory('')
    setResult(null)
    setError('')
  }

  function handleCategoryChange(event) {
    const nextCategory = event.target.value
    setCategory(nextCategory)
    setResult(null)
    setError('')

    if (nextCategory) {
      loadWorkoutSelection(fitnessLevel, goal, nextCategory)
    }
  }

  const isCategoryEnabled = Boolean(fitnessLevel && goal)

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-5">
            <div className="rounded-[1.75rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,239,227,0.92))] p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                Workout Planner
              </p>
              <h1 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                Pick a combo and get exercise cards with real form GIFs.
              </h1>
            </div>

            <SelectField
              label="Fitness Level"
              name="fitnessLevel"
              value={fitnessLevel}
              onChange={handleFitnessLevelChange}
              options={fitnessLevelOptions}
            />

            <SelectField
              label="Goal"
              name="goal"
              value={goal}
              onChange={handleGoalChange}
              options={goalOptions}
            />

            <SelectField
              label="Workout Selection"
              name="category"
              value={category}
              onChange={handleCategoryChange}
              options={categoryOptions}
              disabled={!isCategoryEnabled}
            />

            {error ? (
              <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-4 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.18)] sm:p-6">
            {!result && !isLoading ? (
              <div className="flex min-h-[32rem] items-center justify-center rounded-[1.6rem] border border-white/10 bg-white/5 p-8 text-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">
                    Exercise results
                  </p>
                  <p className="mt-4 text-lg leading-8 text-stone-300">
                    Select your level, goal, and muscle combo to load guided exercise cards.
                  </p>
                </div>
              </div>
            ) : null}

            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5"
                  >
                    <div className="aspect-[4/3] animate-pulse bg-white/10" />
                    <div className="space-y-3 p-5">
                      <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
                      <div className="h-5 w-28 animate-pulse rounded-full bg-white/10" />
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="h-20 animate-pulse rounded-[1.1rem] bg-white/10" />
                        <div className="h-20 animate-pulse rounded-[1.1rem] bg-white/10" />
                        <div className="h-20 animate-pulse rounded-[1.1rem] bg-white/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {result ? (
              <div>
                <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                    Selected combo
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-3xl font-semibold text-white">
                        {result.category}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-stone-300">
                        {result.exercises.length} exercises ready to follow.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-200">
                        {fitnessLevel}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-200">
                        {goal.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {result.exercises.map((exercise) => (
                    <ExerciseCard
                      key={`${fitnessLevel}-${goal}-${result.category}-${exercise.name}`}
                      exercise={exercise}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default GoalPlannerPage
