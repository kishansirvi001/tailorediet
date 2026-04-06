const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateDietRequest(body) {
  const requiredTextFields = [
    "name",
    "gender",
    "goal",
    "activityLevel",
    "dietPreference",
    "region",
    "budget",
    "cookingTime",
  ];

  for (const field of requiredTextFields) {
    if (!String(body[field] || "").trim()) {
      return `${field} is required`;
    }
  }

  const age = toNumber(body.age);
  const weight = toNumber(body.weight);
  const height = toNumber(body.height);
  const mealsPerDay = toNumber(body.mealsPerDay);

  if (age === null || age < 13 || age > 90) {
    return "age must be between 13 and 90";
  }

  if (weight === null || weight < 30 || weight > 250) {
    return "weight must be between 30kg and 250kg";
  }

  if (height === null || height < 120 || height > 230) {
    return "height must be between 120cm and 230cm";
  }

  if (mealsPerDay === null || mealsPerDay < 2 || mealsPerDay > 8) {
    return "mealsPerDay must be between 2 and 8";
  }

  return null;
}

function buildPrompt(profile) {
  const allergies = normalizeList(profile.allergies);
  const dislikes = normalizeList(profile.dislikedFoods);
  const conditions = normalizeList(profile.medicalConditions);

  return `
Create a detailed personalized Indian diet plan for this user. The plan must use familiar India-specific foods only and avoid foreign or western meal suggestions unless the user explicitly asked for them. Prefer realistic Indian home-style meals such as dal, roti, sabzi, daliya, poha, idli, dosa, upma, curd rice, khichdi, paneer, chana, rajma, sprouts, millets, eggs, chicken, fish, seasonal fruits, buttermilk, and regional dishes that match the user's region and diet preference.

Important rules:
- The plan must be practical for Indian users.
- Do not suggest quinoa bowls, burritos, avocado toast, smoothies with imported berries, or other foreign foods unless unavoidable.
- Respect allergies and medical conditions strictly.
- Keep ingredients affordable and locally available in India.
- Mention water intake and meal timing.
- Keep the tone helpful and concrete.
- Output valid JSON only. Do not include markdown fences.

Return JSON with this exact shape:
{
  "profileSummary": "short paragraph",
  "dailyTargets": {
    "calories": "string",
    "protein": "string",
    "carbs": "string",
    "fats": "string",
    "water": "string"
  },
  "planOverview": {
    "goalStrategy": "string",
    "mealPattern": "string",
    "foodsToPrioritize": ["string"],
    "foodsToAvoid": ["string"]
  },
  "fullDayPlan": [
    {
      "meal": "Breakfast",
      "time": "string",
      "items": ["string"],
      "notes": "string",
      "estimatedCalories": "string"
    }
  ],
  "weeklyTips": ["string"],
  "shoppingList": ["string"],
  "importantNote": "string"
}

User profile:
- Name: ${profile.name}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Weight: ${profile.weight} kg
- Height: ${profile.height} cm
- Goal: ${profile.goal}
- Activity level: ${profile.activityLevel}
- Diet preference: ${profile.dietPreference}
- Region in India: ${profile.region}
- Meals per day: ${profile.mealsPerDay}
- Budget: ${profile.budget}
- Available cooking time: ${profile.cookingTime}
- Allergies: ${allergies.length > 0 ? allergies.join(", ") : "None"}
- Foods disliked: ${dislikes.length > 0 ? dislikes.join(", ") : "None"}
- Medical conditions or restrictions: ${conditions.length > 0 ? conditions.join(", ") : "None"}
- Additional notes: ${profile.additionalNotes ? profile.additionalNotes : "None"}
`;
}

function extractTextFromGemini(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || ""
  );
}

function parseJsonResponse(rawText) {
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

export async function generateDietPlan(req, res) {
  const validationError = validateDietRequest(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error:
        "GEMINI_API_KEY is missing on the backend. Add it to backend/.env before generating diet plans.",
    });
  }

  const prompt = buildPrompt(req.body);

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: "You are an expert Indian dietitian. Create safe, practical, India-specific meal plans. Always return valid JSON.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message || "Gemini request failed while generating the diet plan.";

      return res.status(response.status).json({ error: message });
    }

    const rawText = extractTextFromGemini(data);

    if (!rawText) {
      return res.status(502).json({
        error: "Gemini returned an empty response. Please try again.",
      });
    }

    const plan = parseJsonResponse(rawText);

    return res.json({ plan });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while generating the diet plan.",
    });
  }
}
