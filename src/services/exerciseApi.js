const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://tailorediet.onrender.com')

const EXERCISEDB_ENDPOINT_CANDIDATES = [
  'https://www.exercisedb.dev/api/v1/exercises',
  'https://v1.exercisedb.dev/api/exercises',
  'https://v2.exercisedb.dev/api/exercises',
]

const MEDIA_BASE_CANDIDATES = [
  'https://v2.exercisedb.dev/media',
  'https://static.exercisedb.dev/media',
]

const EXERCISE_NAME_MAP = {
  'Bench Press': 'barbell bench press',
  'Incline Dumbbell Press': 'incline dumbbell bench press',
  'Cable Fly': 'cable chest fly',
  'Chest Machine Press': 'machine chest press',
  'Tricep Pushdown': 'triceps pushdown',
  'Overhead Extension': 'overhead triceps extension',
  'Lat Pulldown': 'lat pulldown',
  'Seated Row': 'seated cable row',
  'One-arm Dumbbell Row': 'one arm dumbbell row',
  'Straight Arm Pulldown': 'straight arm pulldown',
  'Barbell Curl': 'barbell curl',
  'Hammer Curl': 'hammer curl',
  Squat: 'barbell squat',
  'Leg Press': 'sled leg press',
  'Leg Extension': 'leg extension',
  'Shoulder Press': 'dumbbell shoulder press',
  'Lateral Raise': 'dumbbell lateral raise',
  'Front Raise': 'dumbbell front raise',
  'Decline Bench Press': 'decline barbell bench press',
  'Incline Machine Press': 'incline machine chest press',
  'Pec Deck Fly': 'pec deck fly',
  'Close Grip Bench Press': 'close grip barbell bench press',
  'Rope Pushdown': 'rope triceps pushdown',
  'Bench Dips': 'bench dip',
  'Pull-ups': 'pull up',
  'Barbell Row': 'barbell bent over row',
  'T-Bar Row': 't bar row',
  'Face Pull': 'cable face pull',
  'EZ Bar Curl': 'ez bar curl',
  'Concentration Curl': 'concentration curl',
  Deadlift: 'barbell deadlift',
  'Walking Lunges': 'walking lunge',
  'Leg Curl': 'leg curl',
  'Arnold Press': 'arnold press',
  'Rear Delt Fly': 'rear delt fly',
  Shrugs: 'dumbbell shrug',
  'Incline Barbell Press': 'incline barbell bench press',
  'Flat Dumbbell Press': 'dumbbell bench press',
  'Cable Crossover': 'cable crossover',
  'Decline Press': 'decline bench press',
  'Chest Dips': 'chest dip',
  'Skull Crushers': 'barbell skull crusher',
  'Overhead Cable Extension': 'overhead cable triceps extension',
  'Lat Pulldown Close Grip': 'close grip lat pulldown',
  'Seated Cable Row': 'seated cable row',
  'Preacher Curl': 'preacher curl',
  'Incline Curl': 'incline dumbbell curl',
  'Flat Bench Press': 'barbell bench press',
  'Incline Dumbbell Fly': 'incline dumbbell fly',
  'Machine Chest Press': 'machine chest press',
  'Cable Fly Low': 'low cable chest fly',
  'Weighted Dips': 'weighted dip',
  'Close Grip Bench': 'close grip barbell bench press',
  'Single Arm Pushdown': 'single arm cable triceps pushdown',
  Kickbacks: 'dumbbell tricep kickback',
  'Chin-ups': 'chin up',
  'Rack Pull': 'barbell rack pull',
  'Reverse Grip Pulldown': 'reverse grip lat pulldown',
  'Cable Curl': 'cable curl',
  'Front Squat': 'barbell front squat',
  'Romanian Deadlift': 'romanian deadlift',
  'Seated Leg Curl': 'seated leg curl',
  'Bulgarian Split Squat': 'bulgarian split squat',
  'Military Press': 'barbell military press',
  'Cable Lateral Raise': 'cable lateral raise',
  'Machine Press': 'machine chest press',
  'Weighted Pull-ups': 'weighted pull up',
  'EZ Curl': 'ez bar curl',
  'Decline Dumbbell Press': 'decline dumbbell bench press',
  'Pec Deck': 'pec deck fly',
  'One-arm Row': 'one arm dumbbell row',
  'Reverse Grip Row': 'reverse grip barbell row',
  'Lat Pulldown Wide': 'wide grip lat pulldown',
  'Hip Thrust': 'barbell hip thrust',
}

const exerciseRequestCache = new Map()
let datasetCache = null
let datasetPromise = null

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase()
}

function slugify(value) {
  return normalizeKey(value).replace(/[^a-z0-9]+/g, ' ').trim()
}

function normalizeToList(value) {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  return [String(value).trim()].filter(Boolean)
}

function flattenMediaValues(value) {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenMediaValues(item))
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap((item) => flattenMediaValues(item))
  }

  return [String(value).trim()].filter(Boolean)
}

function buildMediaUrls(value) {
  if (!value) {
    return []
  }

  const stringValue = String(value).trim()

  if (!stringValue) {
    return []
  }

  if (/^https?:\/\//i.test(stringValue)) {
    return [stringValue]
  }

  const cleanValue = stringValue.replace(/^\/+/, '')
  const cleanPath = cleanValue.replace(/^media\/+/i, '')
  const candidates = [cleanValue]

  for (const base of MEDIA_BASE_CANDIDATES) {
    const normalizedBase = base.replace(/\/+$/, '')
    candidates.push(`${normalizedBase}/${cleanValue}`)

    if (cleanPath !== cleanValue) {
      candidates.push(`${normalizedBase}/${cleanPath}`)
    }
  }

  return [...new Set(candidates.filter(Boolean))]
}

function extractMediaUrls(raw) {
  return [
    raw?.gifUrl,
    raw?.gif_url,
    raw?.imageUrl,
    raw?.image,
    raw?.videoUrl,
    raw?.video,
    raw?.mediaUrl,
    raw?.media,
    raw?.thumbnail,
    raw?.thumbnailUrl,
    raw?.previewUrl,
    raw?.assets,
    raw?.images,
  ]
    .flatMap((value) => flattenMediaValues(value))
    .flatMap((value) => buildMediaUrls(value))
    .filter(Boolean)
}

function extractExerciseList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const directList =
    (Array.isArray(payload.data) && payload.data) ||
    (Array.isArray(payload.exercises) && payload.exercises) ||
    (Array.isArray(payload.results) && payload.results) ||
    (Array.isArray(payload.items) && payload.items) ||
    (Array.isArray(payload.body) && payload.body)

  if (directList) {
    return directList
  }

  for (const value of Object.values(payload)) {
    const nestedList = extractExerciseList(value)

    if (nestedList.length > 0) {
      return nestedList
    }
  }

  return []
}

function scoreMatch(inputName, candidate) {
  const input = slugify(inputName)
  const candidateName = slugify(candidate?.name)

  if (!candidateName) {
    return -1
  }

  if (input === candidateName) {
    return 100
  }

  if (candidateName.includes(input) || input.includes(candidateName)) {
    return 75
  }

  const inputTokens = input.split(' ').filter(Boolean)
  const candidateTokens = new Set(candidateName.split(' ').filter(Boolean))

  return inputTokens.reduce((score, token) => score + (candidateTokens.has(token) ? 10 : 0), 0)
}

function normalizeDatasetExercise(raw) {
  const mediaUrls = extractMediaUrls(raw)
  const targetMuscles = normalizeToList(raw?.targetMuscles || raw?.target)
  const equipments = normalizeToList(raw?.equipments || raw?.equipment)
  const preferredVideoUrl =
    mediaUrls.find((url) => /\.(mp4|webm|ogg)(\?|#|$)/i.test(url)) || raw?.videoUrl || raw?.video || null
  const preferredImageUrl =
    mediaUrls.find((url) => !/\.(mp4|webm|ogg)(\?|#|$)/i.test(url)) ||
    raw?.gifUrl ||
    raw?.imageUrl ||
    raw?.image ||
    null

  return {
    name: raw?.name || raw?.exerciseName || raw?.title || null,
    gifUrl: preferredImageUrl ? buildMediaUrls(preferredImageUrl)[0] || preferredImageUrl : null,
    videoUrl: preferredVideoUrl ? buildMediaUrls(preferredVideoUrl)[0] || preferredVideoUrl : null,
    mediaUrls,
    target: targetMuscles[0] || null,
    equipment: equipments[0] || null,
  }
}

async function fetchExerciseDatasetDirect() {
  if (datasetCache) {
    return datasetCache
  }

  if (datasetPromise) {
    return datasetPromise
  }

  datasetPromise = (async () => {
    let lastError = null

    for (const endpoint of EXERCISEDB_ENDPOINT_CANDIDATES) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          lastError = new Error(`Exercise dataset request failed with status ${response.status}.`)
          continue
        }

        const payload = await response.json()
        const list = extractExerciseList(payload)
          .map(normalizeDatasetExercise)
          .filter((exercise) => exercise.name)

        if (list.length > 0) {
          datasetCache = list
          return list
        }
      } catch (error) {
        lastError = error
      }
    }

    throw lastError || new Error('Unable to load exercise dataset.')
  })()

  try {
    return await datasetPromise
  } finally {
    datasetPromise = null
  }
}

async function fetchExerciseFromPublicDataset(name) {
  const mappedName = EXERCISE_NAME_MAP[name] || String(name || '').trim()
  const dataset = await fetchExerciseDatasetDirect()
  const candidates = [...new Set([String(name || '').trim(), mappedName].filter(Boolean))]

  const bestMatch = dataset
    .map((exercise) => ({
      exercise,
      score: Math.max(...candidates.map((candidate) => scoreMatch(candidate, exercise))),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)[0]?.exercise

  if (!bestMatch) {
    throw new Error('Unable to find a matching exercise demo right now.')
  }

  return {
    ...bestMatch,
    source: 'public-exercisedb',
  }
}

async function fetchExerciseFromBackend(name) {
  const response = await fetch(`${API_BASE_URL}/api/exercise/${encodeURIComponent(name)}`)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      response.status >= 500
        ? 'Exercise demo is temporarily unavailable. Please try again in a moment.'
        : payload.error || 'Unable to load exercise details right now.'

    throw new Error(message)
  }

  return payload
}

function hasRenderableMedia(exercise) {
  return Boolean(exercise?.gifUrl || exercise?.videoUrl)
}

export async function fetchExerciseByName(name) {
  const cacheKey = normalizeKey(name)

  if (!cacheKey) {
    throw new Error('Exercise name is required.')
  }

  if (exerciseRequestCache.has(cacheKey)) {
    return exerciseRequestCache.get(cacheKey)
  }

  const request = (async () => {
    try {
      const backendExercise = await fetchExerciseFromBackend(name)

      if (hasRenderableMedia(backendExercise)) {
        return backendExercise
      }
    } catch (error) {
      // Fall through to the public dataset when the backend is stale or unavailable.
    }

    return fetchExerciseFromPublicDataset(name)
  })().catch((error) => {
    exerciseRequestCache.delete(cacheKey)
    throw error
  })

  exerciseRequestCache.set(cacheKey, request)

  return request
}
