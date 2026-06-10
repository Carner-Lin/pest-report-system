const request = require("supertest");

jest.mock("../db", () => ({
    query: jest.fn(),
}));

const db = require("../db");
const app = require("../app");

describe("Pests API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return all pests", async () => {
        db.query.mockImplementation((sql, callback) => {
            callback(null, [
                { id: 1, name: "Argentine Ant" },
                { id: 2, name: "German Wasp" },
            ]);
        });

        const res = await request(app).get("/api/pests");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
        expect(res.body[0].name).toBe("Argentine Ant");
    });

    test("should return 500 if database query fails", async () => {
        db.query.mockImplementation((sql, callback) => {
            callback({ error: "Database error" }, null);
        });

        const res = await request(app).get("/api/pests");

        expect(res.statusCode).toBe(500);
    });
});