import { useMemo, useState } from 'react'
import SiteShell from '../components/SiteShell.jsx'

const initialForm = {
  name: '',
  age: '',
  gender: 'male',
  weight: '',
  height: '',
  goal: 'weight-loss',
  activityLevel: 'moderate',
  dietPreference: 'vegetarian',
  region: 'North Indian',
  mealsPerDay: '4',
  budget: 'moderate',
  cookingTime: '45-60 minutes',
  allergies: '',
  dislikedFoods: '',
  medicalConditions: '',
  additionalNotes: '',
}

const goalOptions = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'fat-loss-muscle-retention', label: 'Fat Loss + Muscle Retention' },
]

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Lightly Active' },
  { value: 'moderate', label: 'Moderately Active' },
  { value: 'very-active', label: 'Very Active' },
]

const dietOptions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'eggetarian', label: 'Eggetarian' },
  { value: 'non-vegetarian', label: 'Non-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'jain', label: 'Jain' },
]

const regionOptions = [
  'North Indian',
  'South Indian',
  'East Indian',
  'West Indian',
  'Central Indian',
  'Mixed Indian',
]

const budgetOptions = ['budget', 'moderate', 'premium']
const cookingTimeOptions = ['15-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes']

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://tailorediet.onrender.com'

function formatLabel(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function validateDietForm(form) {
  const requiredTextFields = [
    ['name', 'Full name'],
    ['gender', 'Gender'],
    ['goal', 'Primary goal'],
    ['activityLevel', 'Activity level'],
    ['dietPreference', 'Diet preference'],
    ['region', 'Region'],
    ['budget', 'Budget'],
    ['cookingTime', 'Cooking time'],
  ]

  for (const [field, label] of requiredTextFields) {
    if (!String(form[field] || '').trim()) {
      return `${label} is required.`
    }
  }

  const age = toNumber(form.age)
  const weight = toNumber(form.weight)
  const height = toNumber(form.height)
  const mealsPerDay = toNumber(form.mealsPerDay)

  if (age === null || age < 13 || age > 90) {
    return 'Age must be between 13 and 90.'
  }

  if (weight === null || weight < 30 || weight > 250) {
    return 'Weight must be between 30 kg and 250 kg.'
  }

  if (height === null || height < 120 || height > 230) {
    return 'Height must be between 120 cm and 230 cm.'
  }

  if (mealsPerDay === null || mealsPerDay < 2 || mealsPerDay > 8) {
    return 'Meals per day must be between 2 and 8.'
  }

  return ''
}

function FieldShell({ label, hint, children, className = '' }) {
  return (
    <label className={`block rounded-[1.75rem] border border-stone-900/10 bg-white/80 p-5 shadow-sm ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</span>
      {hint ? <p className="mt-2 text-sm leading-6 text-stone-600">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </label>
  )
}

function DietPlansPage() {
  const [form, setForm] = useState(initialForm)
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const summaryItems = useMemo(
    () => [
      { label: 'Goal', value: formatLabel(form.goal) },
      { label: 'Diet style', value: formatLabel(form.dietPreference) },
      { label: 'Region', value: form.region },
      { label: 'Meals', value: `${form.mealsPerDay || '--'} per day` },
    ],
    [form.goal, form.dietPreference, form.region, form.mealsPerDay],
  )

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const validationError = validateDietForm(form)

    if (validationError) {
      setPlan(null)
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/diet-plans/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const rawBody = await response.text()
      const data = rawBody ? JSON.parse(rawBody) : {}

      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate the diet plan right now.')
      }

      setPlan(data.plan)
    } catch (submitError) {
      setPlan(null)
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-stone-900/10 bg-white/85 px-4 py-2 shadow-sm backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
                India-specific planner
              </span>
            </div>

            <h1 className="mt-4 max-w-4xl font-['Georgia'] text-3xl font-bold leading-[1.0] tracking-tight text-stone-950 sm:text-4xl md:text-5xl">
              A full diet-plan intake page that actually asks the right questions.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700 sm:text-base md:text-lg md:leading-7">
              Users can now enter personal details, activity, food preferences,
              allergies, budget, and regional context, then get a detailed
              AI-generated Indian diet plan instead of static cards.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {summaryItems.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-stone-900/10 bg-white/70 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-4 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.24)] sm:p-6">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">
                What this plan engine respects
              </p>
              <div className="mt-6 grid gap-4">
                {[
                  'India-specific foods and realistic home-style meals',
                  'Goal-driven calorie and meal structure guidance',
                  'Allergies, dislikes, medical notes, and daily routine',
                  'Region, budget, and practical cooking-time constraints',
                ].map((item) => (
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
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Diet intake form
                </p>
                <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl md:text-5xl">
                  Gather everything needed for a detailed Indian diet recommendation.
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldShell label="Full name">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                  />
                </FieldShell>

                <FieldShell label="Age">
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                  />
                </FieldShell>

                <FieldShell label="Gender">
                  <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FieldShell>

                <FieldShell label="Weight (kg)">
                  <input
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="68"
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                  />
                </FieldShell>

                <FieldShell label="Height (cm)">
                  <input
                    name="height"
                    type="number"
                    value={form.height}
                    onChange={handleChange}
                    placeholder="172"
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                  />
                </FieldShell>

                <FieldShell label="Primary goal">
                  <select name="goal" value={form.goal} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
                    {goalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell label="Activity level">
                  <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
                    {activityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell label="Diet preference">
                  <select name="dietPreference" value={form.dietPreference} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
                    {dietOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell label="Region">
                  <select name="region" value={form.region} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell label="Meals per day">
                  <input
                    name="mealsPerDay"
                    type="number"
                    value={form.mealsPerDay}
                    onChange={handleChange}
                    placeholder="4"
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                  />
                </FieldShell>

                <FieldShell label="Budget">
                  <select name="budget" value={form.budget} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold capitalize text-stone-950 outline-none">
                    {budgetOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell label="Cooking time">
                  <select name="cookingTime" value={form.cookingTime} onChange={handleChange} className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
                    {cookingTimeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell
                  label="Allergies"
                  hint="Use commas if there is more than one."
                  className="md:col-span-2"
                >
                  <input
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="Peanuts, shellfish"
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                  />
                </FieldShell>

                <FieldShell label="Foods you dislike" className="md:col-span-2">
                  <input
                    name="dislikedFoods"
                    value={form.dislikedFoods}
                    onChange={handleChange}
                    placeholder="Bitter gourd, mushrooms"
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                  />
                </FieldShell>

                <FieldShell
                  label="Medical conditions or restrictions"
                  hint="Examples: thyroid, diabetes, PCOS, acidity, high cholesterol."
                  className="md:col-span-2"
                >
                  <input
                    name="medicalConditions"
                    value={form.medicalConditions}
                    onChange={handleChange}
                    placeholder="Type 2 diabetes"
                    className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                  />
                </FieldShell>

                <FieldShell
                  label="Additional notes"
                  hint="Share schedule constraints, fasting preference, office lunch needs, workout timing, or anything else important."
                  className="md:col-span-2"
                >
                  <textarea
                    name="additionalNotes"
                    value={form.additionalNotes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="I leave for work at 8 am and need easy tiffin-friendly lunches."
                    className="w-full resize-none bg-transparent text-base leading-7 text-stone-900 outline-none placeholder:text-stone-400"
                  />
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
                {isLoading ? 'Generating your plan...' : 'Generate detailed diet plan'}
              </button>
            </form>

            <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-4 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.18)] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
                Detailed output
              </p>
              <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
                The generated plan will appear here with real meal guidance.
              </h2>

              {!plan ? (
                <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-base leading-7 text-stone-300">
                    Submit the form to generate an Indian diet plan with calorie
                    targets, macro guidance, meal timing, suggested foods,
                    shopping items, and practical weekly tips.
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  <section className="rounded-[1.5rem] bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Profile summary</p>
                    <p className="mt-3 text-base leading-7 text-stone-100">{plan.profileSummary}</p>
                  </section>

                  <section className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(plan.dailyTargets || {}).map(([key, value]) => (
                      <div key={key} className="rounded-[1.35rem] bg-white/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">{key}</p>
                        <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </section>

                  <section className="rounded-[1.5rem] bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Plan overview</p>
                    <p className="mt-3 text-base leading-7 text-stone-100">{plan.planOverview?.goalStrategy}</p>
                    <p className="mt-3 text-sm leading-6 text-stone-300">{plan.planOverview?.mealPattern}</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.25rem] bg-white/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Prioritize</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(plan.planOverview?.foodsToPrioritize || []).map((item) => (
                            <span key={item} className="rounded-full bg-emerald-300/15 px-3 py-2 text-xs font-semibold text-emerald-100">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-[1.25rem] bg-white/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Avoid or limit</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(plan.planOverview?.foodsToAvoid || []).map((item) => (
                            <span key={item} className="rounded-full bg-amber-300/15 px-3 py-2 text-xs font-semibold text-amber-100">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.5rem] bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Full-day plan</p>
                    <div className="mt-4 space-y-4">
                      {(plan.fullDayPlan || []).map((meal) => (
                        <article key={`${meal.meal}-${meal.time}`} className="rounded-[1.3rem] bg-white/5 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-lg font-semibold text-white">{meal.meal}</p>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-200">
                              {meal.time}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(meal.items || []).map((item) => (
                              <span key={item} className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-stone-100">
                                {item}
                              </span>
                            ))}
                          </div>
                          <p className="mt-4 text-sm leading-6 text-stone-300">{meal.notes}</p>
                          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                            {meal.estimatedCalories}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-white/5 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Weekly tips</p>
                      <div className="mt-4 space-y-3">
                        {(plan.weeklyTips || []).map((tip) => (
                          <div key={tip} className="rounded-[1.1rem] bg-white/5 p-3 text-sm leading-6 text-stone-200">
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] bg-white/5 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Shopping list</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(plan.shoppingList || []).map((item) => (
                          <span key={item} className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-stone-100">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.5rem] border border-amber-200/20 bg-amber-300/10 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Important note</p>
                    <p className="mt-3 text-sm leading-6 text-amber-50">{plan.importantNote}</p>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default DietPlansPage
