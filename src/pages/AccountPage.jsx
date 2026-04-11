import { Link, Navigate } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function AccountPage() {
  const { isLoading, isAuthenticated, logout, user } = useAuth()
  const birthDateLabel = user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not added'

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,239,226,0.92))] p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Your account
            </p>
          <h1 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
              Welcome back, {user?.name || 'TailorDiet member'}.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
              Your profile is ready to power future meal planning, goal tracking,
              and saved calculator history.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Primary goal
                </p>
                <p className="mt-3 text-2xl font-semibold text-stone-950">{user?.goal}</p>
              </div>
              <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Diet style
                </p>
                <p className="mt-3 text-2xl font-semibold text-stone-950">{user?.dietStyle}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/calculators"
                className="rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(249,115,22,0.28)]"
              >
                Open calculators
              </Link>
              <Link
                to="/meal-scanner"
                className="rounded-full border border-stone-300 bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-stone-900 transition hover:border-amber-300 hover:bg-amber-50"
              >
                Scan a meal
              </Link>
              <Link
                to="/workout-planner"
                className="rounded-full border border-stone-300 bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-stone-900 transition hover:border-rose-300 hover:bg-rose-50"
              >
                Workout planner
              </Link>
              <Link
                to="/diet-plans"
                className="rounded-full border border-stone-300 bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-stone-900 transition hover:border-stone-500 hover:bg-stone-50"
              >
                View diet plans
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-stone-900/10 bg-white p-6 text-stone-800 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200/70">
              Profile details
            </p>
            <div className="mt-8 space-y-5">
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Full name</p>
                <p className="mt-2 text-lg font-semibold text-stone-800">{user?.name}</p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Email</p>
                <p className="mt-2 text-lg font-semibold break-all text-stone-800">
                  {user?.email || 'Not added'}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Mobile</p>
                <p className="mt-2 text-lg font-semibold text-stone-800">
                  {user?.mobileNumber || 'Not added'}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Date of birth</p>
                <p className="mt-2 text-lg font-semibold text-stone-800">{birthDateLabel}</p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Joined</p>
                <p className="mt-2 text-lg font-semibold text-stone-800">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'Recently'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-md transition hover:opacity-95"
            >
              Log out
            </button>
          </aside>
        </div>
      </section>
    </SiteShell>
  )
}

export default AccountPage
