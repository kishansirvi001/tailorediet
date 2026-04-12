import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { Calculator, Utensils, ClipboardList, Dumbbell } from 'lucide-react'

// Feature definitions with icons
const features = [
  {
    title: 'Health calculators',
    description:
      'Offer calorie, BMI, macro, and goal-based nutrition calculators that guide users without overwhelming them.',
    icon: Calculator,
  },
  {
    title: 'Personalized diet plans',
    description:
      'Build tailored plans for vegan, keto, weight loss, maintenance, and muscle gain journeys.',
    icon: Utensils,
  },
  {
    title: 'Structured guidance',
    description:
      'Turn health inputs into a clearer diet direction so users know what plan style fits them best.',
    icon: ClipboardList,
  },
  {
    title: 'Workout planner',
    description:
      'Choose a muscle combo and get guided workout cards with common gym exercises, prescriptions, and real GIFs.',
    icon: Dumbbell,
  },
]

// Trust statistics
const stats = [
  { value: '4+', label: 'Health Calculators' },
  { value: '5', label: 'Diet Plan Types' },
  { value: '3', label: 'Workout Combos' },
]

function HomePage() {
  return (
    <SiteShell>
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-12">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-stone-900/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700 shadow-sm backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Personalized Nutrition & Fitness
            </div>

            <h1 className="mt-3 font-['Georgia'] text-2xl font-bold leading-snug tracking-tight text-stone-950 sm:text-3xl">
              Achieve Your Fitness Goals with Tailored Diet and Workout Plans
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-5 text-stone-700">
              From confusion to clarity—get the exact nutrition and workout guidance your body needs.
              Calculate calories, plan macros, explore personalized diet plans, and follow guided workouts—all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="relative z-10 mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-center text-sm font-bold uppercase tracking-[0.15em] text-stone-950 shadow-md transition hover:from-amber-300 hover:to-amber-400"
              >
                Start Free
              </Link>

              <Link
                to="/calculators"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.15em] text-stone-900 transition hover:bg-stone-100"
              >
                Explore Calculators
              </Link>

              <Link
                to="/workout-planner"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.15em] text-stone-900 transition hover:bg-stone-100"
              >
                Workout Planner
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 hidden sm:grid max-w-md grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-stone-900/10 bg-white/80 p-4 text-center shadow-sm backdrop-blur"
                >
                  <p className="text-xl font-bold text-stone-950">{stat.value}</p>
                  <p className="text-xs text-stone-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Feature Highlight Card */}
          <div className="relative">
            <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-4 text-white shadow-[0_24px_60px_rgba(28,25,23,0.18)]">
              <h3 className="text-xl font-semibold">Health Profile Toolkit</h3>
              <p className="mt-2 text-stone-300">
                Everything you need to plan your nutrition and workouts in one place.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.title} className="rounded-xl bg-white/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 text-stone-950">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="font-semibold">{feature.title}</p>
                      </div>
                      <p className="mt-2 text-sm text-stone-300">
                        {feature.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= END HERO SECTION ================= */}

      {/* ================= FEATURES SECTION ================= */}
      <section
        id="features"
        className="border-y border-stone-900/10 bg-white/70 py-16 backdrop-blur sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Product sections
            </p>
            <h2 className="mt-4 font-['Georgia'] text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Everything you need for smarter nutrition and fitness planning.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  className="rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-stone-900 text-amber-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 inline-flex rounded-full bg-stone-900 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-stone-950">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-700">
                    {feature.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
      {/* ================= END FEATURES SECTION ================= */}
    </SiteShell>
  )
}

export default HomePage
