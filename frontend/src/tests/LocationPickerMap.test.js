import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useMap } from "@vis.gl/react-google-maps";
import LocationPickerMap from "../components/LocationPickerMap";

describe("LocationPickerMap", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("uses current location successfully", () => {
        const onSelectLocation = jest.fn();

        const getCurrentPosition = jest.fn((success) => {
            success({
                coords: {
                    latitude: -37.787,
                    longitude: 175.279,
                },
            });
        });

        Object.defineProperty(navigator, "geolocation", {
            value: { getCurrentPosition },
            configurable: true,
        });

        render(
            <LocationPickerMap
                selectedLocation={null}
                onSelectLocation={onSelectLocation}
            />
        );

        fireEvent.click(screen.getByText("Use My Current Location"));

        expect(onSelectLocation).toHaveBeenCalledWith({
            lat: -37.787,
            lng: 175.279,
        });
    });

    test("alerts when geolocation is not supported", () => {
        const onSelectLocation = jest.fn();

        Object.defineProperty(navigator, "geolocation", {
            value: undefined,
            configurable: true,
        });

        render(
            <LocationPickerMap
                selectedLocation={null}
                onSelectLocation={onSelectLocation}
            />
        );

        fireEvent.click(screen.getByText("Use My Current Location"));
        expect(window.alert).toHaveBeenCalledWith(
            "Geolocation is not supported by this browser."
        );
    });

    test("pans map when selectedLocation exists", async () => {
        const panTo = jest.fn();
        const setZoom = jest.fn();

        useMap.mockReturnValue({
            panTo,
            setZoom,
            addListener: jest.fn(() => ({ remove: jest.fn() })),
        });

        render(
            <LocationPickerMap
                selectedLocation={{ lat: -37.787, lng: 175.279 }}
                onSelectLocation={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(panTo).toHaveBeenCalledWith({
                lat: -37.787,
                lng: 175.279,
            });
            expect(setZoom).toHaveBeenCalledWith(15);
        });
    });

    test("renders marker for selected location", () => {
        render(
            <LocationPickerMap
                selectedLocation={{ lat: -37.787, lng: 175.279 }}
                onSelectLocation={jest.fn()}
            />
        );

        expect(screen.getByTestId("mock-marker")).toBeInTheDocument();
    });
});