import { requireAuth } from "../middleware/requireAuth.js";

const EXERCISEDB_ENDPOINT_CANDIDATES = [
  process.env.EXERCISEDB_EXERCISES_URL,
  process.env.EXERCISEDB_API_URL,
  "https://www.exercisedb.dev/api/v1/exercises",
  "https://v1.exercisedb.dev/api/exercises",
  "https://v2.exercisedb.dev/api/exercises",
].filter(Boolean);

const MEDIA_BASE_CANDIDATES = [
  process.env.EXERCISEDB_MEDIA_BASE_URL,
  "https://v2.exercisedb.dev/media",
  "https://static.exercisedb.dev/media",
].filter(Boolean);

const LEVEL_TEMPLATES = [
  {
    id: "beginner",
    label: "Newbie Foundation",
    duration: "6 weeks",
    frequency: "3 days per week",
    summary:
      "A full-body entry phase focused on safe patterns, stable tempo, and enough rest to build confidence before heavy loading.",
    progression: [
      "Weeks 1-2: Learn setup, breathing, and range of motion before increasing weight.",
      "Weeks 3-4: Add small load jumps only when every rep looks controlled.",
      "Weeks 5-6: Add one extra set to the first two lifts of the day if recovery is good.",
    ],
    weeklySplit: [
      {
        day: "Day 1",
        focus: "Full Body A",
        coachingGoal: "Practice squat, push, row, and brace mechanics.",
        exercises: [
          templateExercise("Goblet Squat", "3 x 10", "60-75 sec", "controlled"),
          templateExercise("Machine Chest Press", "3 x 10", "60 sec", "controlled"),
          templateExercise("Seated Cable Row", "3 x 12", "60 sec", "controlled"),
          templateExercise("Romanian Deadlift", "3 x 10", "75 sec", "slow lowering"),
          templateExercise("Plank", "3 x 30-45 sec", "45 sec", "steady breathing"),
        ],
      },
      {
        day: "Day 2",
        focus: "Full Body B",
        coachingGoal: "Build hip hinge confidence and shoulder control.",
        exercises: [
          templateExercise("Leg Press", "3 x 12", "60 sec", "smooth"),
          templateExercise("Lat Pulldown", "3 x 10", "60 sec", "controlled"),
          templateExercise("Dumbbell Shoulder Press", "3 x 10", "60 sec", "steady"),
          templateExercise("Glute Bridge", "3 x 12", "45 sec", "pause at top"),
          templateExercise("Dead Bug", "3 x 10 per side", "45 sec", "slow"),
        ],
      },
      {
        day: "Day 3",
        focus: "Full Body C",
        coachingGoal: "Repeat core gym patterns with clean form under light fatigue.",
        exercises: [
          templateExercise("Split Squat", "3 x 8 per side", "60 sec", "controlled"),
          templateExercise("Incline Dumbbell Press", "3 x 10", "60 sec", "smooth"),
          templateExercise("Chest Supported Row", "3 x 10", "60 sec", "pause at contraction"),
          templateExercise("Cable Face Pull", "3 x 12", "45 sec", "strict"),
          templateExercise("Farmer Carry", "3 x 30 sec", "45 sec", "upright posture"),
        ],
      },
    ],
  },
  {
    id: "intermediate",
    label: "Strength Builder",
    duration: "8 weeks",
    frequency: "4 days per week",
    summary:
      "A balanced upper and lower split for lifters who already know the basics and are ready for more volume and stronger progression.",
    progression: [
      "Weeks 1-2: Leave 2 reps in reserve on compound lifts.",
      "Weeks 3-5: Add load when you hit the top rep target on all sets.",
      "Weeks 6-8: Push the final set of the main lift harder while keeping form clean.",
    ],
    weeklySplit: [
      {
        day: "Day 1",
        focus: "Upper Push + Chest",
        coachingGoal: "Develop chest, front delts, and triceps with controlled pressing.",
        exercises: [
          templateExercise("Barbell Bench Press", "4 x 6-8", "90 sec", "controlled"),
          templateExercise("Incline Dumbbell Press", "3 x 8-10", "75 sec", "steady"),
          templateExercise("Cable Chest Fly", "3 x 12-15", "60 sec", "stretch and squeeze"),
          templateExercise("Seated Dumbbell Shoulder Press", "3 x 8-10", "75 sec", "strict"),
          templateExercise("Triceps Pushdown", "3 x 12-15", "45 sec", "full lockout"),
        ],
      },
      {
        day: "Day 2",
        focus: "Lower Body Strength",
        coachingGoal: "Build squat and hinge strength without losing depth or spinal position.",
        exercises: [
          templateExercise("Barbell Back Squat", "4 x 5-8", "90 sec", "controlled"),
          templateExercise("Romanian Deadlift", "3 x 8-10", "75 sec", "slow lowering"),
          templateExercise("Walking Lunge", "3 x 10 per side", "60 sec", "upright"),
          templateExercise("Leg Curl", "3 x 12", "45 sec", "full squeeze"),
          templateExercise("Standing Calf Raise", "4 x 12-15", "45 sec", "pause at top"),
        ],
      },
      {
        day: "Day 3",
        focus: "Upper Pull + Back",
        coachingGoal: "Improve pull strength, posture, and scapular control.",
        exercises: [
          templateExercise("Pull-Up", "4 x 6-8", "90 sec", "full range"),
          templateExercise("Barbell Row", "4 x 8", "75 sec", "tight torso"),
          templateExercise("Seated Cable Row", "3 x 10-12", "60 sec", "pause at contraction"),
          templateExercise("Face Pull", "3 x 12-15", "45 sec", "strict"),
          templateExercise("Hammer Curl", "3 x 10-12", "45 sec", "no swinging"),
        ],
      },
      {
        day: "Day 4",
        focus: "Lower Body Hypertrophy + Core",
        coachingGoal: "Drive quad, glute, and core volume while keeping movement quality high.",
        exercises: [
          templateExercise("Leg Press", "4 x 10-12", "75 sec", "controlled"),
          templateExercise("Bulgarian Split Squat", "3 x 8 per side", "75 sec", "steady"),
          templateExercise("Hip Thrust", "3 x 10-12", "60 sec", "pause at top"),
          templateExercise("Leg Extension", "3 x 12-15", "45 sec", "slow"),
          templateExercise("Cable Crunch", "3 x 15", "45 sec", "brace hard"),
        ],
      },
    ],
  },
  {
    id: "advanced",
    label: "Athlete Performance Block",
    duration: "8-10 weeks",
    frequency: "5 days per week",
    summary:
      "A higher-volume split for experienced gym athletes who can recover well and want strength, hypertrophy, and performance work in the same cycle.",
    progression: [
      "Weeks 1-3: Accumulate quality volume with clean bar speed.",
      "Weeks 4-6: Increase intensity on the first lift of each session.",
      "Weeks 7-8+: Deload if recovery drops, then restart heavier than week 1.",
    ],
    weeklySplit: [
      {
        day: "Day 1",
        focus: "Power Lower",
        coachingGoal: "Build explosive lower-body strength and strong bracing.",
        exercises: [
          templateExercise("Barbell Back Squat", "5 x 3-5", "120 sec", "powerful"),
          templateExercise("Trap Bar Deadlift", "4 x 4-6", "120 sec", "explosive"),
          templateExercise("Box Jump", "4 x 5", "60 sec", "reset each rep"),
          templateExercise("Barbell Hip Thrust", "3 x 8", "75 sec", "hard lockout"),
          templateExercise("Hanging Leg Raise", "3 x 12", "45 sec", "controlled"),
        ],
      },
      {
        day: "Day 2",
        focus: "Heavy Push",
        coachingGoal: "Move heavier loads while preserving shoulder position and bar path.",
        exercises: [
          templateExercise("Barbell Bench Press", "5 x 3-5", "120 sec", "tight setup"),
          templateExercise("Incline Barbell Press", "4 x 6", "90 sec", "controlled"),
          templateExercise("Weighted Dip", "3 x 6-8", "75 sec", "full depth"),
          templateExercise("Cable Lateral Raise", "3 x 15", "45 sec", "strict"),
          templateExercise("Overhead Triceps Extension", "3 x 12", "45 sec", "stretch"),
        ],
      },
      {
        day: "Day 3",
        focus: "Heavy Pull",
        coachingGoal: "Improve pull strength, grip, and upper-back density.",
        exercises: [
          templateExercise("Weighted Pull-Up", "5 x 4-6", "90 sec", "dead hang start"),
          templateExercise("Pendlay Row", "4 x 6-8", "90 sec", "reset each rep"),
          templateExercise("Chest Supported Row", "3 x 10", "60 sec", "squeeze"),
          templateExercise("Rear Delt Fly", "3 x 15", "45 sec", "strict"),
          templateExercise("Barbell Curl", "3 x 10", "45 sec", "no body english"),
        ],
      },
      {
        day: "Day 4",
        focus: "Athletic Lower Volume",
        coachingGoal: "Layer hypertrophy and unilateral control after the heavy work.",
        exercises: [
          templateExercise("Front Squat", "4 x 6", "90 sec", "upright torso"),
          templateExercise("Romanian Deadlift", "4 x 8", "75 sec", "slow lowering"),
          templateExercise("Bulgarian Split Squat", "3 x 10 per side", "75 sec", "full depth"),
          templateExercise("Leg Curl", "3 x 12", "45 sec", "controlled"),
          templateExercise("Standing Calf Raise", "4 x 15", "45 sec", "pause"),
        ],
      },
      {
        day: "Day 5",
        focus: "Upper Pump + Joint Health",
        coachingGoal: "Accumulate quality volume and keep shoulders resilient.",
        exercises: [
          templateExercise("Incline Dumbbell Press", "4 x 10", "60 sec", "smooth"),
          templateExercise("Seated Cable Row", "4 x 10", "60 sec", "pause"),
          templateExercise("Cable Chest Fly", "3 x 15", "45 sec", "stretch"),
          templateExercise("Face Pull", "3 x 15", "45 sec", "strict"),
          templateExercise("Farmer Carry", "4 x 40 sec", "45 sec", "tall posture"),
        ],
      },
    ],
  },
];

function templateExercise(name, setsReps, rest, tempo) {
  return { name, setsReps, rest, tempo };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return String(value || "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
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

function buildMediaUrl(value) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const cleanValue = String(value).replace(/^\/+/, "");

  for (const base of MEDIA_BASE_CANDIDATES) {
    return `${base.replace(/\/+$/, "")}/${cleanValue}`;
  }

  return cleanValue;
}

function extractMediaUrl(raw) {
  const candidates = [
    raw.gifUrl,
    raw.gif_url,
    raw.imageUrl,
    raw.image,
    raw.videoUrl,
    raw.video,
    raw.mediaUrl,
    raw.media,
    raw.thumbnail,
    raw.thumbnailUrl,
    raw.previewUrl,
    raw.assets,
    raw.images,
  ]
    .flatMap((value) => flattenMediaValues(value))
    .map((value) => buildMediaUrl(value))
    .filter(Boolean);

  return candidates[0] || null;
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

function normalizeExercise(raw) {
  const name = raw.name || raw.exerciseName || raw.title || "";
  const instructions =
    normalizeToList(raw.instructions).length > 0
      ? normalizeToList(raw.instructions)
      : normalizeToList(raw.instructionSteps);
  const tips =
    normalizeToList(raw.exerciseTips).length > 0
      ? normalizeToList(raw.exerciseTips)
      : normalizeToList(raw.tips);
  const equipments = normalizeToList(raw.equipments || raw.equipment);
  const targetMuscles = normalizeToList(raw.targetMuscles || raw.target);
  const secondaryMuscles = normalizeToList(raw.secondaryMuscles || raw.secondary);
  const bodyParts = normalizeToList(raw.bodyParts || raw.bodyPart);
  const mediaUrl = extractMediaUrl(raw);

  return {
    id: raw.exerciseId || raw.id || slugify(name),
    name,
    mediaUrl,
    instructions,
    tips,
    equipments,
    targetMuscles,
    secondaryMuscles,
    bodyParts,
  };
}

function scoreExerciseMatch(templateName, exercise) {
  const query = slugify(templateName);
  const candidate = slugify(exercise.name);

  if (!candidate) {
    return -1;
  }

  if (candidate === query) {
    return 100;
  }

  if (candidate.includes(query) || query.includes(candidate)) {
    return 85;
  }

  const queryTokens = query.split("-").filter(Boolean);
  const candidateTokens = new Set(candidate.split("-").filter(Boolean));
  const overlap = queryTokens.filter((token) => candidateTokens.has(token)).length;

  return overlap;
}

async function fetchExerciseDataset() {
  let lastError = null;

  for (const endpoint of EXERCISEDB_ENDPOINT_CANDIDATES) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        lastError = new Error(`ExerciseDB request failed with ${response.status}`);
        continue;
      }

      const payload = await response.json();
      const list = extractExerciseList(payload);

      if (list.length > 0) {
        return list.map(normalizeExercise).filter((exercise) => exercise.name);
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to load ExerciseDB exercises.");
}

function attachExerciseDetails(dataset, template) {
  return {
    ...template,
    weeklySplit: template.weeklySplit.map((day) => ({
      ...day,
      exercises: day.exercises.map((plannedExercise) => {
        const bestMatch = dataset
          .map((exercise) => ({
            exercise,
            score: scoreExerciseMatch(plannedExercise.name, exercise),
          }))
          .sort((left, right) => right.score - left.score)[0]?.exercise;

        const fallbackEquipment = guessEquipment(plannedExercise.name);
        const fallbackTarget = guessTarget(plannedExercise.name);

        return {
          ...plannedExercise,
          exerciseId: bestMatch?.id || slugify(plannedExercise.name),
          mediaUrl: bestMatch?.mediaUrl || null,
          instructions:
            bestMatch?.instructions?.length > 0
              ? bestMatch.instructions.slice(0, 4)
              : buildFallbackInstructions(plannedExercise.name),
          tips:
            bestMatch?.tips?.length > 0
              ? bestMatch.tips.slice(0, 3)
              : buildFallbackTips(plannedExercise),
          equipments:
            bestMatch?.equipments?.length > 0 ? bestMatch.equipments : fallbackEquipment,
          targetMuscles:
            bestMatch?.targetMuscles?.length > 0 ? bestMatch.targetMuscles : fallbackTarget,
          secondaryMuscles: bestMatch?.secondaryMuscles || [],
          bodyParts: bestMatch?.bodyParts || [],
        };
      }),
    })),
  };
}

function guessEquipment(name) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("barbell")) return ["Barbell"];
  if (lowerName.includes("dumbbell")) return ["Dumbbell"];
  if (lowerName.includes("cable")) return ["Cable"];
  if (lowerName.includes("machine")) return ["Machine"];
  if (lowerName.includes("pull-up")) return ["Pull-Up Bar"];
  if (lowerName.includes("carry")) return ["Dumbbell or Kettlebell"];
  if (lowerName.includes("plank") || lowerName.includes("dead bug")) return ["Body Weight"];

  return ["Gym Equipment"];
}

function guessTarget(name) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("squat") || lowerName.includes("lunge") || lowerName.includes("leg")) {
    return ["Quadriceps", "Glutes"];
  }

  if (lowerName.includes("deadlift") || lowerName.includes("hip thrust") || lowerName.includes("bridge")) {
    return ["Glutes", "Hamstrings"];
  }

  if (lowerName.includes("press") || lowerName.includes("dip") || lowerName.includes("fly")) {
    return ["Chest", "Shoulders", "Triceps"];
  }

  if (lowerName.includes("row") || lowerName.includes("pull") || lowerName.includes("pulldown")) {
    return ["Back", "Biceps"];
  }

  if (lowerName.includes("curl")) {
    return ["Biceps"];
  }

  if (lowerName.includes("triceps")) {
    return ["Triceps"];
  }

  if (lowerName.includes("plank") || lowerName.includes("crunch") || lowerName.includes("raise") || lowerName.includes("bug")) {
    return ["Core"];
  }

  return ["Full Body"];
}

function buildFallbackInstructions(name) {
  return [
    `Set up for ${name} with a stable base and a neutral spine before the first rep.`,
    "Use a controlled lowering phase and avoid bouncing through the bottom.",
    "Move through a pain-free range of motion while keeping the target muscles engaged.",
    "Stop the set when form changes or you need momentum to finish the rep.",
  ];
}

function buildFallbackTips(exercise) {
  return [
    `Use ${exercise.tempo} reps instead of rushing the movement.`,
    `Rest for ${exercise.rest} between sets so form stays sharp.`,
    "Add weight only after every planned rep feels clean and repeatable.",
  ];
}

function buildResponse(dataset) {
  return {
    generatedFor: "authenticated-user",
    headline: "Beginner to advanced gym form plan",
    intro:
      "Each level builds from movement quality to strength and athletic performance. ExerciseDB media is attached when available so members can watch setup and execution before training.",
    onboardingChecklist: [
      "Start with the level that matches your current technique, not your ego.",
      "Use 5-10 minutes of cardio plus 1-2 warm-up sets before the first compound lift.",
      "If a rep changes shape, stop the set and keep the same load next session.",
      "Ask a coach or trainer for an in-person check if any movement causes sharp pain.",
    ],
    levels: LEVEL_TEMPLATES.map((level) => attachExerciseDetails(dataset, level)),
  };
}

export const getWorkoutPlan = [
  requireAuth,
  async (req, res) => {
    try {
      let dataset = [];
      let mediaStatus = null;

      try {
        dataset = await fetchExerciseDataset();
      } catch (datasetError) {
        mediaStatus =
          datasetError instanceof Error
            ? datasetError.message
            : "Exercise media is temporarily unavailable.";
      }

      return res.json({
        plan: {
          ...buildResponse(dataset),
          mediaStatus,
        },
        user: {
          id: req.user._id,
          name: req.user.name,
        },
      });
    } catch (error) {
      return res.status(502).json({
        error:
          error instanceof Error
            ? error.message
            : "Unable to build the workout plan right now.",
      });
    }
  },
];
