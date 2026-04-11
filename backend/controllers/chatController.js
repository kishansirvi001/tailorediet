const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function extractTextFromGemini(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || ""
  );
}

export async function chat(req, res) {
  const { message } = req.body;

  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is missing on the backend.' });
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: 'You are TailorDiet assistant: a helpful, safety-first dietitian and fitness coach. Answer user queries about lifestyle improvement, diet planning, and fitness in a concise, actionable manner. Ask clarifying questions when needed.',
            },
          ],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: String(message) }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 800,
          responseMimeType: 'text/plain',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error?.message || 'Chat request failed.';
      return res.status(response.status).json({ error: msg });
    }

    const rawText = extractTextFromGemini(data);

    if (!rawText) {
      return res.status(502).json({ error: 'Model returned an empty response.' });
    }

    return res.json({ reply: rawText });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected error' });
  }
}
