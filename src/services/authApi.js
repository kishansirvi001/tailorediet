function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL
  if (envUrl) return envUrl
  
  // Auto-detect for Render or production
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname === 'tailorediet.onrender.com') {
      return 'https://tailorediet.onrender.com'
    }
  }
  
  return ''
}

const API_BASE_URL = getApiBaseUrl()

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Something went wrong.')
  }

  return payload
}

function createAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function requestSignupOtp(formData) {
  const payload = await apiRequest('/api/auth/signup/request-otp', {
    method: 'POST',
    body: JSON.stringify(formData),
  })

  return payload
}

export async function verifySignupOtpRequest(formData) {
  const payload = await apiRequest('/api/auth/signup/verify-otp', {
    method: 'POST',
    body: JSON.stringify(formData),
  })

  return { token: payload.token, user: payload.user }
}

export async function loginRequest(formData) {
  const payload = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(formData),
  })

  return { token: payload.token, user: payload.user }
}

export async function fetchCurrentUser(token) {
  const payload = await apiRequest('/api/auth/me', {
    headers: createAuthHeaders(token),
  })

  return payload.user
}

export async function logoutRequest(token) {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
    headers: createAuthHeaders(token),
  })
}
