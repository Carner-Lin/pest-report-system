const request = require("supertest");

jest.mock("../db", () => ({
    query: jest.fn(),
}));

const db = require("../db");
const app = require("../app");

describe("Reports API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return all reports", async () => {
        db.query.mockImplementation((sql, callback) => {
            callback(null, [
                {
                    id: 1,
                    custom_pest_name: "Black Widow Spider",
                    latitude: "-37.78",
                    longitude: "175.31",
                },
            ]);
        });

        const res = await request(app).get("/api/reports");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].custom_pest_name).toBe("Black Widow Spider");
        expect(typeof res.body[0].latitude).toBe("number");
        expect(typeof res.body[0].longitude).toBe("number");
    });

    test("should return reports for a user", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, [
                {
                    id: 2,
                    user_id: 1,
                    custom_pest_name: "Asian Tiger Mosquito",
                    latitude: "-37.79",
                    longitude: "175.30",
                },
            ]);
        });

        const res = await request(app).get("/api/reports/user/1");

        expect(res.statusCode).toBe(200);
        expect(res.body[0].user_id).toBe(1);
    });

    test("should return noted reports for a user", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, [
                {
                    id: 3,
                    custom_pest_name: "Johnson grass",
                    latitude: "-37.77",
                    longitude: "175.30",
                },
            ]);
        });

        const res = await request(app).get("/api/reports/noted/1");

        expect(res.statusCode).toBe(200);
        expect(res.body[0].custom_pest_name).toBe("Johnson grass");
    });

    test("should reject report submission if pest is missing", async () => {
        const res = await request(app).post("/api/reports").send({
            user_id: 1,
            description: "test report",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Pest required");
    });

    test("should submit a report successfully", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null);
        });

        const res = await request(app).post("/api/reports").send({
            user_id: 1,
            pest_id: 2,
            custom_pest_name: "",
            pest_type: "Insect",
            description: "Test description",
            location_name: "Hamilton",
            latitude: -37.78,
            longitude: 175.28,
            image_url: null,
            status_choice: "Uncertain",
            notifiable_choice: "Uncertain",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Report submitted");
    });

    test("should note a report successfully", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null);
        });

        const res = await request(app)
            .post("/api/reports/5/note")
            .send({ userId: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Report noted successfully.");
    });

    test("should reject noting a report if userId is missing", async () => {
        const res = await request(app).post("/api/reports/5/note").send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("User ID is required.");
    });

    test("should return 409 if report is already noted", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback({ code: "ER_DUP_ENTRY" });
        });

        const res = await request(app)
            .post("/api/reports/5/note")
            .send({ userId: 1 });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe("Report already noted.");
    });

    test("should remove a noted report successfully", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app).delete("/api/reports/5/note/1");

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Noted report removed successfully.");
    });

    test("should return 404 if noted report is not found", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const res = await request(app).delete("/api/reports/5/note/1");

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Noted report not found.");
    });

    test("should reject delete report when currentUserId is missing", async () => {
        const res = await request(app).delete("/api/reports/10").send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Current user ID is required.");
    });

    test("should reject delete report when user is not admin", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, [{ role: "user" }]);
        });

        const res = await request(app)
            .delete("/api/reports/10")
            .send({ currentUserId: 1 });

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Only admin can delete reports.");
    });

    test("should delete report successfully when user is admin", async () => {
        db.query
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [{ role: "admin" }]);
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { affectedRows: 1 });
            });

        const res = await request(app)
            .delete("/api/reports/10")
            .send({ currentUserId: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Report deleted successfully.");
    });

    test("should return 404 when deleting a report that does not exist", async () => {
        db.query
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [{ role: "admin" }]);
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { affectedRows: 0 });
            });

        const res = await request(app)
            .delete("/api/reports/999")
            .send({ currentUserId: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Report not found.");
    });
});