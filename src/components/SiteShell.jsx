import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.35" cy="6.65" r="1.1" fill="currentColor" />
    </svg>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6.75h16a1.25 1.25 0 0 1 1.25 1.25v8A1.25 1.25 0 0 1 20 17.25H4A1.25 1.25 0 0 1 2.75 16V8A1.25 1.25 0 0 1 4 6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m4 8 8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function NavItem({ label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] transition ${
          isActive
            ? 'bg-stone-150 text-amber-100 shadow-[0_12px_30px_rgba(28,25,23,0.14)]'
            : 'text-stone-150 hover:bg-stone-150/5 hover:text-stone-150'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

function SiteShell({ children }) {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Calculators', to: '/calculators' },
    { label: 'Diet Plans', to: '/diet-plans' },
    ...(isAuthenticated ? [{ label: 'Account', to: '/account' }] : []),
  ]

  const socialLinks = [
    {
      label: 'Instagram',
      value: '@kishansirvi_',
      href: 'https://www.instagram.com/kishansirvi_/',
      icon: InstagramIcon,
    },
    {
      label: 'Email',
      value: 'kishansirvi001@gmail.com',
      href: 'mailto:kishansirvi001@gmail.com',
      icon: MailIcon,
    },
  ]

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_24%),radial-gradient(circle_at_88%_12%,_rgba(16,185,129,0.16),_transparent_30%),linear-gradient(180deg,_#f7f0e1_0%,_#fffaf1_38%,_#f5f1e8_100%)] text-stone-150">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(135deg,rgba(120,53,15,0.1),rgba(5,150,105,0.08))]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-16 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-200/15 blur-3xl" />

      <header className="sticky top-0 z-30 border-b border-stone-900/10 bg-white/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1c1917,#44403c)] text-base font-bold text-amber-100 shadow-[0_14px_28px_rgba(28,25,23,0.18)] sm:h-11 sm:w-11 sm:text-lg">
              TD
            </span>
            <span>
              <span className="block font-['Georgia'] text-xl font-bold tracking-tight text-stone-950 sm:text-2xl">
                TailorDiet
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 sm:block">
                Smarter Nutrition Planning
              </span>
            </span>
          </Link>

          <nav className="hidden items-center rounded-full border border-white/70 bg-white/72 p-2 shadow-[0_16px_35px_rgba(28,25,23,0.08)] md:flex">
            {navLinks.map((link) => (
              <NavItem key={link.label} label={link.label} to={link.to} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <span className="rounded-full border border-stone-150/10 bg-white/70 px-4 py-2 text-sm font-semibold text-stone-150">
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-150 transition hover:border-stone-500 hover:bg-stone-100"
                >
                  Log out
                </button>
                <Link
                  to="/account"
                  className="rounded-full bg-[linear-gradient(135deg,#1c1917,#44403c)] px-5 py-2 text-sm font-semibold text-amber-100 shadow-[0_14px_30px_rgba(28,25,23,0.15)] transition hover:translate-y-[-1px]"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-800 transition hover:border-stone-500 hover:bg-stone-100"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-[linear-gradient(135deg,#111827,#1f2937)] px-5 py-2 text-sm font-semibold text-amber-100 shadow-[0_14px_30px_rgba(17,24,39,0.15)] transition hover:translate-y-[-1px]"
                >
                  Start free
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-900/10 bg-white/80 text-stone-150 shadow-sm transition hover:bg-white md:hidden"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-stone-150/10 bg-white/94 px-4 py-4 shadow-[0_18px_45px_rgba(28,25,23,0.08)] backdrop-blur md:hidden">
            <div className="mx-auto max-w-7xl space-y-3">
              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <NavItem
                    key={link.label}
                    label={link.label}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>

              <div className="border-t border-stone-150/10 pt-3">
                {isAuthenticated ? (
                  <div className="grid gap-2">
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl bg-[linear-gradient(135deg,#111827,#1f2937)] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-amber-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                      className="rounded-2xl border border-stone-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-800 transition hover:border-stone-500 hover:bg-stone-100"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl bg-[linear-gradient(135deg,#111827,#1f2937)] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-amber-100"
                    >
                      Start free
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl border border-stone-300 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-stone-150 transition hover:border-stone-500 hover:bg-stone-100"
                    >
                      Log in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="relative border-t border-stone-150/10 bg-[linear-gradient(180deg,_#120f0b_0%,_#1a140f_100%)] text-stone-300">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(252,211,77,0.7),transparent)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_0.8fr_0.9fr] lg:px-10">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/15 bg-white/5 px-4 py-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300 text-sm font-bold text-stone-150">
                TD
              </span>
              <span className="font-['Georgia'] text-2xl font-bold text-amber-100">TailorDiet</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">
              Premium-feeling calorie planning, health calculators, and diet guidance built to turn scattered nutrition effort into a clear, sustainable routine.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              <span className="rounded-full border border-white/10 px-3 py-2">Calorie Goals</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Diet Plans</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Health Tools</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Navigate
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <Link to="/" className="block transition hover:text-white">
                Home
              </Link>
              <Link to="/calculators" className="block transition hover:text-white">
                Health Calculators
              </Link>
              <Link to="/diet-plans" className="block transition hover:text-white">
                Diet Plans
              </Link>
              {isAuthenticated ? (
                <Link to="/account" className="block transition hover:text-white">
                  Account
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="block transition hover:text-white">
                    Sign Up
                  </Link>
                  <Link to="/login" className="block transition hover:text-white">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Connect
            </p>
            <div className="mt-4 space-y-3">
              {socialLinks.map((link) => {
                const Icon = link.icon

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-amber-200/40 hover:bg-white/8 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-amber-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-stone-100">{link.label}</span>
                        <span className="block text-xs text-stone-400">{link.value}</span>
                      </span>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Open</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-stone-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <p>&copy; 2026 TailorDiet. Personalized nutrition starts with consistency.</p>
            <p>Designed for everyday fitness goals and sustainable diet planning.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SiteShell