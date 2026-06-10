import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/Register";

describe("Register", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders register form", () => {
        const { container } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();

        const usernameInput = container.querySelector('input[name="username"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        expect(usernameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });

    test("shows success message and clears form on successful registration", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                message: "Registration successful.",
            }),
        });

        const { container } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        const usernameInput = container.querySelector('input[name="username"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        fireEvent.change(usernameInput, {
            target: { value: "TEST" },
        });
        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(await screen.findByText("Registration successful.")).toBeInTheDocument();

        await waitFor(() => {
            expect(usernameInput).toHaveValue("");
            expect(emailInput).toHaveValue("");
            expect(passwordInput).toHaveValue("");
        });
    });

    test("shows backend error message on failed registration", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Email already exists.",
            }),
        });

        const { container } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        const usernameInput = container.querySelector('input[name="username"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        fireEvent.change(usernameInput, {
            target: { value: "TEST" },
        });
        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(await screen.findByText("Email already exists.")).toBeInTheDocument();
    });

    test("shows server error when fetch throws", async () => {
        fetch.mockRejectedValue(new Error("network error"));

        const { container } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        const usernameInput = container.querySelector('input[name="username"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        fireEvent.change(usernameInput, {
            target: { value: "TEST" },
        });
        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(await screen.findByText("Server error.")).toBeInTheDocument();
    });
});