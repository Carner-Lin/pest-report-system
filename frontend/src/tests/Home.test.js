import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";

jest.mock("../components/PestForm", () => ({ onSuccess }) => (
    <div>
        <p>Mock PestForm</p>
        <button onClick={onSuccess}>Finish Form</button>
    </div>
));

jest.mock("../components/SearchResultsPanel", () => ({ reports, onClose }) => (
    <div>
        <p>Mock Search Results: {reports.length}</p>
        <button onClick={onClose}>Close Search</button>
    </div>
));

jest.mock("../components/ReportDetailModal", () => ({ report, onClose }) => (
    <div>
        <p>Mock Detail Modal: {report?.custom_pest_name || report?.pest_name}</p>
        <button onClick={onClose}>Close Detail</button>
    </div>
));

jest.mock("../components/HomeMap", () => ({ reports, onViewDetail }) => (
    <div>
        <p>Mock HomeMap: {reports.length}</p>
        <button onClick={() => onViewDetail(reports[0])}>Open From Map</button>
    </div>
));

describe("Home", () => {
    const reports = [
        {
            id: 1,
            custom_pest_name: "German Wasp",
            username: "TEST",
            report_date: "2026-06-01",
            location_name: "Hamilton East, Hamilton, Waikato",
            image_url: "",
        },
        {
            id: 2,
            custom_pest_name: "Black Widow Spider",
            username: "TEST2",
            report_date: "2026-06-02",
            location_name: "Ruakura, Hamilton, Waikato",
            image_url: "",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        fetch.mockImplementation(async (url) => {
            if (String(url).includes("/api/reports")) {
                return {
                    ok: true,
                    json: async () => reports,
                };
            }
            return {
                ok: true,
                json: async () => [],
            };
        });
    });

    test("fetches and displays recent reports", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(await screen.findByText("German Wasp")).toBeInTheDocument();
        expect(screen.getByText("Black Widow Spider")).toBeInTheDocument();
        expect(screen.getByText("Recent Reports")).toBeInTheDocument();
    });

    test("shows login prompt when report button is clicked without login", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await screen.findByText("German Wasp");
        fireEvent.click(screen.getByText("Report a Pest"));

        expect(screen.getByText("Please login first")).toBeInTheDocument();
        expect(screen.getByText("To Login")).toBeInTheDocument();
    });

    test("opens report form when user is logged in", async () => {
        localStorage.setItem("currentUser", JSON.stringify({ id: 1, username: "TEST" }));

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await screen.findByText("German Wasp");
        fireEvent.click(screen.getByText("Report a Pest"));

        expect(screen.getByText("Mock PestForm")).toBeInTheDocument();
    });

    test("search shows search results panel", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await screen.findByText("German Wasp");

        fireEvent.change(screen.getByPlaceholderText("Start tracking pest in New Zealand"), {
            target: { value: "wasp" },
        });
        fireEvent.click(screen.getByText("Search"));

        expect(screen.getByText("Mock Search Results: 1")).toBeInTheDocument();
    });

    test("opens detail modal from recent report button", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await screen.findByText("German Wasp");
        fireEvent.click(screen.getAllByText("View Detail")[0]);

        expect(screen.getByText("Mock Detail Modal: German Wasp")).toBeInTheDocument();
    });

    test("refreshes reports after form success", async () => {
        localStorage.setItem("currentUser", JSON.stringify({ id: 1, username: "TEST" }));

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await screen.findByText("German Wasp");
        fireEvent.click(screen.getByText("Report a Pest"));
        fireEvent.click(screen.getByText("Finish Form"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });
});
