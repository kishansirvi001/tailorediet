import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'

const features = [
  {
    title: 'Health calculators',
    description:
      'Offer calorie, BMI, macro, and goal-based nutrition calculators that guide users without overwhelming them.',
  },
  {
    title: 'Personalized diet plans',
    description:
      'Build tailored plans for vegan, keto, weight loss, maintenance, and muscle gain journeys.',
  },
  {
    title: 'Structured guidance',
    description:
      'Turn health inputs into a clearer diet direction so users know what plan style fits them best.',
  },
]

const stats = [
  { value: '4 core', label: 'health calculators in one product' },
  { value: '5 plan types', label: 'for different dietary goals' },
  { value: '7-day', label: 'personalized plan structure' },
]

const plannerCards = [
  {
    title: 'Calorie calculator',
    subtitle: 'Estimate daily energy needs with age, height, weight, and activity inputs.',
  },
  {
    title: 'Macro planner',
    subtitle: 'Translate goals into protein, carbs, and fat ranges that feel practical.',
  },
  {
    title: 'Diet plans',
    subtitle: 'Surface vegan, keto, weight loss, and muscle gain plan options instantly.',
  },
]

function metricCardTone(index) {
  return ['bg-amber-200', 'bg-lime-200', 'bg-sky-200'][index % 3]
}

function HomePage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24 lg:pt-20">
        <div className="relative">
          <div className="inline-flex items-center gap-3 rounded-full border border-stone-900/10 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
              Health calculators • personalized diet plans • focused nutrition guidance
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl font-['Georgia'] text-5xl font-bold leading-[0.92] tracking-tight text-stone-950 md:text-7xl">
            A focused nutrition platform built around health calculators and personalized diet planning.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 md:text-xl">
            TailorDiet is positioned as a clean diet planning product where users
            discover calorie and BMI tools, explore macro guidance, and move into
            tailored meal plans designed for their specific goals and food styles.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="rounded-full bg-stone-900 px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-amber-100 transition hover:bg-stone-700"
            >
              Create account
            </Link>
            <a
              href="#features"
              className="rounded-full border border-stone-400/60 bg-white/80 px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-stone-900 backdrop-blur transition hover:border-stone-600 hover:bg-white"
            >
              Explore features
            </a>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.75rem] border border-stone-900/10 bg-white/70 p-5 shadow-sm backdrop-blur"
              >
                <p className="text-3xl font-bold text-stone-950">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-10 hidden h-36 w-36 rounded-full bg-amber-200/40 blur-3xl lg:block" />
          <div className="relative overflow-hidden rounded-[2.2rem] border border-stone-900/10 bg-stone-950 p-6 text-stone-100 shadow-[0_40px_90px_rgba(28,25,23,0.22)]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">
                    Product overview
                  </p>
                  <p className="mt-2 text-xl font-semibold">Health profile toolkit</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-200">
                  TailorDiet
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Calculator set</p>
                  <p className="mt-3 text-lg font-semibold text-white">Calories, BMI, macros, goals</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Diet tracks</p>
                  <p className="mt-3 text-lg font-semibold text-white">Balanced, vegan, keto, muscle gain</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Planner focus</p>
                  <p className="mt-3 text-lg font-semibold text-white">Weekly diet structure and goal-based planning</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Plan direction</p>
                  <p className="mt-3 text-lg font-semibold text-white">Weight loss, maintenance, muscle gain, vegan, keto</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {plannerCards.map((card, index) => (
                <div
                  key={card.title}
                  className={`rounded-[1.4rem] ${metricCardTone(index)} p-5 text-stone-950`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-700">
                    Core module
                  </p>
                  <p className="mt-3 text-2xl font-semibold">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{card.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-stone-900/10 bg-white/70 py-20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Product sections
            </p>
            <h2 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 md:text-5xl">
              The homepage now clearly frames TailorDiet as a planning product, not a generic wellness site.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-8 shadow-sm"
              >
                <span className="inline-flex rounded-full bg-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
                  0{index + 1}
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-stone-950">{feature.title}</h3>
                <p className="mt-4 text-base leading-7 text-stone-700">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,239,226,0.92))] p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                Personalized planning
              </p>
              <h2 className="mt-3 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950">
                Diet plans should feel tailored from the very first recommendation.
              </h2>
            </div>
            <div className="rounded-full bg-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
              Built around goals
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {plannerCards.map((card, index) => (
              <div
                key={card.title}
                className="rounded-[1.5rem] border border-stone-900/10 bg-white/85 p-5"
              >
                <div className={`inline-flex rounded-full ${metricCardTone(index)} px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900`}>
                  Plan block
                </div>
                <p className="mt-4 text-2xl font-semibold text-stone-950">{card.title}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-stone-900 p-8 text-stone-100 shadow-[0_35px_80px_rgba(28,25,23,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
            Plan outcomes
          </p>
          <h2 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-white">
            Help users understand what each nutrition path is designed to support.
          </h2>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Weight loss plans</p>
                <p className="mt-2 text-lg font-semibold text-white">Lower calories, higher satiety, steady deficit support.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Maintenance plans</p>
                <p className="mt-2 text-lg font-semibold text-white">Balanced meals and sustainable daily energy targets.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Muscle gain plans</p>
                <p className="mt-2 text-lg font-semibold text-white">Higher protein, structured surplus, and recovery-focused nutrition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto px-6 pb-20 lg:max-w-7xl lg:px-10">
        <div className="rounded-[2.25rem] border border-stone-900/10 bg-[linear-gradient(120deg,rgba(28,25,23,0.98),rgba(68,64,60,0.96))] px-8 py-10 text-white shadow-[0_40px_90px_rgba(28,25,23,0.18)] lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200/70">
              Ready for the next step
            </p>
            <h2 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight">
              Turn TailorDiet into a trusted destination for health calculators and personalized diet guidance.
            </h2>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0">
            <Link
              to="/signup"
              className="rounded-full bg-amber-300 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-stone-950 transition hover:bg-amber-200"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/20 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default HomePage
