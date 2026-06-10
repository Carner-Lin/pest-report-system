import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../pages/Profile";

jest.mock("../components/ReportDetailModal", () => ({ report, onClose, canDelete, onDelete }) => (
    <div>
        <p>Mock Profile Modal: {report?.custom_pest_name || report?.pest_name}</p>
        <button onClick={onClose}>Close Modal</button>
        {canDelete && <button onClick={() => onDelete(report.id)}>Delete From Modal</button>}
    </div>
));

describe("Profile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        window.confirm = jest.fn(() => true);
    });

    test("shows no user logged in message", () => {
        render(<Profile />);
        expect(screen.getByText("No user is currently logged in.")).toBeInTheDocument();
    });

    test("renders my reports and noted reports for current user", async () => {
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                id: 1,
                username: "TEST",
                email: "test@example.com",
                role: "user",
            })
        );

        fetch.mockImplementation(async (url) => {
            const urlStr = String(url);

            if (urlStr.includes("/api/reports/user/1")) {
                return {
                    ok: true,
                    json: async () => [
                        {
                            id: 1,
                            custom_pest_name: "German Wasp",
                            report_date: "2026-06-01",
                            location_name: "Hamilton",
                        },
                    ],
                };
            }

            if (urlStr.includes("/api/reports/noted/1")) {
                return {
                    ok: true,
                    json: async () => [
                        {
                            id: 2,
                            custom_pest_name: "Black Widow Spider",
                            report_date: "2026-06-02",
                            location_name: "Ruakura",
                        },
                    ],
                };
            }

            return {
                ok: true,
                json: async () => [],
            };
        });

        render(<Profile />);

        expect(await screen.findByText("German Wasp")).toBeInTheDocument();
        expect(screen.getByText("Black Widow Spider")).toBeInTheDocument();
        expect(screen.getByText("Username:")).toBeInTheDocument();
    });

    test("removes noted report", async () => {
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                id: 1,
                username: "TEST",
                email: "test@example.com",
                role: "user",
            })
        );

        fetch.mockImplementation(async (url, options = {}) => {
            const urlStr = String(url);

            if (urlStr.includes("/api/reports/user/1")) {
                return {
                    ok: true,
                    json: async () => [],
                };
            }

            if (urlStr.includes("/api/reports/noted/1") && (!options.method || options.method === "GET")) {
                return {
                    ok: true,
                    json: async () => [
                        {
                            id: 2,
                            custom_pest_name: "Black Widow Spider",
                            report_date: "2026-06-02",
                            location_name: "Ruakura",
                        },
                    ],
                };
            }

            if (urlStr.includes("/api/reports/2/note/1") && options.method === "DELETE") {
                return {
                    ok: true,
                    json: async () => ({ message: "Note removed successfully." }),
                };
            }

            return {
                ok: true,
                json: async () => [],
            };
        });

        render(<Profile />);

        fireEvent.click(await screen.findByText("Remove Note"));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Note removed successfully.");
        });
    });

    test("deletes own report", async () => {
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                id: 1,
                username: "TEST",
                email: "test@example.com",
                role: "admin",
            })
        );

        fetch.mockImplementation(async (url, options = {}) => {
            const urlStr = String(url);

            if (urlStr.includes("/api/reports/user/1")) {
                return {
                    ok: true,
                    json: async () => [
                        {
                            id: 1,
                            custom_pest_name: "German Wasp",
                            report_date: "2026-06-01",
                            location_name: "Hamilton",
                        },
                    ],
                };
            }

            if (urlStr.includes("/api/reports/noted/1")) {
                return {
                    ok: true,
                    json: async () => [],
                };
            }

            if (urlStr.includes("/api/reports/1") && options.method === "DELETE") {
                return {
                    ok: true,
                    json: async () => ({ message: "Report deleted successfully." }),
                };
            }

            return {
                ok: true,
                json: async () => [],
            };
        });

        render(<Profile />);

        fireEvent.click(await screen.findByText("Delete"));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Report deleted successfully.");
        });
    });
});
