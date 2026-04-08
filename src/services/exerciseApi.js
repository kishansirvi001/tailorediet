const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://tailorediet.onrender.com')

const exerciseRequestCache = new Map()

export async function fetchExerciseByName(name) {
  const cacheKey = String(name || '').trim().toLowerCase()

  if (!cacheKey) {
    throw new Error('Exercise name is required.')
  }

  if (exerciseRequestCache.has(cacheKey)) {
    return exerciseRequestCache.get(cacheKey)
  }

  const request = fetch(`${API_BASE_URL}/api/exercise/${encodeURIComponent(name)}`)
    .then(async (response) => {
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message =
          response.status >= 500
            ? 'Exercise demo is temporarily unavailable. Please try again in a moment.'
            : payload.error || 'Unable to load exercise details right now.'

        throw new Error(message)
      }

      return payload
    })
    .catch((error) => {
      exerciseRequestCache.delete(cacheKey)
      throw error
    })

  exerciseRequestCache.set(cacheKey, request)

  return request
}
