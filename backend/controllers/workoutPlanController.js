import { findExerciseByName } from "./exerciseController.js";

const FITNESS_LEVELS = ["beginner", "intermediate", "advanced"];

const GOALS = {
  "muscle-gain": "muscle-gain",
  "fat-loss": "fat-loss",
  strength: "strength",
  endurance: "endurance",
  recomposition: "recomposition",
  muscle: "muscle-gain",
  hypertrophy: "muscle-gain",
  cutting: "fat-loss",
  weightloss: "fat-loss",
  recomp: "recomposition",
};

const CATEGORY_CONFIG = {
  "chest-triceps": {
    label: "Chest & Triceps",
    countByLevel: {
      beginner: 6,
      intermediate: 7,
      advanced: 8,
    },
    exercises: [
      {
        name: "Bench Press",
        lookupName: "Bench Press",
        targetMuscles: ["Chest", "Triceps", "Shoulders"],
        slot: "compound",
      },
      {
        name: "Incline Dumbbell Press",
        lookupName: "Incline Dumbbell Press",
        targetMuscles: ["Upper Chest", "Triceps", "Shoulders"],
        slot: "compound",
      },
      {
        name: "Machine Chest Press",
        lookupName: "Machine Chest Press",
        targetMuscles: ["Chest", "Triceps"],
        slot: "compound",
      },
      {
        name: "Cable Fly",
        lookupName: "Cable Fly",
        targetMuscles: ["Chest"],
        slot: "isolation",
      },
      {
        name: "Close Grip Bench Press",
        lookupName: "Close Grip Bench Press",
        targetMuscles: ["Triceps", "Chest", "Shoulders"],
        slot: "compound",
      },
      {
        name: "Tricep Pushdown",
        lookupName: "Tricep Pushdown",
        targetMuscles: ["Triceps"],
        slot: "isolation",
      },
      {
        name: "Overhead Cable Extension",
        lookupName: "Overhead Cable Extension",
        targetMuscles: ["Triceps"],
        slot: "isolation",
      },
      {
        name: "Bench Dips",
        lookupName: "Bench Dips",
        targetMuscles: ["Triceps", "Chest", "Shoulders"],
        slot: "bodyweight",
      },
    ],
  },
  "back-biceps": {
    label: "Back & Biceps",
    countByLevel: {
      beginner: 6,
      intermediate: 7,
      advanced: 8,
    },
    exercises: [
      {
        name: "Lat Pulldown",
        lookupName: "Lat Pulldown",
        targetMuscles: ["Lats", "Upper Back", "Biceps"],
        slot: "compound",
      },
      {
        name: "Seated Row",
        lookupName: "Seated Row",
        targetMuscles: ["Back", "Lats", "Biceps"],
        slot: "compound",
      },
      {
        name: "Barbell Row",
        lookupName: "Barbell Row",
        targetMuscles: ["Back", "Lats", "Rear Delts"],
        slot: "compound",
      },
      {
        name: "One-arm Dumbbell Row",
        lookupName: "One-arm Dumbbell Row",
        targetMuscles: ["Lats", "Mid Back", "Biceps"],
        slot: "compound",
      },
      {
        name: "Face Pull",
        lookupName: "Face Pull",
        targetMuscles: ["Rear Delts", "Upper Back"],
        slot: "isolation",
      },
      {
        name: "Barbell Curl",
        lookupName: "Barbell Curl",
        targetMuscles: ["Biceps"],
        slot: "isolation",
      },
      {
        name: "Hammer Curl",
        lookupName: "Hammer Curl",
        targetMuscles: ["Biceps", "Forearms"],
        slot: "isolation",
      },
      {
        name: "Preacher Curl",
        lookupName: "Preacher Curl",
        targetMuscles: ["Biceps"],
        slot: "isolation",
      },
    ],
  },
  "legs-shoulders": {
    label: "Legs & Shoulders",
    countByLevel: {
      beginner: 6,
      intermediate: 7,
      advanced: 8,
    },
    exercises: [
      {
        name: "Squat",
        lookupName: "Squat",
        targetMuscles: ["Quadriceps", "Glutes", "Core"],
        slot: "compound",
      },
      {
        name: "Leg Press",
        lookupName: "Leg Press",
        targetMuscles: ["Quadriceps", "Glutes"],
        slot: "compound",
      },
      {
        name: "Walking Lunges",
        lookupName: "Walking Lunges",
        targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
        slot: "compound",
      },
      {
        name: "Leg Extension",
        lookupName: "Leg Extension",
        targetMuscles: ["Quadriceps"],
        slot: "isolation",
      },
      {
        name: "Leg Curl",
        lookupName: "Leg Curl",
        targetMuscles: ["Hamstrings"],
        slot: "isolation",
      },
      {
        name: "Shoulder Press",
        lookupName: "Shoulder Press",
        targetMuscles: ["Shoulders", "Triceps"],
        slot: "compound",
      },
      {
        name: "Lateral Raise",
        lookupName: "Lateral Raise",
        targetMuscles: ["Side Delts"],
        slot: "isolation",
      },
      {
        name: "Rear Delt Fly",
        lookupName: "Rear Delt Fly",
        targetMuscles: ["Rear Delts", "Upper Back"],
        slot: "isolation",
      },
    ],
  },
};

const SLOT_RULES = {
  "muscle-gain": {
    beginner: {
      compound: { sets: 3, reps: "8-12", rest: "60-90 seconds" },
      isolation: { sets: 3, reps: "10-15", rest: "45-60 seconds" },
      bodyweight: { sets: 3, reps: "10-15", rest: "45-60 seconds" },
    },
    intermediate: {
      compound: { sets: 4, reps: "8-12", rest: "60-90 seconds" },
      isolation: { sets: 3, reps: "10-15", rest: "45-60 seconds" },
      bodyweight: { sets: 3, reps: "12-15", rest: "45-60 seconds" },
    },
    advanced: {
      compound: { sets: 4, reps: "6-10", rest: "90 seconds" },
      isolation: { sets: 4, reps: "10-15", rest: "45-60 seconds" },
      bodyweight: { sets: 4, reps: "12-15", rest: "45-60 seconds" },
    },
  },
  "fat-loss": {
    beginner: {
      compound: { sets: 3, reps: "10-12", rest: "45-60 seconds" },
      isolation: { sets: 3, reps: "12-15", rest: "30-45 seconds" },
      bodyweight: { sets: 3, reps: "12-15", rest: "30-45 seconds" },
    },
    intermediate: {
      compound: { sets: 4, reps: "10-12", rest: "45-60 seconds" },
      isolation: { sets: 3, reps: "12-15", rest: "30-45 seconds" },
      bodyweight: { sets: 3, reps: "15-20", rest: "30-45 seconds" },
    },
    advanced: {
      compound: { sets: 4, reps: "8-12", rest: "45-60 seconds" },
      isolation: { sets: 4, reps: "12-15", rest: "30-45 seconds" },
      bodyweight: { sets: 4, reps: "15-20", rest: "30-45 seconds" },
    },
  },
  strength: {
    beginner: {
      compound: { sets: 4, reps: "5-8", rest: "90-120 seconds" },
      isolation: { sets: 3, reps: "8-12", rest: "60 seconds" },
      bodyweight: { sets: 3, reps: "8-12", rest: "60 seconds" },
    },
    intermediate: {
      compound: { sets: 4, reps: "4-6", rest: "120 seconds" },
      isolation: { sets: 3, reps: "8-10", rest: "60 seconds" },
      bodyweight: { sets: 3, reps: "10-12", rest: "60 seconds" },
    },
    advanced: {
      compound: { sets: 5, reps: "3-6", rest: "120-150 seconds" },
      isolation: { sets: 4, reps: "8-10", rest: "60 seconds" },
      bodyweight: { sets: 4, reps: "10-12", rest: "60 seconds" },
    },
  },
  endurance: {
    beginner: {
      compound: { sets: 3, reps: "12-15", rest: "45-60 seconds" },
      isolation: { sets: 3, reps: "15-20", rest: "30-45 seconds" },
      bodyweight: { sets: 3, reps: "15-20", rest: "30-45 seconds" },
    },
    intermediate: {
      compound: { sets: 4, reps: "12-15", rest: "45-60 seconds" },
      isolation: { sets: 3, reps: "15-20", rest: "30-45 seconds" },
      bodyweight: { sets: 3, reps: "15-20", rest: "30-45 seconds" },
    },
    advanced: {
      compound: { sets: 4, reps: "10-15", rest: "45-60 seconds" },
      isolation: { sets: 4, reps: "15-20", rest: "30-45 seconds" },
      bodyweight: { sets: 4, reps: "15-20", rest: "30-45 seconds" },
    },
  },
  recomposition: {
    beginner: {
      compound: { sets: 3, reps: "8-12", rest: "60-90 seconds" },
      isolation: { sets: 3, reps: "10-15", rest: "45-60 seconds" },
      bodyweight: { sets: 3, reps: "12-15", rest: "45-60 seconds" },
    },
    intermediate: {
      compound: { sets: 4, reps: "8-10", rest: "60-90 seconds" },
      isolation: { sets: 3, reps: "10-15", rest: "45-60 seconds" },
      bodyweight: { sets: 3, reps: "12-15", rest: "45-60 seconds" },
    },
    advanced: {
      compound: { sets: 4, reps: "6-10", rest: "75-90 seconds" },
      isolation: { sets: 4, reps: "10-15", rest: "45-60 seconds" },
      bodyweight: { sets: 4, reps: "12-15", rest: "45-60 seconds" },
    },
  },
};

function normalizeInput(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeGoal(value) {
  const normalized = normalizeInput(value).replace(/-/g, "");
  return GOALS[normalized] || GOALS[normalizeInput(value)] || null;
}

function normalizeCategory(value) {
  const normalized = normalizeInput(value);

  if (CATEGORY_CONFIG[normalized]) {
    return normalized;
  }

  const aliases = {
    chesttriceps: "chest-triceps",
    backbiceps: "back-biceps",
    legsshoulders: "legs-shoulders",
  };

  return aliases[normalized.replace(/-/g, "")] || null;
}

function buildGifUrl(req, exerciseName) {
  const origin = `${req.protocol}://${req.get("host")}`;
  return `${origin}/api/exercise/gif/${encodeURIComponent(exerciseName)}`;
}

function validateRequest(input) {
  const fitnessLevel = normalizeInput(input?.fitnessLevel);
  const goal = normalizeGoal(input?.goal);
  const categoryKey = normalizeCategory(input?.category);

  if (!FITNESS_LEVELS.includes(fitnessLevel)) {
    return {
      error: `fitnessLevel must be one of: ${FITNESS_LEVELS.join(", ")}`,
    };
  }

  if (!goal) {
    return {
      error:
        "goal must map to one of: muscle-gain, fat-loss, strength, endurance, recomposition",
    };
  }

  if (!categoryKey) {
    return {
      error:
        "category must be one of: Chest & Triceps, Back & Biceps, Legs & Shoulders",
    };
  }

  return {
    fitnessLevel,
    goal,
    categoryKey,
  };
}

async function buildExercise(goal, fitnessLevel, req, exercise) {
  const rules = SLOT_RULES[goal][fitnessLevel][exercise.slot];
  const media = await findExerciseByName(exercise.lookupName);

  return {
    name: exercise.name,
    targetMuscles: exercise.targetMuscles,
    sets: rules.sets,
    reps: rules.reps,
    rest: rules.rest,
    gifUrl: media?.gifUrl || buildGifUrl(req, exercise.lookupName),
    demoFrames:
      Array.isArray(media?.frameUrls) && media.frameUrls.length > 0
        ? media.frameUrls
        : media?.gifUrl
          ? [media.gifUrl]
          : [buildGifUrl(req, exercise.lookupName)],
  };
}

async function buildWorkoutSelection(req, { fitnessLevel, goal, categoryKey }) {
  const category = CATEGORY_CONFIG[categoryKey];
  const exerciseCount = category.countByLevel[fitnessLevel];

  return {
    category: category.label,
    exercises: await Promise.all(
      category.exercises
        .slice(0, exerciseCount)
        .map((exercise) => buildExercise(goal, fitnessLevel, req, exercise))
    ),
  };
}

async function sendWorkoutSelection(req, res, input) {
  const validation = validateRequest(input);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  return res.json(await buildWorkoutSelection(req, validation));
}

export async function getWorkoutPlan(req, res) {
  return sendWorkoutSelection(req, res, req.query);
}

export async function generateWorkoutPlan(req, res) {
  return sendWorkoutSelection(req, res, req.body);
}
