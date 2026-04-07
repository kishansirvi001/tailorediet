const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tailorediet.onrender.com'

export async function fetchWorkoutPlan(token) {
  const response = await fetch(`${API_BASE_URL}/api/workout-plans`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to load the workout plan right now.')
  }

  return payload.plan
}
