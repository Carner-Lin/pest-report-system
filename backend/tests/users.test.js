const request = require("supertest");
const bcrypt = require("bcryptjs");

jest.mock("../db", () => ({
    query: jest.fn(),
}));

const db = require("../db");
const app = require("../app");

describe("Users API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should register a new user successfully", async () => {
        db.query
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, []);
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { insertId: 1 });
            });

        const res = await request(app).post("/api/users/register").send({
            username: "testuser",
            email: "test@example.com",
            password: "123456",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully.");
        expect(res.body.userId).toBe(1);
    });

    test("should reject registration when fields are missing", async () => {
        const res = await request(app).post("/api/users/register").send({
            username: "",
            email: "test@example.com",
            password: "123456",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username, email, and password are required.");
    });

    test("should reject duplicate email during registration", async () => {
        db.query.mockImplementationOnce((sql, params, callback) => {
            callback(null, [{ id: 1 }]);
        });

        const res = await request(app).post("/api/users/register").send({
            username: "testuser",
            email: "test@example.com",
            password: "123456",
        });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe("Email already exists.");
    });

    test("should login successfully with correct password", async () => {
        const hashedPassword = await bcrypt.hash("123456", 10);

        db.query.mockImplementation((sql, params, callback) => {
            callback(null, [
                {
                    id: 1,
                    username: "testuser",
                    email: "test@example.com",
                    password: hashedPassword,
                    role: "user",
                },
            ]);
        });

        const res = await request(app).post("/api/users/login").send({
            email: "test@example.com",
            password: "123456",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful.");
        expect(res.body.user.email).toBe("test@example.com");
        expect(res.body.user.role).toBe("user");
    });

    test("should reject login when fields are missing", async () => {
        const res = await request(app).post("/api/users/login").send({
            email: "",
            password: "",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Email and password are required.");
    });

    test("should reject login when user does not exist", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, []);
        });

        const res = await request(app).post("/api/users/login").send({
            email: "missing@example.com",
            password: "123456",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Invalid email or password.");
    });

    test("should reject login with wrong password", async () => {
        const hashedPassword = await bcrypt.hash("123456", 10);

        db.query.mockImplementation((sql, params, callback) => {
            callback(null, [
                {
                    id: 1,
                    username: "testuser",
                    email: "test@example.com",
                    password: hashedPassword,
                    role: "user",
                },
            ]);
        });

        const res = await request(app).post("/api/users/login").send({
            email: "test@example.com",
            password: "wrongpassword",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Invalid email or password.");
    });

    test("should return all users", async () => {
        db.query.mockImplementation((sql, callback) => {
            callback(null, [
                {
                    id: 1,
                    username: "testuser",
                    email: "test@example.com",
                    created_at: "2026-06-01",
                },
            ]);
        });

        const res = await request(app).get("/api/users");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].username).toBe("testuser");
    });
});