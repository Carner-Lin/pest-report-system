import { render, screen, fireEvent } from "@testing-library/react";
import PestLocationSection from "../components/pestForm/PestLocationSection";

jest.mock("../components/LocationPickerMap", () => ({
    __esModule: true,
    default: ({ onSelectLocation }) => (
        <div>
            <p>Mock LocationPickerMap</p>
            <button
                type="button"
                onClick={() =>
                    onSelectLocation({
                        lat: -37.787,
                        lng: 175.279,
                    })
                }
            >
                Pick Map Location
            </button>
        </div>
    ),
}));

describe("PestLocationSection", () => {
    const formData = {
        location_name: "",
        latitude: "",
        longitude: "",
    };

    test("renders location section", () => {
        render(
            <PestLocationSection
                formData={formData}
                locationMessage=""
                onChange={jest.fn()}
                onUseTypedLocation={jest.fn()}
                onSelectLocation={jest.fn()}
            />
        );

        expect(screen.getByText("Select report location")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter address")).toBeInTheDocument();
        expect(screen.getByText("Locate")).toBeInTheDocument();
        expect(screen.getByText("Mock LocationPickerMap")).toBeInTheDocument();
    });

    test("calls onChange when address input changes", () => {
        const onChange = jest.fn();

        render(
            <PestLocationSection
                formData={formData}
                locationMessage=""
                onChange={onChange}
                onUseTypedLocation={jest.fn()}
                onSelectLocation={jest.fn()}
            />
        );

        fireEvent.change(screen.getByPlaceholderText("Enter address"), {
            target: { value: "Hamilton", name: "location_name" },
        });

        expect(onChange).toHaveBeenCalled();
    });

    test("calls onUseTypedLocation when locate button is clicked", () => {
        const onUseTypedLocation = jest.fn();

        render(
            <PestLocationSection
                formData={formData}
                locationMessage=""
                onChange={jest.fn()}
                onUseTypedLocation={onUseTypedLocation}
                onSelectLocation={jest.fn()}
            />
        );

        fireEvent.click(screen.getByText("Locate"));
        expect(onUseTypedLocation).toHaveBeenCalled();
    });

    test("shows location message", () => {
        render(
            <PestLocationSection
                formData={formData}
                locationMessage="Invalid address."
                onChange={jest.fn()}
                onUseTypedLocation={jest.fn()}
                onSelectLocation={jest.fn()}
            />
        );

        expect(screen.getByText("Invalid address.")).toBeInTheDocument();
    });

    test("shows selected coordinates when location exists", () => {
        render(
            <PestLocationSection
                formData={{
                    location_name: "Hamilton",
                    latitude: -37.787,
                    longitude: 175.279,
                }}
                locationMessage=""
                onChange={jest.fn()}
                onUseTypedLocation={jest.fn()}
                onSelectLocation={jest.fn()}
            />
        );

        expect(screen.getByText(/Selected coordinates:/)).toBeInTheDocument();
    });
});