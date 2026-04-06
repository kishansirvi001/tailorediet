import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { activityOptions } from '../lib/calculatorData.js'
import { calculateWaterIntake, kgToLb, lbToKg, validateBodyMetrics } from '../lib/calculatorUtils.js'

function UnitToggle({ unitSystem, setUnitSystem }) {
  return (
    <div className="mb-6 inline-flex rounded-full border border-stone-300 bg-white p-1">
      <button type="button" onClick={() => setUnitSystem('metric')} className={`rounded-full px-4 py-2 text-sm font-semibold ${unitSystem === 'metric' ? 'bg-stone-900 text-white' : 'text-stone-700'}`}>Metric</button>
      <button type="button" onClick={() => setUnitSystem('imperial')} className={`rounded-full px-4 py-2 text-sm font-semibold ${unitSystem === 'imperial' ? 'bg-stone-900 text-white' : 'text-stone-700'}`}>Imperial</button>
    </div>
  )
}

function WaterIntakeCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState('metric')
  const [form, setForm] = useState({ weight: 78, activity: 'moderate' })
  function updateField(event) { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })) }
  function updateWeight(event) { setForm((current) => ({ ...current, weight: unitSystem === 'metric' ? event.target.value : lbToKg(event.target.value).toFixed(2) })) }
  const result = useMemo(() => calculateWaterIntake(form), [form])
  const issues = useMemo(() => validateBodyMetrics({ age: 30, weight: form.weight, height: 170 }), [form.weight])

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-24 lg:pt-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">Calculator detail</p>
          <h1 className="mt-4 font-['Georgia'] text-5xl font-bold tracking-tight text-stone-950 md:text-7xl">Water intake calculator</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">Estimate daily hydration needs from body weight and activity level.</p>
          <div className="mt-8"><Link to="/calculators" className="rounded-full border border-stone-400/60 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-900">Back to calculators</Link></div>
        </div>
        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
          <UnitToggle unitSystem={unitSystem} setUnitSystem={setUnitSystem} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4"><span className="text-xs uppercase tracking-[0.16em] text-stone-500">Weight ({unitSystem === 'metric' ? 'kg' : 'lb'})</span><input type="number" value={unitSystem === 'metric' ? form.weight : kgToLb(form.weight)} onChange={updateWeight} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" /></label>
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4"><span className="text-xs uppercase tracking-[0.16em] text-stone-500">Activity</span><select name="activity" value={form.activity} onChange={updateField} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">{activityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </div>
          {issues.length > 0 ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{issues.map((issue) => <p key={issue}>{issue}</p>)}</div> : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-stone-900 p-5 text-white"><p className="text-xs uppercase tracking-[0.16em] text-stone-400">Liters</p><p className="mt-2 text-3xl font-semibold">{result.liters} L</p></div>
            <div className="rounded-2xl bg-cyan-200 p-5 text-stone-950"><p className="text-xs uppercase tracking-[0.16em] text-stone-700">Glasses</p><p className="mt-2 text-3xl font-semibold">{result.glasses}</p></div>
            <div className="rounded-2xl border border-stone-900/10 bg-white p-5 text-stone-700"><p className="text-xs uppercase tracking-[0.16em] text-stone-500">Note</p><p className="mt-2 text-sm leading-6">{result.note}</p></div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default WaterIntakeCalculatorPage
