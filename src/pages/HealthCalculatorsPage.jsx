import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { activityOptions } from '../lib/calculatorData.js'
import {
  calculateBmi,
  calculateCalories,
  calculateMacros,
  validateBodyMetrics,
  validateMacroInputs,
} from '../lib/calculatorUtils.js'

const calculatorLinks = {
  'Calorie calculator': '/calculators/calorie',
  'Calorie deficit calculator': '/calculators/calorie-deficit',
  'Calorie surplus calculator': '/calculators/calorie-surplus',
  'BMI calculator': '/calculators/bmi',
  'Macro calculator': '/calculators/macro',
  'Workout planner': '/workout-planner',
  'Water intake': '/calculators/water-intake',
  'Ideal weight': '/calculators/ideal-weight',
  'Body fat estimator': '/calculators/body-fat',
}

function HealthCalculatorsPage() {
  const [profile, setProfile] = useState({
    age: 29,
    weight: 78,
    height: 178,
    activity: 'moderate',
    goal: 'muscle-gain',
    calories: 2230,
    proteinRatio: 30,
    carbsRatio: 45,
    fatsRatio: 25,
  })

  function updateField(event) {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const calorieResult = useMemo(() => calculateCalories(profile), [profile])
  const bmiResult = useMemo(() => calculateBmi(profile), [profile])
  const macroResult = useMemo(() => calculateMacros(profile), [profile])
  const bodyIssues = useMemo(() => validateBodyMetrics(profile), [profile])
  const macroIssues = useMemo(() => validateMacroInputs(profile), [profile])

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24 lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-stone-900/10 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
              Dedicated feature page
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl font-['Georgia'] text-4xl font-bold leading-[0.95] tracking-tight text-stone-950 sm:text-5xl md:text-7xl">
            Working health calculators that lead naturally into the right diet plan.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg md:text-xl md:leading-8">
            This page now gives TailorDiet functional calculator modules for
            calories, BMI, macros, and goal planning so the product feels useful,
            not just descriptive.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/diet-plans"
              className="rounded-full bg-stone-900 px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-amber-100 transition hover:bg-stone-700"
            >
              View diet plans
            </Link>
            <Link
              to="/signup"
              className="rounded-full border border-stone-400/60 bg-white/80 px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-stone-900 backdrop-blur transition hover:border-stone-600 hover:bg-white"
            >
              Save your profile
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-4 text-stone-100 shadow-[0_40px_90px_rgba(28,25,23,0.22)] sm:rounded-[2.2rem] sm:p-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">
              Quick links
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Access all calculators.
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(calculatorLinks).map(([name, path]) => (
                <Link key={name} to={path} className="rounded-lg border border-white/20 bg-white/5 p-3 text-sm font-medium text-white transition hover:bg-white/10">
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-900/10 bg-white/70 py-16 backdrop-blur sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Calculator suite
            </p>
            <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl md:text-5xl">
              Four working calculators built from shared profile data.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-amber-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Calorie calculator
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Age</span>
                  <input name="age" type="number" value={profile.age} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Weight (kg)</span>
                  <input name="weight" type="number" value={profile.weight} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Height (cm)</span>
                  <input name="height" type="number" value={profile.height} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Activity</span>
                  <select name="activity" value={profile.activity} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
                    {activityOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              {bodyIssues.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {bodyIssues.map((issue) => (
                    <p key={issue}>{issue}</p>
                  ))}
                </div>
              ) : null}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-900 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Maintenance</p>
                  <p className="mt-2 text-2xl font-semibold">{calorieResult.maintenance}</p>
                </div>
                <div className="rounded-2xl bg-amber-200 p-4 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Goal calories</p>
                  <p className="mt-2 text-2xl font-semibold">{calorieResult.target}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Daily range</p>
                  <p className="mt-2 text-base font-semibold">{calorieResult.range}</p>
                </div>
              </div>
              <Link to={calculatorLinks['Calorie calculator']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>

            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-rose-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Calorie deficit calculator
              </div>
              <p className="mt-6 text-base leading-7 text-stone-700">
                Build a fat-loss calorie target by subtracting a custom daily deficit from estimated maintenance calories.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-900 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Maintenance</p>
                  <p className="mt-2 text-2xl font-semibold">{calorieResult.maintenance}</p>
                </div>
                <div className="rounded-2xl bg-rose-200 p-4 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Suggested deficit</p>
                  <p className="mt-2 text-2xl font-semibold">450 kcal</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Example target</p>
                  <p className="mt-2 text-base font-semibold">{Math.max(1200, calorieResult.maintenance - 450)} kcal</p>
                </div>
              </div>
              <Link to={calculatorLinks['Calorie deficit calculator']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>

            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-emerald-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Calorie surplus calculator
              </div>
              <p className="mt-6 text-base leading-7 text-stone-700">
                Build a muscle-gain calorie target by adding a measured surplus on top of maintenance intake.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-900 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Maintenance</p>
                  <p className="mt-2 text-2xl font-semibold">{calorieResult.maintenance}</p>
                </div>
                <div className="rounded-2xl bg-emerald-200 p-4 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Suggested surplus</p>
                  <p className="mt-2 text-2xl font-semibold">280 kcal</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Example target</p>
                  <p className="mt-2 text-base font-semibold">{calorieResult.maintenance + 280} kcal</p>
                </div>
              </div>
              <Link to={calculatorLinks['Calorie surplus calculator']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>

            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-lime-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                BMI calculator
              </div>
              <p className="mt-6 text-base leading-7 text-stone-700">
                BMI updates from the same profile inputs and gives a quick reference point for general health screening.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-900 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">BMI</p>
                  <p className="mt-2 text-3xl font-semibold">{bmiResult.bmi}</p>
                </div>
                <div className="rounded-2xl bg-lime-200 p-5 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Range</p>
                  <p className="mt-2 text-xl font-semibold">{bmiResult.label}</p>
                </div>
                <div className="rounded-2xl border border-stone-900/10 bg-white p-5 text-stone-700">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Reference</p>
                  <p className="mt-2 text-sm leading-6">{bmiResult.note}</p>
                </div>
              </div>
              <Link to={calculatorLinks['BMI calculator']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>

            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-sky-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Macro calculator
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Calories</span>
                  <input name="calories" type="number" value={profile.calories} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
                </label>
                <div className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Ratio split</span>
                  <p className="mt-2 text-lg font-semibold text-stone-950">{profile.proteinRatio}% / {profile.carbsRatio}% / {profile.fatsRatio}%</p>
                </div>
                <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Protein %</span>
                  <input name="proteinRatio" type="number" value={profile.proteinRatio} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Carbs %</span>
                  <input name="carbsRatio" type="number" value={profile.carbsRatio} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4 sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Fats %</span>
                  <input name="fatsRatio" type="number" value={profile.fatsRatio} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
                </label>
              </div>
              {macroIssues.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {macroIssues.map((issue) => (
                    <p key={issue}>{issue}</p>
                  ))}
                </div>
              ) : null}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-900 p-4 text-white"><p className="text-xs uppercase tracking-[0.16em] text-stone-400">Protein</p><p className="mt-2 text-2xl font-semibold">{macroResult.protein}g</p></div>
                <div className="rounded-2xl bg-sky-200 p-4 text-stone-950"><p className="text-xs uppercase tracking-[0.16em] text-stone-700">Carbs</p><p className="mt-2 text-2xl font-semibold">{macroResult.carbs}g</p></div>
                <div className="rounded-2xl bg-white p-4 text-stone-950 border border-stone-900/10"><p className="text-xs uppercase tracking-[0.16em] text-stone-500">Fats</p><p className="mt-2 text-2xl font-semibold">{macroResult.fats}g</p></div>
              </div>
              <Link to={calculatorLinks['Macro calculator']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>

            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-rose-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Workout planner
              </div>
              <p className="mt-6 text-base leading-7 text-stone-700">
                Select fitness level and goal first, then choose one of three
                workout combos: Chest & Triceps, Back & Biceps, or Legs &
                Shoulders.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-900 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Format</p>
                  <p className="mt-2 text-xl font-semibold">Exercise cards</p>
                </div>
                <div className="rounded-2xl bg-rose-200 p-4 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Exercise count</p>
                  <p className="mt-2 text-xl font-semibold">6 / 7 / 8</p>
                </div>
                <div className="rounded-2xl border border-stone-900/10 bg-white p-4 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">GIF media</p>
                  <p className="mt-2 text-base font-semibold">Proxy URLs</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-stone-900/10 bg-white/75 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Selection flow</p>
                <p className="mt-2 text-base leading-7 text-stone-700">
                  The dedicated page shows category-specific exercise cards with
                  live GIF demonstrations, target muscles, sets, reps, and rest time.
                </p>
              </div>
              <Link to={calculatorLinks['Workout planner']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-cyan-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Water intake
              </div>
              <p className="mt-6 text-base leading-7 text-stone-700">
                Estimate daily hydration targets based on weight and activity level.
              </p>
              <Link to={calculatorLinks['Water intake']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>

            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-emerald-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Ideal weight
              </div>
              <p className="mt-6 text-base leading-7 text-stone-700">
                Show a healthy reference range and midpoint based on height.
              </p>
              <Link to={calculatorLinks['Ideal weight']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>

            <article className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
              <div className="inline-flex rounded-full bg-rose-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Body fat estimator
              </div>
              <p className="mt-6 text-base leading-7 text-stone-700">
                Provide a rough body fat estimate from age, BMI-related inputs, and sex.
              </p>
              <Link to={calculatorLinks['Body fat estimator']} className="mt-6 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open dedicated page
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,239,226,0.92))] p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Why it matters
          </p>
          <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Functional calculators make the product feel useful before users ever create an account.
          </h2>
          <p className="mt-6 text-lg leading-8 text-stone-700">
            TailorDiet now has a clear acquisition and education surface where users can test health inputs, understand the result, and then move into a personalized diet plan with confidence.
          </p>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-stone-900 p-6 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.18)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
            Connected experience
          </p>
          <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Every calculator should hand off to planning and clearer nutrition direction.
          </h2>
          <div className="mt-8 grid gap-4">
            <Link to="/diet-plans" className="rounded-[1.5rem] bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Next surface</p>
              <p className="mt-2 text-xl font-semibold text-white">Personalized diet plans</p>
            </Link>
            <div className="rounded-[1.5rem] bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">User value</p>
              <p className="mt-2 text-xl font-semibold text-white">Clearer decisions about calorie needs, body metrics, hydration, and diet direction</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default HealthCalculatorsPage
