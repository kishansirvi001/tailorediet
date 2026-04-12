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

export async function sendChatMessage(message) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
  } catch (e) {
    throw new Error(`Could not connect to backend at ${API_BASE_URL}. Is the server running? (${e.message})`)
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Chat request failed.')
  }

  return payload.reply
}
