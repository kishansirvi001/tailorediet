const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tailorediet.onrender.com'

export async function generateWorkoutPlan({ fitnessLevel, goal, exercisesPerDay }) {
  const response = await fetch(`${API_BASE_URL}/api/workout-plans/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fitnessLevel, goal, exercisesPerDay }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to generate the workout plan right now.')
  }

  return payload.plan
}
