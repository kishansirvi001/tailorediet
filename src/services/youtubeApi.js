const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function fetchYouTubeShorts({ filter = 'all', search = '', pageToken = '', limit = 9 } = {}) {
  const params = new URLSearchParams({
    filter,
    limit: String(limit),
  })

  if (search.trim()) {
    params.set('search', search.trim())
  }

  if (pageToken) {
    params.set('pageToken', pageToken)
  }

  const response = await fetch(`${API_BASE_URL}/api/youtube/shorts?${params.toString()}`)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to load YouTube Shorts right now.')
  }

  return payload
}
