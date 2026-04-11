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
  calculateBMR,
  calculateTDEE,
  calculateMetabolicAge,
  calculateExerciseCalories,
  calculateStepCalories,
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
    sex: 'male',
    duration: 30,
    exerciseType: 'running',
    steps: 10000,
  })

  const [activeFilter, setActiveFilter] = useState('all')

  function updateField(event) {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const calorieResult = useMemo(() => calculateCalories(profile), [profile])
  const bmiResult = useMemo(() => calculateBmi(profile), [profile])
  const macroResult = useMemo(() => calculateMacros(profile), [profile])
  const bodyIssues = useMemo(() => validateBodyMetrics(profile), [profile])
  const macroIssues = useMemo(() => validateMacroInputs(profile), [profile])
  const bmrResult = useMemo(() => calculateBMR(profile), [profile])
  const tdeeResult = useMemo(() => calculateTDEE(profile), [profile])
  const metabolicAgeResult = useMemo(() => calculateMetabolicAge(profile), [profile])
  const exerciseResult = useMemo(() => calculateExerciseCalories(profile), [profile])
  const stepResult = useMemo(() => calculateStepCalories(profile), [profile])

  return (
    <SiteShell>
      <div className="sticky top-0 z-40 border-b border-stone-900/10 bg-white/95 backdrop-blur py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                activeFilter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'border border-stone-300 text-stone-900 hover:border-stone-500'
              }`}
            >
              All calculators
            </button>
            <button
              onClick={() => setActiveFilter('nutrition')}
              className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                activeFilter === 'nutrition'
                  ? 'bg-amber-200 text-stone-950'
                  : 'border border-stone-300 text-stone-900 hover:border-stone-500'
              }`}
            >
              Calorie & Nutrition
            </button>
            <button
              onClick={() => setActiveFilter('fitness')}
              className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                activeFilter === 'fitness'
                  ? 'bg-orange-200 text-stone-950'
                  : 'border border-stone-300 text-stone-900 hover:border-stone-500'
              }`}
            >
              Fitness & Workouts
            </button>
            <button
              onClick={() => setActiveFilter('health')}
              className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                activeFilter === 'health'
                  ? 'bg-cyan-200 text-stone-950'
                  : 'border border-stone-300 text-stone-900 hover:border-stone-500'
              }`}
            >
              Health Metrics
            </button>
          </div>
        </div>
      </div>

      <section className="border-y border-stone-900/10 bg-white/70 py-16 backdrop-blur sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {(activeFilter === 'all' || activeFilter === 'nutrition') && (
            <>
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-stone-950 sm:text-3xl">Calorie & Nutrition</h2>
                <p className="mt-2 text-sm text-stone-600">Calculate your daily calorie needs and macro targets</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-amber-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-stone-900">
                Calorie calculator
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Age</span>
                  <input name="age" type="number" value={profile.age} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Weight (kg)</span>
                  <input name="weight" type="number" value={profile.weight} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Height (cm)</span>
                  <input name="height" type="number" value={profile.height} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Activity</span>
                  <select name="activity" value={profile.activity} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none">
                    {activityOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              {bodyIssues.length > 0 ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                  {bodyIssues.map((issue) => (
                    <p key={issue}>{issue}</p>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Maintenance</p>
                  <p className="mt-1 text-lg font-semibold">{calorieResult.maintenance}</p>
                </div>
                <div className="rounded-xl bg-amber-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Goal calories</p>
                  <p className="mt-1 text-lg font-semibold">{calorieResult.target}</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Daily range</p>
                  <p className="mt-1 text-sm font-semibold">{calorieResult.range}</p>
                </div>
              </div>
              <Link to={calculatorLinks['Calorie calculator']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-rose-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-stone-900">
                Calorie deficit calculator
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Build a fat-loss calorie target by subtracting a custom daily deficit from estimated maintenance calories.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Maintenance</p>
                  <p className="mt-1 text-lg font-semibold">{calorieResult.maintenance}</p>
                </div>
                <div className="rounded-xl bg-rose-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Suggested deficit</p>
                  <p className="mt-1 text-lg font-semibold">450 kcal</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Example target</p>
                  <p className="mt-1 text-sm font-semibold">{Math.max(1200, calorieResult.maintenance - 450)} kcal</p>
                </div>
              </div>
              <Link to={calculatorLinks['Calorie deficit calculator']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-emerald-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-stone-900">
                Calorie surplus calculator
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Build a muscle-gain calorie target by adding a measured surplus on top of maintenance intake.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Maintenance</p>
                  <p className="mt-1 text-lg font-semibold">{calorieResult.maintenance}</p>
                </div>
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Maintenance</p>
                  <p className="mt-1 text-lg font-semibold">{calorieResult.maintenance}</p>
                </div>
                <div className="rounded-xl bg-emerald-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Suggested surplus</p>
                  <p className="mt-1 text-lg font-semibold">280 kcal</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Example target</p>
                  <p className="mt-1 text-sm font-semibold">{calorieResult.maintenance + 280} kcal</p>
                </div>
              </div>
              <Link to={calculatorLinks['Calorie surplus calculator']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-lime-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-stone-900">
                BMI calculator
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                BMI updates from the same profile inputs and gives a quick reference point for general health screening.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">BMI</p>
                  <p className="mt-1 text-lg font-semibold">{bmiResult.bmi}</p>
                </div>
                <div className="rounded-xl bg-lime-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Range</p>
                  <p className="mt-2 text-xl font-semibold">{bmiResult.label}</p>
                </div>
                <div className="rounded-xl bg-lime-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Range</p>
                  <p className="mt-1 text-base font-semibold">{bmiResult.label}</p>
                </div>
                <div className="rounded-xl border border-stone-900/10 bg-white p-3 text-stone-700">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Reference</p>
                  <p className="mt-1 text-xs leading-5">{bmiResult.note}</p>
                </div>
              </div>
              <Link to={calculatorLinks['BMI calculator']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-sky-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-stone-900">
                Macro calculator
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Calories</span>
                  <input name="calories" type="number" value={profile.calories} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
                <div className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Ratio split</span>
                  <p className="mt-1 text-base font-semibold text-stone-950">{profile.proteinRatio}% / {profile.carbsRatio}% / {profile.fatsRatio}%</p>
                </div>
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Protein %</span>
                  <input name="proteinRatio" type="number" value={profile.proteinRatio} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Carbs %</span>
                  <input name="carbsRatio" type="number" value={profile.carbsRatio} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3 sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Fats %</span>
                  <input name="fatsRatio" type="number" value={profile.fatsRatio} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
              </div>
              {macroIssues.length > 0 ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                  {macroIssues.map((issue) => (
                    <p key={issue}>{issue}</p>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white"><p className="text-xs uppercase tracking-[0.16em] text-stone-400">Protein</p><p className="mt-1 text-lg font-semibold">{macroResult.protein}g</p></div>
                <div className="rounded-xl bg-sky-200 p-3 text-stone-950"><p className="text-xs uppercase tracking-[0.16em] text-stone-700">Carbs</p><p className="mt-1 text-lg font-semibold">{macroResult.carbs}g</p></div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10"><p className="text-xs uppercase tracking-[0.16em] text-stone-500">Fats</p><p className="mt-1 text-lg font-semibold">{macroResult.fats}g</p></div>
              </div>
              <Link to={calculatorLinks['Macro calculator']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-purple-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-stone-900">
                BMR Calculator
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Calculate your Basal Metabolic Rate - the minimum calories needed for your body to function at rest.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Sex</span>
                  <select name="sex" value={profile.sex} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-purple-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">BMR</p>
                  <p className="mt-1 text-lg font-semibold">{bmrResult.bmr} kcal</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Daily resting</p>
                  <p className="mt-1 text-base font-semibold">Minimum needed</p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-indigo-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                TDEE Calculator
              </div>
              <p className="mt-4 text-base leading-7 text-stone-700">
                Calculate your Total Daily Energy Expenditure including activity level.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">BMR</p>
                  <p className="mt-1 text-lg font-semibold">{tdeeResult.bmr}</p>
                </div>
                <div className="rounded-xl bg-indigo-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">TDEE</p>
                  <p className="mt-1 text-lg font-semibold">{tdeeResult.tdee} kcal</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Activity</p>
                  <p className="mt-1 text-base font-semibold">{tdeeResult.activityLevel}</p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-pink-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Metabolic Age
              </div>
              <p className="mt-4 text-base leading-7 text-stone-700">
                Compare your metabolic rate to your actual age based on BMI.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Your age</p>
                  <p className="mt-1 text-lg font-semibold">{metabolicAgeResult.actual}</p>
                </div>
                <div className="rounded-xl bg-pink-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Metabolic age</p>
                  <p className="mt-1 text-lg font-semibold">{metabolicAgeResult.age}</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Difference</p>
                  <p className="mt-1 text-base font-semibold">{metabolicAgeResult.difference > 0 ? '+' : ''}{metabolicAgeResult.difference} yrs</p>
                </div>
              </div>
            </article>
              </div>
            </>
          )}

          {(activeFilter === 'all' || activeFilter === 'fitness') && (
            <>
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-stone-950 sm:text-3xl">Fitness & Workouts</h2>
                <p className="mt-2 text-sm text-stone-600">Training programs and exercise planning</p>
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-orange-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Calories Burned
              </div>
              <p className="mt-4 text-base leading-7 text-stone-700">
                Estimate calories burned during different types of exercises.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Duration (min)</span>
                  <input name="duration" type="number" value={profile.duration} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Exercise type</span>
                  <select name="exerciseType" value={profile.exerciseType} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none">
                    <option value="walking">Walking</option>
                    <option value="jogging">Jogging</option>
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="swimming">Swimming</option>
                    <option value="hiit">HIIT</option>
                    <option value="yoga">Yoga</option>
                    <option value="strength">Strength training</option>
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-orange-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Calories burned</p>
                  <p className="mt-1 text-lg font-semibold">{exerciseResult.calories}</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Exercise</p>
                  <p className="mt-1 text-base font-semibold capitalize">{profile.exerciseType}</p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-teal-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Step Calories
              </div>
              <p className="mt-4 text-base leading-7 text-stone-700">
                Calculate calories burned from walking and steps based on your stride length.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="rounded-xl border border-stone-900/10 bg-white/75 p-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Steps</span>
                  <input name="steps" type="number" value={profile.steps} onChange={updateField} className="mt-1 w-full bg-transparent text-base font-semibold text-stone-950 outline-none" />
                </label>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Calories</p>
                  <p className="mt-1 text-lg font-semibold">{stepResult.calories}</p>
                </div>
                <div className="rounded-xl bg-teal-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Distance</p>
                  <p className="mt-1 text-lg font-semibold">{stepResult.distanceKm} km</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-stone-950 border border-stone-900/10">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Steps</p>
                  <p className="mt-1 text-base font-semibold">{stepResult.steps.toLocaleString()}</p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-rose-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Workout planner
              </div>
              <p className="mt-4 text-base leading-7 text-stone-700">
                Select fitness level and goal first, then choose one of three
                workout combos: Chest & Triceps, Back & Biceps, or Legs &
                Shoulders.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Format</p>
                  <p className="mt-1 text-base font-semibold">Exercise cards</p>
                </div>
                <div className="rounded-xl bg-rose-200 p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Exercise count</p>
                  <p className="mt-1 text-base font-semibold">6 / 7 / 8</p>
                </div>
                <div className="rounded-xl border border-stone-900/10 bg-white p-3 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">GIF media</p>
                  <p className="mt-1 text-base font-semibold">Proxy URLs</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-stone-900/10 bg-white/75 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Selection flow</p>
                <p className="mt-1 text-base leading-7 text-stone-700">
                  The dedicated page shows category-specific exercise cards with
                  live GIF demonstrations, target muscles, sets, reps, and rest time.
                </p>
              </div>
              <Link to={calculatorLinks['Workout planner']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>
              </div>
            </>
          )}

          {(activeFilter === 'all' || activeFilter === 'health') && (
            <>
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-stone-950 sm:text-3xl">Health Metrics</h2>
                <p className="mt-2 text-sm text-stone-600">Quick reference tools and health insights</p>
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-cyan-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Water intake
              </div>
              <p className="mt-4 text-base leading-7 text-stone-700">
                Estimate daily hydration targets based on weight and activity level.
              </p>
              <Link to={calculatorLinks['Water intake']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-emerald-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Ideal weight
              </div>
              <p className="mt-4 text-base leading-7 text-stone-700">
                Show a healthy reference range and midpoint based on height.
              </p>
              <Link to={calculatorLinks['Ideal weight']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>

            <article className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm">
              <div className="inline-flex rounded-lg bg-rose-200 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                Body fat estimator
              </div>
              <p className="mt-4 text-base leading-7 text-stone-700">
                Provide a rough body fat estimate from age, BMI-related inputs, and sex.
              </p>
              <Link to={calculatorLinks['Body fat estimator']} className="mt-4 inline-flex rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-100">
                Open page
              </Link>
            </article>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
        <div className="rounded-xl border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,239,226,0.92))] p-5 shadow-sm sm:p-5">
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

        <div className="rounded-xl border border-stone-900/10 bg-stone-900 p-5 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.18)] sm:p-5">
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
