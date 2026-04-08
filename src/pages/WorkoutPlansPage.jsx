import { useEffect, useMemo, useState } from 'react'
import SiteShell from '../components/SiteShell.jsx'
import { workoutPlan } from '../data/workoutPlan.js'
import { fetchExerciseByName } from '../services/exerciseApi.js'

const LEVEL_OPTIONS = [
  { id: 'beginner', label: 'Beginner', description: 'Build consistency with a simple six-day split.' },
  { id: 'intermediate', label: 'Intermediate', description: 'Add more volume and variation across the week.' },
  { id: 'advanced', label: 'Advanced', description: 'Train with the fullest split and the most total work.' },
]

function ExerciseCard({ exerciseName }) {
  const [exercise, setExercise] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasRequestedDemo, setHasRequestedDemo] = useState(false)
  const [preferImageFallback, setPreferImageFallback] = useState(false)
  const [mediaFailed, setMediaFailed] = useState(false)

  const searchUrl = useMemo(() => {
    const query = encodeURIComponent(`${exercise?.name || exerciseName} exercise demo`)
    return `https://www.youtube.com/results?search_query=${query}`
  }, [exercise?.name, exerciseName])

  useEffect(() => {
    setExercise(null)
    setError('')
    setIsLoading(false)
    setHasRequestedDemo(false)
    setPreferImageFallback(false)
    setMediaFailed(false)
  }, [exerciseName])

  async function handleLoadDemo() {
    if (isLoading) {
      return
    }

    setHasRequestedDemo(true)
    setIsLoading(true)
    setError('')

    try {
      const nextExercise = await fetchExerciseByName(exerciseName)
      setExercise(nextExercise)
      setPreferImageFallback(false)
      setMediaFailed(false)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Demo unavailable.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-stone-900/10 bg-white shadow-[0_18px_45px_rgba(28,25,23,0.08)]">
      <div className="aspect-[16/11] bg-[linear-gradient(135deg,#fbbf24,#fb7185_55%,#fdba74)]">
        {isLoading ? (
          <div className="flex h-full animate-pulse items-center justify-center bg-black/10 px-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
            Loading demo
          </div>
        ) : exercise?.videoUrl && !preferImageFallback && !mediaFailed ? (
          <video
            src={exercise.videoUrl}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            controls
            preload="none"
            onLoadedData={() => {
              setPreferImageFallback(false)
              setMediaFailed(false)
            }}
            onError={() => {
              if (exercise?.gifUrl) {
                setPreferImageFallback(true)
                return
              }

              setMediaFailed(true)
            }}
          />
        ) : exercise?.gifUrl && !mediaFailed ? (
          <img
            src={exercise.gifUrl}
            alt={exercise.name || exerciseName}
            loading="lazy"
            className="h-full w-full object-cover"
            onLoad={() => setMediaFailed(false)}
            onError={() => setMediaFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white">
            <span>{hasRequestedDemo ? 'Demo unavailable here' : 'Load demo on demand'}</span>
            {hasRequestedDemo ? (
              <a
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/50 px-4 py-2 text-[11px] transition hover:bg-white/10"
              >
                Find video demo
              </a>
            ) : null}
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-xl font-semibold text-stone-950">{exerciseName}</h4>
            <p className="mt-1 text-sm text-stone-500">
              {exercise?.name
                ? `Matched as ${exercise.name}`
                : hasRequestedDemo
                  ? 'ExerciseDB lookup'
                  : 'Demo available on request'}
            </p>
          </div>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">
            Demo
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            Target: {exercise?.target || 'Load demo first'}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            Equipment: {exercise?.equipment || 'Load demo first'}
          </span>
        </div>

        {!exercise ? (
          <button
            type="button"
            onClick={handleLoadDemo}
            disabled={isLoading}
            className="w-full rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-stone-800 disabled:cursor-wait disabled:opacity-70"
          >
            {isLoading ? 'Loading demo...' : hasRequestedDemo ? 'Retry demo' : 'Load demo'}
          </button>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        ) : mediaFailed ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            The built-in preview could not load, so the backup search link above is ready.
          </p>
        ) : (
          <p className="text-sm leading-6 text-stone-600">
            {isLoading
              ? 'Fetching the best-matched movement demonstration and equipment details.'
              : hasRequestedDemo
                ? 'Use the demo before your set if you want a quick refresher on the movement pattern.'
                : 'Load the demo only when you need it to keep the page fast and avoid API rate limits.'}
          </p>
        )}
      </div>
    </article>
  )
}

function WorkoutPlansPage() {
  const [selectedLevel, setSelectedLevel] = useState('beginner')

  const days = useMemo(() => workoutPlan[selectedLevel] || [], [selectedLevel])

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-16 lg:pt-14">
        <div className="rounded-[2rem] border border-stone-900/10 bg-white/70 p-6 shadow-[0_24px_60px_rgba(28,25,23,0.08)] backdrop-blur sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-900/10 bg-emerald-50 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  Weekly workout plan
                </span>
              </div>
              <h1 className="mt-5 font-['Georgia'] text-4xl font-bold leading-[0.95] tracking-tight text-stone-950 sm:text-5xl md:text-6xl">
                Train day by day with built-in exercise demos.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
                Pick your level, scan the week, and open each exercise card to see a GIF or video demo from ExerciseDB,
                plus the target muscle and equipment details.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
              {LEVEL_OPTIONS.map((level) => {
                const isActive = level.id === selectedLevel

                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedLevel(level.id)}
                    className={`rounded-[1.5rem] border p-4 text-left transition ${
                      isActive
                        ? 'border-stone-950 bg-stone-950 text-white shadow-[0_18px_40px_rgba(28,25,23,0.18)]'
                        : 'border-stone-900/10 bg-stone-50 text-stone-900 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isActive ? 'text-amber-200' : 'text-stone-500'}`}>
                      Level
                    </p>
                    <p className="mt-2 text-xl font-semibold">{level.label}</p>
                    <p className={`mt-2 text-sm leading-6 ${isActive ? 'text-stone-200' : 'text-stone-600'}`}>
                      {level.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        <div className="grid gap-6">
          {days.map((dayPlan) => (
            <section
              key={`${selectedLevel}-${dayPlan.day}`}
              className="rounded-[2rem] border border-stone-900/10 bg-white/85 p-5 shadow-[0_18px_45px_rgba(28,25,23,0.08)] backdrop-blur sm:p-6"
            >
              <div className="flex flex-col gap-3 border-b border-stone-900/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{dayPlan.day}</p>
                  <h2 className="mt-2 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950">
                    {dayPlan.muscle}
                  </h2>
                </div>
                <span className="w-fit rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {dayPlan.exercises.length} exercises
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {dayPlan.exercises.map((exerciseName) => (
                  <ExerciseCard key={`${dayPlan.day}-${exerciseName}`} exerciseName={exerciseName} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}

export default WorkoutPlansPage
