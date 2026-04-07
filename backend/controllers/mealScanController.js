const GEMINI_VISION_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function parseDataUrl(input) {
  const value = String(input || "").trim();
  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    base64Data: match[2],
  };
}

function buildPrompt() {
  return `
Analyze the food in this image and estimate nutrition for the visible meal.

Rules:
- Return valid JSON only.
- Focus on Indian home-style meals when relevant, but identify any cuisine accurately.
- If multiple foods are present, estimate the main meal and list visible components.
- Be honest about uncertainty and avoid pretending exact accuracy.
- Give nutrition per 100 grams so the app can recalculate after the user confirms quantity.
- Also estimate the visible portion in grams from the image.

Return this exact JSON shape:
{
  "mealName": "string",
  "summary": "string",
  "confidence": "low | medium | high",
  "visibleItems": ["string"],
  "estimatedPortion": {
    "quantityLabel": "string",
    "estimatedWeightGrams": 0
  },
  "nutritionPer100g": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0
  },
  "detectedPortionNutrition": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0
  },
  "accuracyTips": ["string"],
  "disclaimer": "string"
}
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

function roundNutrition(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, Math.round(parsed * 10) / 10);
}

function normalizeScanResult(result) {
  const estimatedWeightGrams = Math.max(
    1,
    Math.round(Number(result?.estimatedPortion?.estimatedWeightGrams) || 0)
  );

  const nutritionPer100g = {
    calories: roundNutrition(result?.nutritionPer100g?.calories),
    protein: roundNutrition(result?.nutritionPer100g?.protein),
    carbs: roundNutrition(result?.nutritionPer100g?.carbs),
    fat: roundNutrition(result?.nutritionPer100g?.fat),
  };

  const multiplier = estimatedWeightGrams / 100;

  return {
    mealName: result?.mealName || "Estimated meal",
    summary: result?.summary || "Nutrition estimated from the uploaded meal photo.",
    confidence: ["low", "medium", "high"].includes(result?.confidence)
      ? result.confidence
      : "medium",
    visibleItems: Array.isArray(result?.visibleItems) ? result.visibleItems : [],
    estimatedPortion: {
      quantityLabel:
        result?.estimatedPortion?.quantityLabel || `${estimatedWeightGrams} g visible in the photo`,
      estimatedWeightGrams,
    },
    nutritionPer100g,
    detectedPortionNutrition: {
      calories: roundNutrition(
        result?.detectedPortionNutrition?.calories ?? nutritionPer100g.calories * multiplier
      ),
      protein: roundNutrition(
        result?.detectedPortionNutrition?.protein ?? nutritionPer100g.protein * multiplier
      ),
      carbs: roundNutrition(
        result?.detectedPortionNutrition?.carbs ?? nutritionPer100g.carbs * multiplier
      ),
      fat: roundNutrition(
        result?.detectedPortionNutrition?.fat ?? nutritionPer100g.fat * multiplier
      ),
    },
    accuracyTips: Array.isArray(result?.accuracyTips) ? result.accuracyTips : [],
    disclaimer:
      result?.disclaimer ||
      "This is an AI estimate and should be treated as approximate, especially for mixed dishes.",
  };
}

export async function scanMeal(req, res) {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is missing on the backend. Add it before scanning meals.",
    });
  }

  const parsedImage = parseDataUrl(req.body?.imageBase64);

  if (!parsedImage) {
    return res.status(400).json({
      error: "Upload a valid image in data URL format.",
    });
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(parsedImage.mimeType)) {
    return res.status(400).json({
      error: "Only JPG, PNG, and WEBP meal photos are supported.",
    });
  }

  try {
    const response = await fetch(GEMINI_VISION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: "You are a careful nutrition assistant. Analyze food photos conservatively and always return valid JSON.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              { text: buildPrompt() },
              {
                inline_data: {
                  mime_type: parsedImage.mimeType,
                  data: parsedImage.base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini request failed while scanning the meal photo.",
      });
    }

    const rawText = extractTextFromGemini(data);

    if (!rawText) {
      return res.status(502).json({
        error: "Gemini returned an empty meal analysis. Please try another photo.",
      });
    }

    const parsedResult = parseJsonResponse(rawText);

    return res.json({
      analysis: normalizeScanResult(parsedResult),
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while scanning the meal photo.",
    });
  }
}
