import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PestForm from "../components/PestForm";

jest.mock("../components/pestForm/PestLocationSection", () => ({
    __esModule: true,
    default: ({ onSelectLocation, onUseTypedLocation, locationMessage, formData, onChange }) => (
        <div>
            <p>Mock PestLocationSection</p>
            <input
                placeholder="Mock location input"
                name="location_name"
                value={formData.location_name}
                onChange={onChange}
            />
            <button
                type="button"
                onClick={() =>
                    onSelectLocation({
                        lat: -37.787,
                        lng: 175.279,
                    })
                }
            >
                Pick Mock Location
            </button>
            <button type="button" onClick={onUseTypedLocation}>
                Mock Locate
            </button>
            {locationMessage && <p>{locationMessage}</p>}
        </div>
    ),
}));

describe("PestForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                id: 1,
                username: "TEST",
            })
        );
    });

    test("loads pests and renders split sections", async () => {
        fetch.mockResolvedValue({
            json: async () => [
                {
                    id: 1,
                    name: "German Wasp",
                    organism_type: "Insect",
                    description: "A wasp",
                    regulatory_status: "Regulated",
                    notifiable: 1,
                },
            ],
        });

        render(<PestForm />);

        expect(await screen.findByText("Report details")).toBeInTheDocument();
        expect(screen.getByText("Upload pest image")).toBeInTheDocument();
        expect(screen.getByText("Mock PestLocationSection")).toBeInTheDocument();
    });

    test("selecting a pest from database autofills fields", async () => {
        fetch.mockResolvedValue({
            json: async () => [
                {
                    id: 1,
                    name: "German Wasp",
                    organism_type: "Insect",
                    description: "A wasp",
                    regulatory_status: "Regulated",
                    notifiable: 1,
                },
            ],
        });

        render(<PestForm />);

        const select = await screen.findByDisplayValue("-- Select from database --");
        fireEvent.change(select, { target: { value: "1" } });

        expect(screen.getByPlaceholderText("Enter pest name")).toHaveValue("German Wasp");
        expect(screen.getByPlaceholderText("Enter pest type")).toHaveValue("Insect");
        expect(screen.getByPlaceholderText("Enter pest description")).toHaveValue("A wasp");
        expect(screen.getByDisplayValue("Regulated")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Yes")).toBeInTheDocument();
    });

    test("shows validation message when pest name is missing", async () => {
        fetch.mockResolvedValue({
            json: async () => [],
        });

        render(<PestForm />);

        fireEvent.click(await screen.findByText("Submit Report"));

        expect(
            screen.getByText("Please enter a pest name or select one from the database.")
        ).toBeInTheDocument();
    });

    test("shows validation message when location is missing", async () => {
        fetch.mockResolvedValue({
            json: async () => [],
        });

        render(<PestForm />);

        fireEvent.change(await screen.findByPlaceholderText("Enter pest name"), {
            target: { value: "Test Pest" },
        });

        fireEvent.click(screen.getByText("Submit Report"));

        expect(
            screen.getByText("Please select a location on the map or validate the address.")
        ).toBeInTheDocument();
    });

    test("submits a report successfully with image", async () => {
        const onSuccess = jest.fn();

        fetch
            .mockResolvedValueOnce({
                json: async () => [],
            }) // initial /api/pests
            .mockResolvedValueOnce({
                json: async () => ({
                    address: {
                        road: "Victoria Street",
                        city: "Hamilton",
                        state: "Waikato",
                    },
                }),
            }) // reverse geocoding after map click
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    message: "Report submitted successfully.",
                    image_url: "http://localhost:5000/uploads/test.jpg",
                }),
            }); // final report submit

        const { container } = render(<PestForm onSuccess={onSuccess} />);

        fireEvent.change(await screen.findByPlaceholderText("Enter pest name"), {
            target: { value: "Test Pest" },
        });

        const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
        const input = container.querySelector("#pest-image-upload");

        fireEvent.change(input, {
            target: { files: [file] },
        });

        fireEvent.click(screen.getByText("Pick Mock Location"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        fireEvent.click(screen.getByText("Submit Report"));

        expect(
            await screen.findByText("Report submitted successfully.")
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(fetch).toHaveBeenLastCalledWith(
                expect.stringContaining("/api/reports"),
                expect.objectContaining({
                    method: "POST",
                    body: expect.any(FormData),
                })
            );
        });
    });

    test("identifies pest with AI after image upload", async () => {
        fetch
            .mockResolvedValueOnce({
                json: async () => [],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    predicted_name: "Puriri Moth",
                    predicted_type: "Insect",
                    confidence: 0.95,
                    description: "A moth species.",
                }),
            });

        const { container } = render(<PestForm />);
        await screen.findByText("Upload pest image");

        const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
        const input = container.querySelector("#pest-image-upload");

        fireEvent.change(input, {
            target: { files: [file] },
        });

        fireEvent.click(screen.getByText("Identify with AI"));

        expect(await screen.findByText(/AI Predicted Name:/)).toBeInTheDocument();
        expect(screen.getByText(/Puriri Moth/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter pest name")).toHaveValue("Puriri Moth");
        expect(screen.getByPlaceholderText("Enter pest type")).toHaveValue("Insect");
    });
});