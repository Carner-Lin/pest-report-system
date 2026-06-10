const request = require("supertest");
const express = require("express");

const mockGenerateContent = jest.fn();

jest.mock("@google/genai", () => ({
    GoogleGenAI: jest.fn().mockImplementation(() => ({
        models: {
            generateContent: mockGenerateContent,
        },
    })),
}));

jest.mock("../db", () => ({
    query: jest.fn(),
}));

describe("AI API", () => {
    let tempApp;

    beforeEach(() => {
        jest.resetModules();
        process.env.GEMINI_API_KEY = "fake-key";
        mockGenerateContent.mockReset();

        const aiRouter = require("../routes/ai");
        tempApp = express();
        tempApp.use("/api/ai", aiRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should reject request if image is missing", async () => {
        const res = await request(tempApp).post("/api/ai/identify-pest");

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Image is required.");
    });

    test("should reject request if GEMINI_API_KEY is missing", async () => {
        delete process.env.GEMINI_API_KEY;

        jest.resetModules();
        const aiRouter = require("../routes/ai");
        tempApp = express();
        tempApp.use("/api/ai", aiRouter);

        const res = await request(tempApp)
            .post("/api/ai/identify-pest")
            .attach("image", Buffer.from("fake image"), "test.jpg");

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("GEMINI_API_KEY is missing.");
    });

    test("should identify pest successfully", async () => {
        mockGenerateContent.mockResolvedValue({
            text: JSON.stringify({
                predicted_name: "German Wasp",
                predicted_type: "Insect",
                confidence: 0.87,
                description: "A wasp species that can spread quickly.",
            }),
        });

        const res = await request(tempApp)
            .post("/api/ai/identify-pest")
            .attach("image", Buffer.from("fake image"), "test.jpg");

        expect(res.statusCode).toBe(200);
        expect(res.body.predicted_name).toBe("German Wasp");
        expect(res.body.predicted_type).toBe("Insect");
        expect(res.body.confidence).toBe(0.87);
        expect(res.body.description).toBe("A wasp species that can spread quickly.");
    });

    test("should return 500 if AI service fails", async () => {
        mockGenerateContent.mockRejectedValue(new Error("AI failed"));

        const res = await request(tempApp)
            .post("/api/ai/identify-pest")
            .attach("image", Buffer.from("fake image"), "test.jpg");

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Failed to identify pest.");
    });
});