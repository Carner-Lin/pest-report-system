import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useMap } from "@vis.gl/react-google-maps";
import HomeMap from "../components/HomeMap";

describe("HomeMap", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders legend items", () => {
        render(
            <HomeMap
                reports={[]}
                selectedReport={null}
                setSelectedReport={jest.fn()}
                focusReport={null}
                onViewDetail={jest.fn()}
            />
        );

        expect(screen.getByText("Legend")).toBeInTheDocument();
        expect(screen.getByText("Insect")).toBeInTheDocument();
        expect(screen.getByText("Mammal")).toBeInTheDocument();
        expect(screen.getByText("Plant")).toBeInTheDocument();
        expect(screen.getByText("Bird")).toBeInTheDocument();
        expect(screen.getByText("Spider")).toBeInTheDocument();
        expect(screen.getByText("Other")).toBeInTheDocument();
    });

    test("renders markers only for valid reports and selects marker on click", () => {
        const setSelectedReport = jest.fn();
        const reports = [
            { id: 1, custom_pest_name: "German Wasp", pest_type: "Insect", latitude: -37.78, longitude: 175.31 },
            { id: 2, custom_pest_name: "Invalid", pest_type: "Insect", latitude: null, longitude: null },
        ];

        render(
            <HomeMap
                reports={reports}
                selectedReport={null}
                setSelectedReport={setSelectedReport}
                focusReport={null}
                onViewDetail={jest.fn()}
            />
        );

        const markers = screen.getAllByTestId("mock-advanced-marker");
        expect(markers).toHaveLength(1);

        fireEvent.click(markers[0]);
        expect(setSelectedReport).toHaveBeenCalledWith(reports[0]);
    });

    test("shows popup for selected report and triggers view detail", () => {
        const onViewDetail = jest.fn();
        const selectedReport = {
            id: 1,
            custom_pest_name: "German Wasp",
            pest_type: "Insect",
            latitude: -37.78,
            longitude: 175.31,
            location_name: "Hamilton",
        };

        render(
            <HomeMap
                reports={[selectedReport]}
                selectedReport={selectedReport}
                setSelectedReport={jest.fn()}
                focusReport={null}
                onViewDetail={onViewDetail}
            />
        );

        fireEvent.click(screen.getByText("View Report Detail"));
        expect(onViewDetail).toHaveBeenCalledWith(selectedReport);
    });

    test("pans map when focusReport changes", async () => {
        const panTo = jest.fn();
        const setZoom = jest.fn();
        useMap.mockReturnValue({
            panTo,
            setZoom,
            addListener: jest.fn(() => ({ remove: jest.fn() })),
        });

        const focusReport = {
            id: 1,
            latitude: -37.78,
            longitude: 175.31,
        };

        render(
            <HomeMap
                reports={[]}
                selectedReport={null}
                setSelectedReport={jest.fn()}
                focusReport={focusReport}
                onViewDetail={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(panTo).toHaveBeenCalledWith({
                lat: -37.78,
                lng: 175.31,
            });
            expect(setZoom).toHaveBeenCalledWith(14);
        });
    });
});