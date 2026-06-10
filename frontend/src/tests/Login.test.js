import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";

describe("Login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test("renders login form", () => {
        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });

    test("shows success message and stores currentUser on successful login", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                user: {
                    id: 1,
                    username: "TEST",
                    email: "test@example.com",
                    role: "user",
                },
            }),
        });

        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "123456" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Login successful.")).toBeInTheDocument();

        await waitFor(() => {
            expect(JSON.parse(localStorage.getItem("currentUser")).username).toBe("TEST");
        });
    });

    test("shows backend error message on failed login", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Invalid email or password.",
            }),
        });

        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        fireEvent.change(emailInput, {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "wrong" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    });

    test("shows server error when fetch throws", async () => {
        fetch.mockRejectedValue(new Error("network error"));

        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "123456" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("network error")).toBeInTheDocument();
    });
});
