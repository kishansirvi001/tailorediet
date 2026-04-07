import { useEffect, useState } from 'react'
import SiteShell from '../components/SiteShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchWorkoutPlan } from '../services/workoutApi.js'

function WorkoutPlansPage() {
  const { token, user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [selectedLevelId, setSelectedLevelId] = useState('beginner')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadPlan() {
      if (!token) {
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const nextPlan = await fetchWorkoutPlan(token)

        if (!isMounted) {
          return
        }

        setPlan(nextPlan)
        setSelectedLevelId(nextPlan.levels?.[0]?.id || 'beginner')
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load the workout plan.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPlan()

    return () => {
      isMounted = false
    }
  }, [token])

  const selectedLevel = plan?.levels?.find((level) => level.id === selectedLevelId) || plan?.levels?.[0] || null

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-14 lg:pt-18">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-900/10 bg-white/85 px-4 py-2 shadow-sm backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
                Members-only training
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl font-['Georgia'] text-4xl font-bold leading-[0.95] tracking-tight text-stone-950 sm:text-5xl md:text-7xl">
              Watch the movement, follow the cues, and progress from your first gym week to athlete-level training.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg md:text-xl md:leading-8">
              {user?.name?.split(' ')[0] || 'Member'}, this plan maps a clear beginner to advanced gym path and pairs each lift with ExerciseDB media, instructions, and technique cues whenever available.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/70 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Built for</p>
                <p className="mt-2 text-2xl font-semibold text-stone-950">Beginner to advanced</p>
              </div>
              <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/70 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Access</p>
                <p className="mt-2 text-2xl font-semibold text-stone-950">Logged-in users only</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-4 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.24)] sm:p-6">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">
                Training rules
              </p>
              <div className="mt-6 grid gap-4">
                {(plan?.onboardingChecklist || [
                  'Choose the level that matches your current technique and recovery.',
                  'Use the movement media before lifting if the exercise is new to you.',
                  'Increase load only when your full set stays clean and repeatable.',
                  'Sharp pain is a stop sign, not a challenge.',
                ]).map((item) => (
                  <div key={item} className="rounded-[1.25rem] bg-white/5 p-4 text-sm leading-6 text-stone-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-900/10 bg-white/70 py-14 backdrop-blur sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {isLoading ? (
            <div className="rounded-[2rem] border border-stone-900/10 bg-white/90 p-8 text-base text-stone-700 shadow-sm">
              Loading your workout progression...
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-base text-rose-700 shadow-sm">
              {error}
            </div>
          ) : !plan || !selectedLevel ? (
            <div className="rounded-[2rem] border border-stone-900/10 bg-white/90 p-8 text-base text-stone-700 shadow-sm">
              No workout plan is available yet.
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr]">
              <aside className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                    Program ladder
                  </p>
                  <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                    Choose your current level.
                  </h2>
                </div>

                <div className="grid gap-3">
                  {plan.levels.map((level) => {
                    const isActive = level.id === selectedLevel.id

                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setSelectedLevelId(level.id)}
                        className={`rounded-[1.7rem] border p-5 text-left transition ${
                          isActive
                            ? 'border-stone-950 bg-stone-950 text-white shadow-[0_24px_55px_rgba(28,25,23,0.18)]'
                            : 'border-stone-900/10 bg-white text-stone-900 hover:border-amber-300 hover:bg-amber-50/60'
                        }`}
                      >
                        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isActive ? 'text-amber-200' : 'text-stone-500'}`}>
                          {level.frequency}
                        </p>
                        <p className="mt-3 text-2xl font-semibold">{level.label}</p>
                        <p className={`mt-3 text-sm leading-6 ${isActive ? 'text-stone-200' : 'text-stone-600'}`}>
                          {level.summary}
                        </p>
                        <p className={`mt-4 text-xs font-semibold uppercase tracking-[0.16em] ${isActive ? 'text-emerald-200' : 'text-emerald-700'}`}>
                          {level.duration}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </aside>

              <div className="space-y-8">
                <section className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-6 text-stone-100 shadow-[0_30px_70px_rgba(28,25,23,0.16)]">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                        {selectedLevel.frequency}
                      </p>
                      <h3 className="mt-3 font-['Georgia'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {selectedLevel.label}
                      </h3>
                    </div>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-200">
                      {selectedLevel.duration}
                    </span>
                  </div>

                  <p className="mt-5 max-w-3xl text-base leading-7 text-stone-300">
                    {selectedLevel.summary}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {selectedLevel.progression.map((item) => (
                      <div key={item} className="rounded-[1.25rem] bg-white/5 p-4 text-sm leading-6 text-stone-200">
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-6">
                  {selectedLevel.weeklySplit.map((day) => (
                    <article
                      key={`${selectedLevel.id}-${day.day}`}
                      className="rounded-[2rem] border border-stone-900/10 bg-white/90 p-5 shadow-sm sm:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{day.day}</p>
                          <h4 className="mt-2 font-['Georgia'] text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
                            {day.focus}
                          </h4>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                          {day.coachingGoal}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-5">
                        {day.exercises.map((exercise) => (
                          <div
                            key={`${day.day}-${exercise.exerciseId}-${exercise.name}`}
                            className="grid gap-5 rounded-[1.7rem] border border-stone-900/10 bg-stone-50/90 p-4 lg:grid-cols-[240px_1fr]"
                          >
                            <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-sm">
                              {exercise.mediaUrl ? (
                                <img
                                  src={exercise.mediaUrl}
                                  alt={exercise.name}
                                  loading="lazy"
                                  className="h-full min-h-52 w-full object-cover"
                                />
                              ) : (
                                <div className="flex min-h-52 items-center justify-center bg-[linear-gradient(135deg,#f59e0b,#fb7185)] p-6 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white">
                                  Exercise media unavailable
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-stone-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                  {exercise.setsReps}
                                </span>
                                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
                                  Rest {exercise.rest}
                                </span>
                                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
                                  Tempo {exercise.tempo}
                                </span>
                              </div>

                              <h5 className="mt-4 text-2xl font-semibold text-stone-950">{exercise.name}</h5>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {(exercise.targetMuscles || []).map((item) => (
                                  <span key={`${exercise.name}-${item}`} className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-900">
                                    {item}
                                  </span>
                                ))}
                                {(exercise.equipments || []).map((item) => (
                                  <span key={`${exercise.name}-equipment-${item}`} className="rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900">
                                    {item}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                                    How to do it
                                  </p>
                                  <div className="mt-3 space-y-2">
                                    {(exercise.instructions || []).map((item) => (
                                      <div key={item} className="rounded-[1.1rem] bg-white p-3 text-sm leading-6 text-stone-700 shadow-sm">
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                                    Form cues
                                  </p>
                                  <div className="mt-3 space-y-2">
                                    {(exercise.tips || []).map((item) => (
                                      <div key={item} className="rounded-[1.1rem] bg-stone-900 p-3 text-sm leading-6 text-stone-200 shadow-sm">
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </section>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  )
}

export default WorkoutPlansPage
