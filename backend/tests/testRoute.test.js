jest.mock("../db", () => ({
    query: jest.fn(),
}));

const request = require("supertest");
const app = require("../app");

describe("Test Route", () => {
    test("GET /api/test should return backend working message", async () => {
        const res = await request(app).get("/api/test");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Backend is working" });
    });
});