import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

jest.mock("../pages/Home", () => () => <div>Home Page</div>);
jest.mock("../pages/PestReports", () => () => <div>Pest Reports Page</div>);
jest.mock("../pages/PestEncyclopedia", () => () => <div>Pest Encyclopedia Page</div>);
jest.mock("../pages/Login", () => () => <div>Login Page</div>);
jest.mock("../pages/Register", () => () => <div>Register Page</div>);
jest.mock("../pages/Profile", () => () => <div>Profile Page</div>);

describe("App", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test("renders navbar", () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText("Pest Reporting System")).toBeInTheDocument();
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Pest Reports")).toBeInTheDocument();
        expect(screen.getByText("Pest Encyclopedia")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Register")).toBeInTheDocument();
    });

    test("shows user menu when currentUser exists", () => {
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                id: 1,
                username: "TEST",
                email: "test@example.com",
                role: "user",
            })
        );

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/TEST/)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/TEST/));
        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    test("logout removes currentUser", async () => {
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                id: 1,
                username: "TEST",
                email: "test@example.com",
                role: "user",
            })
        );

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/TEST/));
        fireEvent.click(screen.getByText("Logout"));

        await waitFor(() => {
            expect(localStorage.getItem("currentUser")).toBeNull();
        });
    });
});