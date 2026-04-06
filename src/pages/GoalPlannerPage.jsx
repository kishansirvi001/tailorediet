import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { goalOptions } from '../lib/calculatorData.js'
import { calculateCalories, getGoalOption } from '../lib/calculatorUtils.js'

function GoalPlannerPage() {
  const [goal, setGoal] = useState('muscle-gain')

  const goalInfo = useMemo(() => getGoalOption(goal), [goal])
  const calorieInfo = useMemo(
    () =>
      calculateCalories({
        age: 29,
        weight: 78,
        height: 178,
        activity: 'moderate',
        goal,
      }),
    [goal],
  )

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-24 lg:pt-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Calculator detail
          </p>
          <h1 className="mt-4 font-['Georgia'] text-5xl font-bold tracking-tight text-stone-950 md:text-7xl">
            Goal planner
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Set a nutrition direction for weight loss, maintenance, or muscle
            gain, then use that result to steer diet plans and meal structure.
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

        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm">
          <label className="rounded-2xl border border-stone-900/10 bg-white/75 p-4 block">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-500">Goal</span>
            <select value={goal} onChange={(event) => setGoal(event.target.value)} className="mt-2 w-full bg-transparent text-lg font-semibold text-stone-950 outline-none">
              {goalOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-stone-900 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Pace</p>
              <p className="mt-2 text-xl font-semibold">{goalInfo.pace}</p>
            </div>
            <div className="rounded-2xl bg-rose-200 p-5 text-stone-950">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Suggested intake</p>
              <p className="mt-2 text-xl font-semibold">{calorieInfo.target} kcal / day</p>
            </div>
            <div className="rounded-2xl border border-stone-900/10 bg-white p-5 text-stone-950">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Goal</p>
              <p className="mt-2 text-xl font-semibold">{goalInfo.label}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-stone-900/10 bg-white/75 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Plan direction</p>
            <p className="mt-2 text-base leading-7 text-stone-700">{goalInfo.direction}</p>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default GoalPlannerPage
