import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportDetailModal from "../components/ReportDetailModal";

describe("ReportDetailModal", () => {
    const report = {
        id: 1,
        custom_pest_name: "Black Widow Spider",
        username: "TEST",
        report_date: "2026-06-01",
        pest_type: "Spider",
        status_choice: "Regulated",
        notifiable_choice: "No",
        description: "A venomous spider",
        location_name: "Ruakura, Hamilton",
        latitude: -37.78,
        longitude: 175.31,
        image_url: "",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test("renders report details", () => {
        render(<ReportDetailModal report={report} onClose={jest.fn()} />);

        expect(screen.getByText("Report Details")).toBeInTheDocument();
        expect(screen.getByText("Black Widow Spider")).toBeInTheDocument();
        expect(screen.getByText("No image uploaded")).toBeInTheDocument();
        expect(screen.getByText("Reported Location")).toBeInTheDocument();
    });

    test("calls onClose when close button is clicked", () => {
        const onClose = jest.fn();

        render(<ReportDetailModal report={report} onClose={onClose} />);
        fireEvent.click(screen.getByText("×"));

        expect(onClose).toHaveBeenCalled();
    });

    test("alerts when note button clicked without login", () => {
        render(<ReportDetailModal report={report} onClose={jest.fn()} />);
        fireEvent.click(screen.getByRole("button", { name: "Noted" }));

        expect(window.alert).toHaveBeenCalledWith("Please login first.");
    });

    test("sends note request successfully when logged in", async () => {
        localStorage.setItem(
            "currentUser",
            JSON.stringify({ id: 1, username: "TEST", role: "user" })
        );

        fetch.mockImplementation(async (url, options = {}) => {
            const urlStr = String(url);

            if (urlStr.includes(`/api/reports/noted/1`) && (!options.method || options.method === "GET")) {
                return {
                    json: async () => [],
                };
            }

            if (urlStr.includes(`/api/reports/${report.id}/note`) && options.method === "POST") {
                return {
                    ok: true,
                    json: async () => ({ message: "Report noted successfully." }),
                };
            }

            return {
                ok: true,
                json: async () => [],
            };
        });

        render(<ReportDetailModal report={report} onClose={jest.fn()} />);

        const btn = await screen.findByRole("button", { name: "Noted" });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining(`/api/reports/${report.id}/note`),
                expect.objectContaining({
                    method: "POST",
                })
            );
        });
    });

    test("shows delete button for admin and triggers onDelete", () => {
        const onDelete = jest.fn();

        render(
            <ReportDetailModal
                report={report}
                onClose={jest.fn()}
                canDelete={true}
                onDelete={onDelete}
            />
        );

        fireEvent.click(screen.getByText("Delete Report"));
        expect(onDelete).toHaveBeenCalledWith(1);
    });
});
