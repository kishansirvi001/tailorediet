import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { activityOptions } from '../lib/calculatorData.js'
import { calculateCalorieSurplus, validateBodyMetrics } from '../lib/calculatorUtils.js'

function CalorieSurplusCalculatorPage() {
  const [form, setForm] = useState({
    age: 29,
    weight: 78,
    height: 178,
    activity: 'moderate',
    surplus: 280,
  })

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const result = useMemo(() => calculateCalorieSurplus(form), [form])
  const issues = useMemo(() => validateBodyMetrics(form), [form])

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-24 lg:pt-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">Calculator detail</p>
          <h1 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl md:text-7xl">
            Calorie surplus calculator
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg md:leading-8">
            Estimate a daily calorie target for muscle gain or weight gain by adding a measured surplus to maintenance intake.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link to="/calculators" className="rounded-full border border-stone-400/60 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-900">
              Back to calculators
            </Link>
            <Link to="/diet-plans" className="rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
              View diet plans
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Age</span>
              <input name="age" type="number" value={form.age} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
            </label>
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Weight (kg)</span>
              <input name="weight" type="number" value={form.weight} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
            </label>
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Height (cm)</span>
              <input name="height" type="number" value={form.height} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
            </label>
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Activity</span>
              <select name="activity" value={form.activity} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
                {activityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Surplus (kcal / day)</span>
              <input name="surplus" type="number" value={form.surplus} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
            </label>
          </div>

          {issues.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {issues.map((issue) => <p key={issue}>{issue}</p>)}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-stone-900 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Maintenance</p>
              <p className="mt-2 text-3xl font-semibold">{result.maintenance}</p>
            </div>
            <div className="rounded-2xl bg-emerald-200 p-5 text-stone-950">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Surplus</p>
              <p className="mt-2 text-3xl font-semibold">{result.surplus}</p>
            </div>
            <div className="rounded-2xl bg-amber-200 p-5 text-stone-950">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Target calories</p>
              <p className="mt-2 text-3xl font-semibold">{result.target}</p>
            </div>
            <div className="rounded-2xl border border-stone-900/10 bg-white p-5 text-stone-950">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Estimated pace</p>
              <p className="mt-2 text-lg font-semibold">{result.weeklyChange}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-stone-900/10 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Suggested range</p>
            <p className="mt-2 text-xl font-semibold text-stone-950">{result.range}</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              A modest surplus usually works best for leaner gains, better training output, and less unnecessary fat gain.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default CalorieSurplusCalculatorPage
