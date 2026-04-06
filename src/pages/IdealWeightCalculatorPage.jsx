import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { calculateIdealWeight, cmToFeetInches, feetInchesToCm, validateBodyMetrics } from '../lib/calculatorUtils.js'

function UnitToggle({ unitSystem, setUnitSystem }) {
  return (
    <div className="mb-6 inline-flex rounded-full border border-stone-300 bg-white p-1">
      <button type="button" onClick={() => setUnitSystem('metric')} className={`rounded-full px-4 py-2 text-sm font-semibold ${unitSystem === 'metric' ? 'bg-stone-900 text-white' : 'text-stone-700'}`}>Metric</button>
      <button type="button" onClick={() => setUnitSystem('imperial')} className={`rounded-full px-4 py-2 text-sm font-semibold ${unitSystem === 'imperial' ? 'bg-stone-900 text-white' : 'text-stone-700'}`}>Imperial</button>
    </div>
  )
}

function IdealWeightCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState('metric')
  const [form, setForm] = useState({ height: 178 })
  const imperialHeight = useMemo(() => cmToFeetInches(form.height), [form.height])
  function updateHeightMetric(event) { setForm((current) => ({ ...current, height: event.target.value })) }
  function updateHeightImperial(part, value) { const nextFeet = part === 'feet' ? value : imperialHeight.feet; const nextInches = part === 'inches' ? value : imperialHeight.inches; setForm((current) => ({ ...current, height: feetInchesToCm(nextFeet, nextInches).toFixed(2) })) }
  const result = useMemo(() => calculateIdealWeight(form), [form])
  const issues = useMemo(() => validateBodyMetrics({ age: 30, weight: 70, height: form.height }), [form.height])

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-24 lg:pt-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">Calculator detail</p>
          <h1 className="mt-4 font-['Georgia'] text-5xl font-bold tracking-tight text-stone-950 md:text-7xl">Ideal weight calculator</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">Give users a simple healthy weight reference range based on height.</p>
          <div className="mt-8"><Link to="/calculators" className="rounded-full border border-stone-400/60 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-900">Back to calculators</Link></div>
        </div>
        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
          <UnitToggle unitSystem={unitSystem} setUnitSystem={setUnitSystem} />
          {unitSystem === 'metric' ? (
            <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4 block"><span className="text-xs uppercase tracking-[0.16em] text-stone-500">Height (cm)</span><input type="number" value={form.height} onChange={updateHeightMetric} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" /></label>
          ) : (
            <div className="rounded-2xl border border-stone-900/10 bg-white/75 p-4"><span className="text-xs uppercase tracking-[0.16em] text-stone-500">Height (ft-in)</span><div className="mt-2 grid grid-cols-2 gap-3"><input type="number" value={imperialHeight.feet} onChange={(event) => updateHeightImperial('feet', event.target.value)} className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" /><input type="number" value={imperialHeight.inches} onChange={(event) => updateHeightImperial('inches', event.target.value)} className="w-full bg-transparent text-lg font-semibold text-stone-950 outline-none" /></div></div>
          )}
          {issues.length > 0 ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{issues.map((issue) => <p key={issue}>{issue}</p>)}</div> : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-stone-900 p-5 text-white"><p className="text-xs uppercase tracking-[0.16em] text-stone-400">Target</p><p className="mt-2 text-3xl font-semibold">{result.target}</p></div>
            <div className="rounded-2xl bg-emerald-200 p-5 text-stone-950"><p className="text-xs uppercase tracking-[0.16em] text-stone-700">Healthy range</p><p className="mt-2 text-xl font-semibold">{result.range}</p></div>
            <div className="rounded-2xl border border-stone-900/10 bg-white p-5 text-stone-700"><p className="text-xs uppercase tracking-[0.16em] text-stone-500">Note</p><p className="mt-2 text-sm leading-6">{result.note}</p></div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default IdealWeightCalculatorPage
