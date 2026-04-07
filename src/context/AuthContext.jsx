import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  signupRequest,
} from '../services/authApi.js'

const AUTH_STORAGE_KEY = 'tailordiet.auth'
const AuthContext = createContext(null)

function readStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

function persistSession(session) {
  if (typeof window === 'undefined') {
    return
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession())
  const [isLoading, setIsLoading] = useState(() => Boolean(readStoredSession()?.token))
  const token = session?.token ?? null

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const user = await fetchCurrentUser(token)

        if (isMounted) {
          const nextSession = { token, user }
          setSession(nextSession)
          persistSession(nextSession)
        }
      } catch {
        if (isMounted) {
          setSession(null)
          persistSession(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [token])

  const signup = useCallback(async (formData) => {
    const nextSession = await signupRequest(formData)
    setSession(nextSession)
    persistSession(nextSession)
    return nextSession.user
  }, [])

  const login = useCallback(async (formData) => {
    const nextSession = await loginRequest(formData)
    setSession(nextSession)
    persistSession(nextSession)
    return nextSession.user
  }, [])

  const logout = useCallback(async () => {
    const currentToken = token
    setSession(null)
    persistSession(null)

    if (currentToken) {
      try {
        await logoutRequest(currentToken)
      } catch {
        // Ignore logout errors because the local session is already cleared.
      }
    }
  }, [token])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token,
      isAuthenticated: Boolean(token && session?.user),
      isLoading,
      signup,
      login,
      logout,
    }),
    [isLoading, login, logout, session, signup, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
