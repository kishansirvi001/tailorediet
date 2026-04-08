const RAPID_API_BASE_URL = process.env.EXERCISEDB_API_URL || "https://exercisedb.p.rapidapi.com";
const RAPID_API_HOST = process.env.EXERCISEDB_RAPIDAPI_HOST || "exercisedb.p.rapidapi.com";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;

const exerciseCache = new Map();

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

function buildExerciseUrl(name) {
  const encodedName = encodeURIComponent(name);
  return `${RAPID_API_BASE_URL.replace(/\/+$/, "")}/exercises/name/${encodedName}?limit=10`;
}

function normalizeExercise(exercise) {
  return {
    name: exercise?.name || null,
    gifUrl: exercise?.gifUrl || exercise?.imageUrl || null,
    videoUrl: exercise?.videoUrl || null,
    target: Array.isArray(exercise?.targetMuscles)
      ? exercise.targetMuscles[0] || null
      : exercise?.target || null,
    equipment: Array.isArray(exercise?.equipments)
      ? exercise.equipments[0] || null
      : exercise?.equipment || null,
  };
}

async function requestExerciseList(searchName) {
  const apiKey = process.env.RAPIDAPI_KEY || process.env.EXERCISEDB_RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error("Missing RAPIDAPI_KEY for ExerciseDB.");
  }

  const response = await fetch(buildExerciseUrl(searchName), {
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`ExerciseDB request failed with status ${response.status}.`);
  }

  const payload = await response.json();

  return Array.isArray(payload) ? payload : [];
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

  for (const candidate of candidates) {
    matches = await requestExerciseList(candidate);

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
    return null;
  }

  const normalized = normalizeExercise(bestMatch);
  setCacheEntry(cacheKey, normalized);

  return normalized;
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

    return res.json(exercise);
  } catch (error) {
    return res.status(502).json({
      error: error instanceof Error ? error.message : "Unable to fetch exercise details.",
    });
  }
}
