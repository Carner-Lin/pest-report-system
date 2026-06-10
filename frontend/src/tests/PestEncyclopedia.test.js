import { render, screen, waitFor } from "@testing-library/react";
import PestEncyclopedia from "../pages/PestEncyclopedia";

describe("PestEncyclopedia", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("shows loading text first", () => {
        fetch.mockImplementation(() => new Promise(() => {}));

        render(<PestEncyclopedia />);
        expect(screen.getByText("Loading pest data...")).toBeInTheDocument();
    });

    test("renders pest cards after fetch", async () => {
        fetch.mockResolvedValue({
            json: async () => [
                {
                    id: 1,
                    name: "German Wasp",
                    organism_type: "Insect",
                    regulatory_status: "Non-regulated",
                    notifiable: 0,
                    image_url: "",
                    description: "A wasp species.",
                },
            ],
        });

        render(<PestEncyclopedia />);

        expect(await screen.findByText("German Wasp")).toBeInTheDocument();
        expect(screen.getByText(/Type:/)).toBeInTheDocument();
        expect(screen.getByText(/Status:/)).toBeInTheDocument();
        expect(screen.getByText("No Image")).toBeInTheDocument();
    });

    test("handles fetch error and hides loading", async () => {
        fetch.mockRejectedValue(new Error("fetch failed"));

        render(<PestEncyclopedia />);

        await waitFor(() => {
            expect(screen.queryByText("Loading pest data...")).not.toBeInTheDocument();
        });

        expect(screen.getByText("Pest Encyclopedia")).toBeInTheDocument();
    });
});