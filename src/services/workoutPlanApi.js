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
  }

  return ''
}

const API_BASE_URL = getApiBaseUrl()

export async function generateWorkoutPlan({ fitnessLevel, goal, category }) {
  const response = await fetch(`${API_BASE_URL}/api/workout-plans/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fitnessLevel, goal, category }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to generate the workout plan right now.')
  }

  return payload
}
