const EXERCISEDB_ENDPOINT_CANDIDATES = [
  process.env.EXERCISEDB_EXERCISES_URL,
  process.env.EXERCISEDB_API_URL,
  "https://www.exercisedb.dev/api/v1/exercises",
  "https://v1.exercisedb.dev/api/exercises",
  "https://v2.exercisedb.dev/api/exercises",
].filter(Boolean);

const FREE_EXERCISE_DB_ENDPOINT =
  "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/dist/exercises.json";
const FREE_EXERCISE_DB_MEDIA_BASE =
  "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises";

const MEDIA_BASE_CANDIDATES = [
  process.env.EXERCISEDB_MEDIA_BASE_URL,
  "https://v2.exercisedb.dev/media",
  "https://static.exercisedb.dev/media",
].filter(Boolean);

const CACHE_TTL_MS = 1000 * 60 * 60 * 12;
const MEDIA_PROXY_TIMEOUT_MS = 8000;

const exerciseCache = new Map();
let datasetCache = null;
let datasetCacheExpiresAt = 0;
let datasetRequest = null;
let freeDatasetCache = null;
let freeDatasetCacheExpiresAt = 0;
let freeDatasetRequest = null;

const EXERCISE_NAME_MAP = {
  "Bench Press": "barbell bench press",
  "Incline Dumbbell Press": "incline dumbbell bench press",
  "Cable Fly": "cable chest fly",
  "Chest Machine Press": "machine chest press",
  "Tricep Pushdown": "triceps pushdown",
  "Overhead Extension": "overhead triceps extension",
  "Lat Pulldown": "lat pulldown",
  "Seated Row": "seated cable row",
  "One-arm Dumbbell Row": "one arm dumbbell row",
  "Straight Arm Pulldown": "straight arm pulldown",
  "Barbell Curl": "barbell curl",
  "Hammer Curl": "hammer curl",
  "Squat": "barbell squat",
  "Leg Press": "sled leg press",
  "Leg Extension": "leg extension",
  "Shoulder Press": "dumbbell shoulder press",
  "Lateral Raise": "dumbbell lateral raise",
  "Front Raise": "dumbbell front raise",
  "Decline Bench Press": "decline barbell bench press",
  "Incline Machine Press": "incline machine chest press",
  "Pec Deck Fly": "pec deck fly",
  "Close Grip Bench Press": "close grip barbell bench press",
  "Rope Pushdown": "rope triceps pushdown",
  "Bench Dips": "bench dip",
  "Pull-ups": "pull up",
  "Barbell Row": "barbell bent over row",
  "T-Bar Row": "t bar row",
  "Face Pull": "cable face pull",
  "EZ Bar Curl": "ez bar curl",
  "Concentration Curl": "concentration curl",
  Deadlift: "barbell deadlift",
  "Walking Lunges": "walking lunge",
  "Leg Curl": "leg curl",
  "Arnold Press": "arnold press",
  "Rear Delt Fly": "rear delt fly",
  Shrugs: "dumbbell shrug",
  "Incline Barbell Press": "incline barbell bench press",
  "Flat Dumbbell Press": "dumbbell bench press",
  "Cable Crossover": "cable crossover",
  "Decline Press": "decline bench press",
  "Chest Dips": "chest dip",
  "Skull Crushers": "barbell skull crusher",
  "Overhead Cable Extension": "overhead cable triceps extension",
  "Lat Pulldown Close Grip": "close grip lat pulldown",
  "Seated Cable Row": "seated cable row",
  "Preacher Curl": "preacher curl",
  "Incline Curl": "incline dumbbell curl",
  "Flat Bench Press": "barbell bench press",
  "Incline Dumbbell Fly": "incline dumbbell fly",
  "Machine Chest Press": "machine chest press",
  "Cable Fly Low": "low cable chest fly",
  "Weighted Dips": "weighted dip",
  "Close Grip Bench": "close grip barbell bench press",
  "Single Arm Pushdown": "single arm cable triceps pushdown",
  Kickbacks: "dumbbell tricep kickback",
  "Chin-ups": "chin up",
  "Rack Pull": "barbell rack pull",
  "Reverse Grip Pulldown": "reverse grip lat pulldown",
  "Cable Curl": "cable curl",
  "Front Squat": "barbell front squat",
  "Romanian Deadlift": "romanian deadlift",
  "Seated Leg Curl": "seated leg curl",
  "Bulgarian Split Squat": "bulgarian split squat",
  "Military Press": "barbell military press",
  "Cable Lateral Raise": "cable lateral raise",
  "Machine Press": "machine chest press",
  "Weighted Pull-ups": "weighted pull up",
  "EZ Curl": "ez bar curl",
  "Decline Dumbbell Press": "decline dumbbell bench press",
  "Pec Deck": "pec deck fly",
  "One-arm Row": "one arm dumbbell row",
  "Reverse Grip Row": "reverse grip barbell row",
  "Lat Pulldown Wide": "wide grip lat pulldown",
  "Hip Thrust": "barbell hip thrust",
};

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase();
}

function slugify(value) {
  return normalizeKey(value).replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreMatch(inputName, candidate) {
  const input = slugify(inputName);
  const candidateName = slugify(candidate?.name);

  if (!candidateName) {
    return -1;
  }

  if (input === candidateName) {
    return 100;
  }

  if (candidateName.includes(input) || input.includes(candidateName)) {
    return 75;
  }

  const inputTokens = input.split(" ").filter(Boolean);
  const candidateTokens = new Set(candidateName.split(" ").filter(Boolean));

  return inputTokens.reduce((score, token) => score + (candidateTokens.has(token) ? 10 : 0), 0);
}

function getCacheEntry(name) {
  const entry = exerciseCache.get(name);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    exerciseCache.delete(name);
    return null;
  }

  return entry.value;
}

function setCacheEntry(name, value) {
  exerciseCache.set(name, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

function mapExerciseName(name) {
  return EXERCISE_NAME_MAP[name] || String(name || "").trim();
}

function normalizeToList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return [String(value).trim()].filter(Boolean);
}

function flattenMediaValues(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenMediaValues(item));
  }

  if (typeof value === "object") {
    return Object.values(value).flatMap((item) => flattenMediaValues(item));
  }

  return [String(value).trim()].filter(Boolean);
}

function buildMediaUrls(value) {
  if (!value) {
    return [];
  }

  const stringValue = String(value).trim();

  if (!stringValue) {
    return [];
  }

  if (/^https?:\/\//i.test(stringValue)) {
    return [stringValue];
  }

  const cleanValue = stringValue.replace(/^\/+/, "");
  const cleanPath = cleanValue.replace(/^media\/+/i, "");
  const candidates = [cleanValue];

  for (const base of MEDIA_BASE_CANDIDATES) {
    const normalizedBase = base.replace(/\/+$/, "");
    candidates.push(`${normalizedBase}/${cleanValue}`);

    if (cleanPath !== cleanValue) {
      candidates.push(`${normalizedBase}/${cleanPath}`);
    }
  }

  return [...new Set(candidates.filter(Boolean))];
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
    .filter(Boolean);
}

function extractExerciseList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const directList =
    (Array.isArray(payload.data) && payload.data) ||
    (Array.isArray(payload.exercises) && payload.exercises) ||
    (Array.isArray(payload.results) && payload.results) ||
    (Array.isArray(payload.items) && payload.items) ||
    (Array.isArray(payload.body) && payload.body);

  if (directList) {
    return directList;
  }

  for (const value of Object.values(payload)) {
    const nestedList = extractExerciseList(value);

    if (nestedList.length > 0) {
      return nestedList;
    }
  }

  return [];
}

function normalizeDatasetExercise(raw) {
  const mediaUrls = extractMediaUrls(raw);
  const targetMuscles = normalizeToList(raw?.targetMuscles || raw?.target);
  const equipments = normalizeToList(raw?.equipments || raw?.equipment);
  const preferredVideoUrl =
    mediaUrls.find((url) => /\.(mp4|webm|ogg)(\?|#|$)/i.test(url)) || raw?.videoUrl || raw?.video || null;
  const preferredImageUrl =
    mediaUrls.find((url) => !/\.(mp4|webm|ogg)(\?|#|$)/i.test(url)) ||
    raw?.gifUrl ||
    raw?.imageUrl ||
    raw?.image ||
    null;

  return {
    name: raw?.name || raw?.exerciseName || raw?.title || null,
    mediaUrls,
    gifUrl: preferredImageUrl,
    videoUrl: preferredVideoUrl,
    target: targetMuscles[0] || null,
    equipment: equipments[0] || null,
  };
}

function titleCaseWords(value) {
  return String(value || "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizeFreeDatasetExercise(raw) {
  const imagePaths = Array.isArray(raw?.images) ? raw.images.filter(Boolean) : [];
  const frameUrls = imagePaths.map(
    (path) => `${FREE_EXERCISE_DB_MEDIA_BASE}/${String(path).replace(/^\/+/, "")}`
  );

  return {
    name: raw?.name || null,
    mediaUrls: frameUrls,
    frameUrls,
    gifUrl: frameUrls[0] || null,
    videoUrl: null,
    target: titleCaseWords(raw?.primaryMuscles?.[0] || ""),
    targetMuscles: Array.isArray(raw?.primaryMuscles)
      ? raw.primaryMuscles.map((muscle) => titleCaseWords(muscle))
      : [],
    secondaryMuscles: Array.isArray(raw?.secondaryMuscles)
      ? raw.secondaryMuscles.map((muscle) => titleCaseWords(muscle))
      : [],
    equipment: raw?.equipment ? titleCaseWords(raw.equipment) : null,
  };
}

async function fetchFreeExerciseDataset() {
  if (freeDatasetCache && Date.now() < freeDatasetCacheExpiresAt) {
    return freeDatasetCache;
  }

  if (freeDatasetRequest) {
    return freeDatasetRequest;
  }

  freeDatasetRequest = (async () => {
    const response = await fetch(FREE_EXERCISE_DB_ENDPOINT, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Free exercise dataset request failed with status ${response.status}.`);
    }

    const payload = await response.json();
    const list = Array.isArray(payload) ? payload : [];
    const normalized = list
      .map(normalizeFreeDatasetExercise)
      .filter((exercise) => exercise.name);

    freeDatasetCache = normalized;
    freeDatasetCacheExpiresAt = Date.now() + CACHE_TTL_MS;
    return normalized;
  })();

  try {
    return await freeDatasetRequest;
  } finally {
    freeDatasetRequest = null;
  }
}

async function _fetchExerciseDataset() {
  if (datasetCache && Date.now() < datasetCacheExpiresAt) {
    return datasetCache;
  }

  if (datasetRequest) {
    return datasetRequest;
  }

  datasetRequest = (async () => {
    let lastError = null;

    for (const endpoint of EXERCISEDB_ENDPOINT_CANDIDATES) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          lastError = new Error(`Exercise dataset request failed with status ${response.status}.`);
          continue;
        }

        const payload = await response.json();
        const list = extractExerciseList(payload)
          .map(normalizeDatasetExercise)
          .filter((exercise) => exercise.name);

        if (list.length > 0) {
          datasetCache = list;
          datasetCacheExpiresAt = Date.now() + CACHE_TTL_MS;
          return list;
        }
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Unable to load exercise dataset.");
  })();
  
  try {
    return await datasetRequest;
  } finally {
    datasetRequest = null;
  }
}

async function requestExerciseList(searchName) {
  const dataset = await fetchFreeExerciseDataset();
  const normalizedSearchName = normalizeKey(searchName);

  return dataset
    .map((exercise) => ({
      exercise,
      score: scoreMatch(normalizedSearchName, exercise),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 10)
    .map((entry) => entry.exercise);
}

function normalizeExercise(exercise) {
  return {
    name: exercise?.name || null,
    gifUrl: exercise?.gifUrl || null,
    videoUrl: exercise?.videoUrl || null,
    frameUrls: Array.isArray(exercise?.frameUrls)
      ? exercise.frameUrls.filter(Boolean)
      : [exercise?.gifUrl].filter(Boolean),
    mediaUrls: Array.isArray(exercise?.mediaUrls)
      ? exercise.mediaUrls.filter(Boolean)
      : [exercise?.gifUrl, exercise?.videoUrl].filter(Boolean),
    target: exercise?.target || null,
    targetMuscles: Array.isArray(exercise?.targetMuscles)
      ? exercise.targetMuscles.filter(Boolean)
      : [exercise?.target].filter(Boolean),
    secondaryMuscles: Array.isArray(exercise?.secondaryMuscles)
      ? exercise.secondaryMuscles.filter(Boolean)
      : [],
    equipment: exercise?.equipment || null,
  };
}

function guessEquipment(name) {
  const lowerName = normalizeKey(name);

  if (lowerName.includes("barbell")) return "Barbell";
  if (lowerName.includes("dumbbell")) return "Dumbbell";
  if (lowerName.includes("cable")) return "Cable";
  if (lowerName.includes("machine")) return "Machine";
  if (lowerName.includes("pull-up")) return "Pull-Up Bar";
  if (lowerName.includes("carry")) return "Dumbbell or Kettlebell";
  if (lowerName.includes("plank") || lowerName.includes("dead bug")) return "Body Weight";

  return "Gym Equipment";
}

function guessTarget(name) {
  const lowerName = normalizeKey(name);

  if (lowerName.includes("squat") || lowerName.includes("lunge") || lowerName.includes("leg")) {
    return "Quadriceps";
  }

  if (lowerName.includes("deadlift") || lowerName.includes("hip thrust") || lowerName.includes("bridge")) {
    return "Glutes";
  }

  if (lowerName.includes("press") || lowerName.includes("dip") || lowerName.includes("fly")) {
    return "Chest";
  }

  if (lowerName.includes("row") || lowerName.includes("pull") || lowerName.includes("pulldown")) {
    return "Back";
  }

  if (lowerName.includes("curl")) {
    return "Biceps";
  }

  if (lowerName.includes("tricep") || lowerName.includes("triceps") || lowerName.includes("extension")) {
    return "Triceps";
  }

  if (lowerName.includes("plank") || lowerName.includes("crunch") || lowerName.includes("raise") || lowerName.includes("bug")) {
    return "Core";
  }

  return "Full Body";
}

function buildFallbackExercise(name) {
  return {
    name: String(name || "").trim() || null,
    gifUrl: null,
    videoUrl: null,
    frameUrls: [],
    mediaUrls: [],
    target: guessTarget(name),
    targetMuscles: [guessTarget(name)],
    secondaryMuscles: [],
    equipment: guessEquipment(name),
  };
}

function buildAbsoluteUrl(req, pathname, values = []) {
  const origin = `${req.protocol}://${req.get("host")}`;
  const params = new URLSearchParams();

  for (const value of [...new Set(values.filter(Boolean))]) {
    if (value) {
      params.append("url", value);
    }
  }

  const query = params.toString();
  return `${origin}${pathname}${query ? `?${query}` : ""}`;
}

function withProxyUrls(req, exercise) {
  const mediaUrls = [
    ...(Array.isArray(exercise?.mediaUrls) ? exercise.mediaUrls : []),
    exercise?.gifUrl,
    exercise?.videoUrl,
  ].filter(Boolean);
  const videoCandidates = mediaUrls.filter((url) => /\.(mp4|webm|ogg)(\?|#|$)/i.test(url));
  const imageCandidates = mediaUrls.filter((url) => !/\.(mp4|webm|ogg)(\?|#|$)/i.test(url));

  return {
    ...exercise,
    mediaUrls: [...new Set(mediaUrls)],
    videoUrl:
      videoCandidates.length > 0
        ? buildAbsoluteUrl(req, "/api/exercise/media", videoCandidates)
        : exercise?.videoUrl || null,
    gifUrl:
      imageCandidates.length > 0
        ? buildAbsoluteUrl(req, "/api/exercise/media", imageCandidates)
        : exercise?.gifUrl || null,
  };
}

async function findExercise(name) {
  const mappedName = mapExerciseName(name);
  const cacheKey = normalizeKey(name);
  const cached = getCacheEntry(cacheKey);

  if (cached) {
    return cached;
  }

  const candidates = [...new Set([mappedName, String(name || "").trim()].filter(Boolean))];
  let matches = [];
  let lookupFailed = false;

  for (const candidate of candidates) {
    try {
      matches = await requestExerciseList(candidate);
    } catch {
      lookupFailed = true;
      continue;
    }

    if (matches.length > 0) {
      break;
    }
  }

  const bestMatch = matches
    .map((exercise) => ({
      exercise,
      score: Math.max(scoreMatch(name, exercise), scoreMatch(mappedName, exercise)),
    }))
    .sort((left, right) => right.score - left.score)[0]?.exercise;

  if (!bestMatch) {
    if (lookupFailed) {
      const fallback = buildFallbackExercise(name);
      setCacheEntry(cacheKey, fallback);
      return fallback;
    }

    return null;
  }

  const normalized = normalizeExercise(bestMatch);
  setCacheEntry(cacheKey, normalized);

  return normalized;
}

export async function findExerciseByName(name) {
  return findExercise(name);
}

export async function getExerciseGifByName(req, res) {
  try {
    const exerciseName = req.params.name;

    if (!exerciseName) {
      return res.status(400).json({ error: "Exercise name is required." });
    }

    const exercise = await findExercise(exerciseName);

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found." });
    }

    const imageCandidates = [
      ...(Array.isArray(exercise?.frameUrls) ? exercise.frameUrls : []),
      ...(Array.isArray(exercise?.mediaUrls) ? exercise.mediaUrls : []),
      exercise?.gifUrl,
    ].filter(Boolean);

    if (imageCandidates.length === 0) {
      return res.status(404).json({ error: "Exercise GIF is unavailable." });
    }

    return res.redirect(imageCandidates[0]);
  } catch (error) {
    return res.status(502).json({
      error: error instanceof Error ? error.message : "Unable to fetch exercise GIF.",
    });
  }
}

export async function getExerciseMedia(req, res) {
  try {
    const input = req.query.url;
    const candidates = (Array.isArray(input) ? input : [input])
      .flatMap((value) => String(value || "").split(","))
      .map((value) => value.trim())
      .filter((value) => /^https?:\/\//i.test(value));

    if (candidates.length === 0) {
      return res.status(400).json({ error: "At least one media URL is required." });
    }

    for (const candidate of [...new Set(candidates)]) {
      try {
        const response = await fetch(candidate, {
          headers: {
            Accept: "image/*,video/*;q=0.9,*/*;q=0.5",
          },
          signal: AbortSignal.timeout(MEDIA_PROXY_TIMEOUT_MS),
        });

        if (!response.ok) {
          continue;
        }

        const contentType = response.headers.get("content-type") || "application/octet-stream";

        if (!/^(image|video)\//i.test(contentType)) {
          continue;
        }

        const cacheControl = response.headers.get("cache-control") || "public, max-age=86400";
        const payload = Buffer.from(await response.arrayBuffer());

        res.set("Content-Type", contentType);
        res.set("Cache-Control", cacheControl);
        return res.send(payload);
      } catch {
        continue;
      }
    }

    return res.status(404).json({ error: "Exercise media is unavailable." });
  } catch (error) {
    return res.status(502).json({
      error: error instanceof Error ? error.message : "Unable to proxy exercise media.",
    });
  }
}

export async function getExerciseByName(req, res) {
  try {
    const exerciseName = req.params.name;

    if (!exerciseName) {
      return res.status(400).json({ error: "Exercise name is required." });
    }

    const exercise = await findExercise(exerciseName);

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found." });
    }

    res.set("Cache-Control", "public, max-age=43200");

    return res.json(withProxyUrls(req, exercise));
  } catch (error) {
    return res.status(502).json({
      error: error instanceof Error ? error.message : "Unable to fetch exercise details.",
    });
  }
}
