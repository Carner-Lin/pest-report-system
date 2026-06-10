import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PestReports from "../pages/PestReports";

jest.mock("../components/ReportDetailModal", () => ({ report, onClose, canDelete, onDelete }) => (
    <div>
        <p>Mock Report Modal: {report?.custom_pest_name || report?.pest_name}</p>
        <button onClick={onClose}>Close Modal</button>
        {canDelete && <button onClick={() => onDelete(report.id)}>Delete From Modal</button>}
    </div>
));

describe("PestReports", () => {
    const reports = [
        {
            id: 1,
            custom_pest_name: "Black Widow Spider",
            username: "TEST",
            report_date: "2026-06-01",
            location_name: "Hamilton East, Hamilton, Waikato",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        window.confirm = jest.fn(() => true);
    });

    test("shows loading then renders reports", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => reports,
        });

        render(<PestReports />);

        expect(screen.getByText("Loading reports...")).toBeInTheDocument();
        expect(await screen.findByText("Black Widow Spider")).toBeInTheDocument();
    });

    test("shows empty message when no reports exist", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        render(<PestReports />);

        expect(await screen.findByText("No pest reports have been submitted yet.")).toBeInTheDocument();
    });

    test("opens detail modal when a report card is clicked", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => reports,
        });

        render(<PestReports />);

        fireEvent.click(await screen.findByText("Black Widow Spider"));
        expect(screen.getByText("Mock Report Modal: Black Widow Spider")).toBeInTheDocument();
    });

    test("deletes report as admin", async () => {
        localStorage.setItem(
            "currentUser",
            JSON.stringify({ id: 1, username: "ADMIN", role: "admin" })
        );

        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => reports,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Report deleted successfully." }),
            });

        render(<PestReports />);

        fireEvent.click(await screen.findByText("Black Widow Spider"));
        fireEvent.click(screen.getByText("Delete From Modal"));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Report deleted successfully.");
        });
    });
});
