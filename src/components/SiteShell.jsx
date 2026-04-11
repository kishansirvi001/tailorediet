import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ChatWidget from './ChatWidget.jsx'

// -------------------- Icons -------------------- //
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
      <path
        d="m4 8 8 5 8-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

// -------------------- Navigation Item -------------------- //
function NavItem({ label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-3 text-sm font-semibold uppercase tracking-wider transition ${
          isActive
            ? 'text-amber-600 bg-amber-50 rounded-lg'
            : 'text-stone-700 hover:bg-stone-100 rounded-lg'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

// -------------------- Main Layout -------------------- //
function SiteShell({ children }) {
  const { isAuthenticated, user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Calculators', to: '/calculators' },
    { label: 'Workout Planner', to: '/workout-planner' },
    { label: 'Diet Plans', to: '/diet-plans' },
    { label: 'Chat', to: '/chat' },
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

  return (
    <div className="min-h-screen bg-[#fffaf1] text-stone-800">
      {/* -------------------- Header -------------------- */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-white font-bold">
              TD
            </span>
            <span className="text-xl font-bold text-stone-900">TailorDiet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <NavItem key={link.label} {...link} />
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-semibold text-stone-300">
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-stone-300 hover:text-stone-300"
                >
                  Log out
                </button>
                <Link
                  to="/account"
                  className="rounded-lg bg-gradient-to-r from-amber-400 to-orange-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-stone-600">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-gradient-to-r from-amber-400 to-orange-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* -------------------- Mobile Menu -------------------- */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } md:hidden`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navLinks.map((link) => (
            <NavItem
              key={link.label}
              {...link}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </nav>

        <div className="border-t p-4 space-y-3">
          {isAuthenticated ? (
            <>
              <span className="block text-center font-semibold text-stone-700">
                {user?.name}
              </span>
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center rounded-lg bg-amber-500 text-white px-4 py-2 font-semibold"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full rounded-lg border px-4 py-2 font-semibold"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center rounded-lg border px-4 py-2 font-semibold"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center rounded-lg bg-amber-500 text-white px-4 py-2 font-semibold"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* -------------------- Main Content -------------------- */}
      <main>{children}</main>

      {/* Floating chat widget */}
      <ChatWidget />

      {/* -------------------- Footer -------------------- */}
      <footer className="border-t bg-stone-900 text-stone-300 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold">&copy; 2026 TailorDiet</p>
              <p className="text-xs text-stone-400">Built with ❤️ for healthier living</p>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/" className="text-sm text-stone-300 hover:text-white">Home</Link>
              <Link to="/calculators" className="text-sm text-stone-300 hover:text-white">Calculators</Link>
              <Link to="/workout-planner" className="text-sm text-stone-300 hover:text-white">Workout Planner</Link>
              <Link to="/diet-plans" className="text-sm text-stone-300 hover:text-white">Diet Plans</Link>
              <Link to="/signup" className="text-sm text-stone-300 hover:text-white">Join</Link>
            </nav>

            <div className="flex items-center gap-3 justify-center md:justify-end">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-stone-300 hover:text-white"
                    aria-label={s.label}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{s.value}</span>
                  </a>
                )
              })}
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-stone-500">
            <a href="/privacy" className="underline hover:text-white mr-3">Privacy</a>
            <a href="/terms" className="underline hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SiteShell