import { render, screen, fireEvent } from "@testing-library/react";
import SearchResultsPanel from "../components/SearchResultsPanel";

describe("SearchResultsPanel", () => {
    const reports = [
        {
            id: 1,
            custom_pest_name: "German Wasp",
            username: "TEST",
            report_date: "2026-06-01",
            location_name: "Hamilton East, Hamilton, Waikato",
        },
    ];

    test("renders empty message when no reports", () => {
        render(
            <SearchResultsPanel
                reports={[]}
                expanded={true}
                onToggle={jest.fn()}
                onClose={jest.fn()}
                onFocusMap={jest.fn()}
                onViewDetail={jest.fn()}
            />
        );

        expect(screen.getByText("No matching pest reports found.")).toBeInTheDocument();
    });

    test("renders reports and triggers actions", () => {
        const onToggle = jest.fn();
        const onClose = jest.fn();
        const onFocusMap = jest.fn();
        const onViewDetail = jest.fn();

        render(
            <SearchResultsPanel
                reports={reports}
                expanded={true}
                onToggle={onToggle}
                onClose={onClose}
                onFocusMap={onFocusMap}
                onViewDetail={onViewDetail}
            />
        );

        expect(screen.getByText("German Wasp")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /Close search results/i }));
        expect(onClose).toHaveBeenCalled();

        fireEvent.click(screen.getByText("View Detail"));
        expect(onViewDetail).toHaveBeenCalledWith(reports[0]);

        fireEvent.click(screen.getByText("Show on Map"));
        expect(onFocusMap).toHaveBeenCalledWith(reports[0]);

        fireEvent.click(screen.getByRole("button", { expanded: true }));
        expect(onToggle).toHaveBeenCalled();
    });
});