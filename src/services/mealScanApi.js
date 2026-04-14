function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL
  if (envUrl) return envUrl

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname

    if (hostname === 'www.tailorediet.com' || hostname === 'tailorediet.com') {
      return 'https://tailorediet.onrender.com'
    }

    if (hostname === 'tailorediet.onrender.com') {
      return 'https://tailorediet.onrender.com'
    }

    return window.location.origin
  }

  return 'http://localhost:5000'
}

const API_BASE_URL = getApiBaseUrl()

export async function scanMealPhoto({ token, imageBase64 }) {
  const response = await fetch(`${API_BASE_URL}/api/meal-scan/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageBase64 }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Meal scan failed.')
  }

  return payload.analysis
}
