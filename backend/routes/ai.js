const express = require("express");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

// This route handles AI-based pest identification from uploaded images.
const router = express.Router();

// Store uploaded AI images in memory because they are sent directly to Gemini.
const upload = multer({ storage: multer.memoryStorage() });

// Create the Gemini client with the configured API key.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// POST /api/ai/identify-pest
// Analyze an uploaded image and return a structured pest prediction.
router.post("/identify-pest", upload.single("image"), async (req, res) => {
    try {
        // Reject requests without an uploaded image.
        if (!req.file) {
            return res.status(400).json({ error: "Image is required." });
        }

        // Reject requests when the Gemini API key is missing.
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
        }

        // Ask Gemini to return a strict JSON structure for the frontend.
        const prompt = `
You are an AI assistant for a New Zealand pest reporting system.

Analyze the uploaded image and identify the most likely pest.

Return JSON only in this exact structure:
{
  "predicted_name": "string",
  "predicted_type": "Insect | Spider | Bird | Mammal | Plant | Other",
  "confidence": number,
  "description": "string"
}

Rules:
- confidence must be between 0 and 1
- be cautious if uncertain
- description should be one short sentence
- predicted_type must be exactly one of:
  Insect, Spider, Bird, Mammal, Plant, Other
`;

        // Convert the uploaded image buffer into Gemini inline data.
        const imagePart = {
            inlineData: {
                mimeType: req.file.mimetype,
                data: req.file.buffer.toString("base64"),
            },
        };

        // Send the prompt and image to Gemini and request JSON output.
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        imagePart,
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
            },
        });

        // Parse the model response and provide safe fallback values.
        const rawText = result.text;
        const parsed = JSON.parse(rawText);

        res.json({
            predicted_name: parsed.predicted_name || "Unknown",
            predicted_type: parsed.predicted_type || "Other",
            confidence:
                typeof parsed.confidence === "number" ? parsed.confidence : 0.3,
            description:
                parsed.description || "AI could not confidently identify this pest.",
        });
    } catch (error) {
        console.error("Gemini identify error:", error);
        res.status(500).json({ error: "Failed to identify pest." });
    }
});

module.exports = router;