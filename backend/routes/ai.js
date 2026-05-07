const express = require("express");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

router.post("/identify-pest", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image is required." });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
        }

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

        const imagePart = {
            inlineData: {
                mimeType: req.file.mimetype,
                data: req.file.buffer.toString("base64"),
            },
        };

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