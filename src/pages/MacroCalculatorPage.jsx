import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { calculateMacros, validateMacroInputs } from '../lib/calculatorUtils.js'

function MacroCalculatorPage() {
  const [form, setForm] = useState({
    calories: 2230,
    proteinRatio: 30,
    carbsRatio: 45,
    fatsRatio: 25,
  })

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const result = useMemo(() => calculateMacros(form), [form])
  const issues = useMemo(() => validateMacroInputs(form), [form])

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-24 lg:pt-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Calculator detail
          </p>
          <h1 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl md:text-7xl">
            Macro calculator
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Convert calorie targets into grams of protein, carbohydrates, and
            fats with a dedicated macro planning page.
          </p>
          <div className="mt-8">
            <Link
              to="/calculators"
              className="rounded-full border border-stone-400/60 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-900"
            >
              Back to calculators
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-5 shadow-sm sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Calories</span>
              <input name="calories" type="number" value={form.calories} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
            </label>
            <div className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Ratio split</span>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {form.proteinRatio}% / {form.carbsRatio}% / {form.fatsRatio}%
              </p>
            </div>
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Protein %</span>
              <input name="proteinRatio" type="number" value={form.proteinRatio} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
            </label>
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Carbs %</span>
              <input name="carbsRatio" type="number" value={form.carbsRatio} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
            </label>
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Fats %</span>
              <input name="fatsRatio" type="number" value={form.fatsRatio} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" />
            </label>
          </div>

          {issues.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {issues.map((issue) => (
                <p key={issue}>{issue}</p>
              ))}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-stone-900 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Protein</p>
              <p className="mt-2 text-3xl font-semibold">{result.protein}g</p>
            </div>
            <div className="rounded-2xl bg-sky-200 p-5 text-stone-950">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Carbs</p>
              <p className="mt-2 text-3xl font-semibold">{result.carbs}g</p>
            </div>
            <div className="rounded-2xl border border-stone-900/10 bg-white p-5 text-stone-950">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Fats</p>
              <p className="mt-2 text-3xl font-semibold">{result.fats}g</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default MacroCalculatorPage
